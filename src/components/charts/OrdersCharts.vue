<script setup>
import { computed } from 'vue'
import BaseChart from './BaseChart.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})

// График 1: Заказы по складам (круговая)
const warehouseChartData = computed(() => {
  const warehouseOrders = {}

  props.data.forEach((item) => {
    const warehouse = item.warehouse_name || 'Неизвестно'
    warehouseOrders[warehouse] = (warehouseOrders[warehouse] || 0) + 1
  })

  const labels = Object.keys(warehouseOrders)
  const data = Object.values(warehouseOrders)

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
      text: '📦 Заказы по складам',
    },
  },
}

// График 2: Распределение скидок (столбчатая)
const discountDistributionChartData = computed(() => {
  const discountRanges = {
    '0%': 0,
    '1-10%': 0,
    '11-20%': 0,
    '21-30%': 0,
    '31-40%': 0,
    '41-50%': 0,
    '50%+': 0,
  }

  props.data.forEach((item) => {
    const discount = parseFloat(item.discount_percent) || 0

    if (discount === 0) discountRanges['0%']++
    else if (discount <= 10) discountRanges['1-10%']++
    else if (discount <= 20) discountRanges['11-20%']++
    else if (discount <= 30) discountRanges['21-30%']++
    else if (discount <= 40) discountRanges['31-40%']++
    else if (discount <= 50) discountRanges['41-50%']++
    else discountRanges['50%+']++
  })

  return {
    labels: Object.keys(discountRanges),
    datasets: [
      {
        label: 'Количество заказов',
        data: Object.values(discountRanges),
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        borderWidth: 1,
      },
    ],
  }
})

const discountDistributionChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '🎯 Распределение заказов по скидкам',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Количество заказов',
      },
      ticks: {
        callback: function (value) {
          return value + ' шт'
        },
      },
    },
    x: {
      title: {
        display: true,
        text: 'Размер скидки',
      },
    },
  },
}

// График 3: Средняя скидка по брендам (столбчатая)
const discountChartData = computed(() => {
  const brandDiscounts = {}
  const brandCounts = {}

  props.data.forEach((item) => {
    const brand = item.brand || 'Неизвестно'
    const discount = parseFloat(item.discount_percent) || 0

    if (!brandDiscounts[brand]) {
      brandDiscounts[brand] = 0
      brandCounts[brand] = 0
    }

    brandDiscounts[brand] += discount
    brandCounts[brand] += 1
  })

  // Вычисляем среднюю скидку и берем топ-5
  const avgDiscounts = Object.entries(brandDiscounts)
    .map(([brand, totalDiscount]) => ({
      brand,
      avgDiscount: totalDiscount / brandCounts[brand],
    }))
    .sort((a, b) => b.avgDiscount - a.avgDiscount)
    .slice(0, 5)

  const labels = avgDiscounts.map((item) => item.brand)
  const data = avgDiscounts.map((item) => item.avgDiscount)

  return {
    labels,
    datasets: [
      {
        label: 'Средняя скидка %',
        data,
        backgroundColor: '#FFCE56',
        borderColor: '#FFCE56',
        borderWidth: 1,
      },
    ],
  }
})

const discountChartOptions = {
  plugins: {
    title: {
      display: true,
      text: '🏷️ Средняя скидка по брендам',
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return value + '%'
        },
      },
    },
  },
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    <!-- Заказы по складам -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart type="pie" :data="warehouseChartData" :options="warehouseChartOptions" />
    </div>

    <!-- Распределение скидок -->
    <div class="bg-white p-4 rounded-lg shadow-sm">
      <BaseChart
        type="bar"
        :data="discountDistributionChartData"
        :options="discountDistributionChartOptions"
      />
    </div>

    <!-- Средняя скидка по брендам -->
    <div class="bg-white p-4 rounded-lg shadow-sm lg:col-span-2">
      <BaseChart type="bar" :data="discountChartData" :options="discountChartOptions" />
    </div>
  </div>
</template>
