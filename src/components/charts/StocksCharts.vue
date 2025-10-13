<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

// График 1: Остатки по складам (круговая)
const warehouseStockChartData = computed(() => {
  const warehouseStocks = {}

  props.data.forEach((item) => {
    const warehouse = item.warehouse_name || 'Неизвестно'
    const quantity = parseFloat(item.quantity) || 0
    warehouseStocks[warehouse] = (warehouseStocks[warehouse] || 0) + quantity
  })

  const labels = Object.keys(warehouseStocks)
  const data = Object.values(warehouseStocks)

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

const warehouseStockChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '🏪 Остатки по складам',
    },
  },
}

// График 2: Топ брендов по остаткам (столбчатая)
const brandsStockChartData = computed(() => {
  const brandStocks = {}

  props.data.forEach((item) => {
    const brand = item.brand || 'Неизвестно'
    const quantity = parseFloat(item.quantity) || 0
    brandStocks[brand] = (brandStocks[brand] || 0) + quantity
  })

  // Сортируем по убыванию и берем топ-5
  const sortedBrands = Object.entries(brandStocks)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const labels = sortedBrands.map(([brand]) => brand)
  const data = sortedBrands.map(([, stock]) => stock)

  return {
    labels,
    datasets: [
      {
        label: 'Количество',
        data,
        backgroundColor: '#9966FF',
        borderColor: '#9966FF',
        borderWidth: 1,
      },
    ],
  }
})

const brandsStockChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '🏷️ Топ брендов по остаткам',
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

// График 3: Распределение по количеству (гистограмма)
const quantityDistributionChartData = computed(() => {
  const quantityRanges = {
    0: 0,
    '1-10': 0,
    '11-50': 0,
    '51-100': 0,
    '100+': 0,
  }

  props.data.forEach((item) => {
    const quantity = parseFloat(item.quantity) || 0

    if (quantity === 0) quantityRanges['0']++
    else if (quantity <= 10) quantityRanges['1-10']++
    else if (quantity <= 50) quantityRanges['11-50']++
    else if (quantity <= 100) quantityRanges['51-100']++
    else quantityRanges['100+']++
  })

  return {
    labels: Object.keys(quantityRanges),
    datasets: [
      {
        label: 'Количество товаров',
        data: Object.values(quantityRanges),
        backgroundColor: '#FF9F40',
        borderColor: '#FF9F40',
        borderWidth: 1,
      },
    ],
  }
})

const quantityDistributionChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '📊 Распределение товаров по количеству',
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
    <!-- Остатки по складам -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart type="pie" :data="warehouseStockChartData" :options="warehouseStockChartOptions" />
    </div>

    <!-- Топ брендов -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart type="bar" :data="brandsStockChartData" :options="brandsStockChartOptions" />
    </div>

    <!-- Распределение по количеству -->
    <div class="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
      <BaseChart
        type="bar"
        :data="quantityDistributionChartData"
        :options="quantityDistributionChartOptions"
      />
    </div>
  </div>
</template>
