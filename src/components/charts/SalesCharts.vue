<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

// График 1: Продажи по складам (круговая)
const warehouseChartData = computed(() => {
  const warehouseSales = {}

  props.data.forEach((item) => {
    const warehouse = item.warehouse_name || 'Неизвестно'
    const price = parseFloat(item.total_price) || 0
    warehouseSales[warehouse] = (warehouseSales[warehouse] || 0) + price
  })

  const labels = Object.keys(warehouseSales)
  const data = Object.values(warehouseSales)

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#FF6384',
          '#C9CBCF',
        ],
        borderWidth: 2,
      },
    ],
  }
})

const warehouseChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '💰 Продажи по складам',
    },
  },
}

// График 2: Продажи по дням (линейный)
const dailySalesChartData = computed(() => {
  const dailySales = {}

  props.data.forEach((item) => {
    const date = item.date.split(' ')[0] // Берем только дату без времени
    const price = parseFloat(item.total_price) || 0
    dailySales[date] = (dailySales[date] || 0) + price
  })

  const labels = Object.keys(dailySales).sort()
  const data = labels.map((date) => dailySales[date])

  return {
    labels,
    datasets: [
      {
        label: 'Выручка',
        data,
        borderColor: '#36A2EB',
        backgroundColor: 'rgba(54, 162, 235, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
})

const dailySalesChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '📈 Выручка по дням',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value.toLocaleString('ru-RU') + ' ₽'
        },
      },
    },
  },
}

// График 3: Топ брендов по выручке (столбчатая)
const brandsChartData = computed(() => {
  const brandSales = {}

  props.data.forEach((item) => {
    const brand = item.brand || 'Неизвестно'
    const price = parseFloat(item.total_price) || 0
    brandSales[brand] = (brandSales[brand] || 0) + price
  })

  // Сортируем по убыванию и берем топ-5
  const sortedBrands = Object.entries(brandSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const labels = sortedBrands.map(([brand]) => brand)
  const data = sortedBrands.map(([, sales]) => sales)

  return {
    labels,
    datasets: [
      {
        label: 'Выручка',
        data,
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        borderWidth: 1,
      },
    ],
  }
})

const brandsChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '🏷️ Топ брендов по выручке',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value.toLocaleString('ru-RU') + ' ₽'
        },
      },
    },
  },
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- Продажи по складам -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart type="pie" :data="warehouseChartData" :options="warehouseChartOptions" />
    </div>

    <!-- Выручка по дням -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart type="line" :data="dailySalesChartData" :options="dailySalesChartOptions" />
    </div>

    <!-- Топ брендов -->
    <div class="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
      <BaseChart type="bar" :data="brandsChartData" :options="brandsChartOptions" />
    </div>
  </div>
</template>
