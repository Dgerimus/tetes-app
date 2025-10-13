<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

// График 1: Поступления по складам (круговая)
const warehouseIncomesChartData = computed(() => {
  const warehouseIncomes = {}

  props.data.forEach((item) => {
    const warehouse = item.warehouse_name || 'Неизвестно'
    const quantity = parseFloat(item.quantity) || 0
    warehouseIncomes[warehouse] = (warehouseIncomes[warehouse] || 0) + quantity
  })

  const labels = Object.keys(warehouseIncomes)
  const data = Object.values(warehouseIncomes)

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

const warehouseIncomesChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '🏪 Поступления по складам',
    },
  },
}

// График 2: Поступления по дням (линейный)
const dailyIncomesChartData = computed(() => {
  const dailyIncomes = {}

  props.data.forEach((item) => {
    const date = item.date
    const quantity = parseFloat(item.quantity) || 0
    dailyIncomes[date] = (dailyIncomes[date] || 0) + quantity
  })

  const labels = Object.keys(dailyIncomes).sort()
  const data = labels.map((date) => dailyIncomes[date])

  return {
    labels,
    datasets: [
      {
        label: 'Количество поступлений',
        data,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }
})

const dailyIncomesChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '📈 Поступления по дням',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value + ' шт'
        },
      },
    },
  },
}

// График 3: Топ товаров по поступлениям (столбчатая)
const topItemsChartData = computed(() => {
  const itemIncomes = {}

  props.data.forEach((item) => {
    const article = item.supplier_article || 'Неизвестно'
    const quantity = parseFloat(item.quantity) || 0
    itemIncomes[article] = (itemIncomes[article] || 0) + quantity
  })

  // Сортируем по убыванию и берем топ-5
  const sortedItems = Object.entries(itemIncomes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const labels = sortedItems.map(([article]) => article.substring(0, 10) + '...') // Обрезаем длинные названия
  const data = sortedItems.map(([, quantity]) => quantity)

  return {
    labels,
    datasets: [
      {
        label: 'Количество',
        data,
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  }
})

const topItemsChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '📦 Топ товаров по поступлениям',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value + ' шт'
        },
      },
    },
  },
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- Поступления по складам -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart
        type="pie"
        :data="warehouseIncomesChartData"
        :options="warehouseIncomesChartOptions"
      />
    </div>

    <!-- Поступления по дням -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart type="line" :data="dailyIncomesChartData" :options="dailyIncomesChartOptions" />
    </div>

    <!-- Топ товаров -->
    <div class="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
      <BaseChart type="bar" :data="topItemsChartData" :options="topItemsChartOptions" />
    </div>
  </div>
</template>
