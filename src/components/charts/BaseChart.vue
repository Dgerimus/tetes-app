<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const props = defineProps({
  type: {
    type: String,
    default: 'bar',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  options: {
    type: Object,
    default: () => ({}),
  },
})

const canvasRef = ref(null)
const chartInstance = ref(null)

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart',
    },
  },
}

const initChart = () => {
  if (canvasRef.value && props.data) {
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }

    chartInstance.value = new Chart(canvasRef.value, {
      type: props.type,
      data: props.data,
      options: { ...defaultOptions, ...props.options },
    })
  }
}

onMounted(initChart)

watch(
  () => props.data,
  () => {
    if (chartInstance.value && props.data) {
      chartInstance.value.data = props.data
      chartInstance.value.update()
    }
  },
  { deep: true },
)

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})
</script>

<template>
  <div class="chart-container">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}
</style>
