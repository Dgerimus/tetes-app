<script setup>
import { onMounted } from 'vue'
import { useStocks } from '../composables/useStocks'
import ColumnFilters from '../components/ColumnFilters.vue'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import StatsInfo from '../components/StatsInfo.vue'
import LoadingState from '../components/LoadingState.vue'
import StocksCharts from '../components/charts/StocksCharts.vue'

const props = defineProps({
  showFilters: Boolean,
})

const emit = defineEmits([
  'toggle-filters',
  'update-date-filters',
  'update-column-filters',
  'reset-filters',
])

const {
  stocksData,
  stocksLoading,
  stocksError,
  stocksPagination,
  stocksDateFilters,
  stocksColumnFilters,
  stocksUniqueValues,
  stocksFilteredData,
  fetchStocksData,
  resetStocksColumnFilters,
  changeStocksPage,
  changeStocksPerPage,
  resetStocksToToday,
  setStocksDefaultDate,
} = useStocks()

// Локальные обработчики
const handleApplyFilters = () => fetchStocksData(1)
const handleResetDates = () => resetStocksToToday()
const handleToggleFilters = () => emit('toggle-filters')
const handlePageChange = (page) => changeStocksPage(page)
const handlePerPageChange = (newPerPage) => changeStocksPerPage(newPerPage)

const handleUpdateDateFilters = (newFilters) => {
  stocksDateFilters.value.dateFrom = newFilters.dateFrom
}

const handleUpdateColumnFilters = (newFilters) => {
  Object.assign(stocksColumnFilters.value, newFilters)
}

const handleResetColumnFilters = () => {
  resetStocksColumnFilters()
}

// Инициализация
onMounted(() => {
  setStocksDefaultDate()
  fetchStocksData(1)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <!-- Заголовок и фильтры -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-900">🏪 Склады</h1>

      <!-- Фильтры дат (только dateFrom для stocks) -->
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-lg"
      >
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium text-gray-700 whitespace-nowrap">Дата:</label>
          <input
            type="date"
            :value="stocksDateFilters.dateFrom"
            @input="handleUpdateDateFilters({ dateFrom: $event.target.value })"
            class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <div class="flex gap-2">
          <button
            @click="handleApplyFilters"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
            :disabled="stocksLoading"
          >
            {{ stocksLoading ? '⏳' : '🔍' }} Применить
          </button>

          <button
            @click="handleResetDates"
            class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
            :disabled="stocksLoading"
          >
            📅 Сегодня
          </button>

          <button
            @click="handleToggleFilters"
            class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
          >
            {{ props.showFilters ? '❌' : '⚡' }} Фильтры
          </button>
        </div>
      </div>
    </div>

    <ColumnFilters
      :column-filters="stocksColumnFilters"
      :unique-values="stocksUniqueValues"
      :show-filters="props.showFilters"
      :page-type="'stocks'"
      @update:columnFilters="handleUpdateColumnFilters"
      @reset-filters="handleResetColumnFilters"
    />

    <LoadingState :loading="stocksLoading" :error="stocksError" />

    <StatsInfo
      v-if="stocksData.length > 0"
      :filtered-data="stocksFilteredData"
      :table-data="stocksData"
      :pagination="stocksPagination"
      :date-filters="stocksDateFilters"
      :column-filters="stocksColumnFilters"
      :page-type="'stocks'"
    />

    <DataTable
      v-if="stocksData.length > 0"
      :data="stocksFilteredData"
      :loading="stocksLoading"
      :page-type="'stocks'"
    />

    <Pagination
      v-if="stocksData.length > 0 && stocksPagination.totalPages > 1"
      :pagination="stocksPagination"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
    />

    <!-- ГРАФИКИ СКЛАДОВ -->
    <StocksCharts v-if="stocksData.length > 0" :data="stocksData" />

    <div v-else-if="!stocksLoading" class="text-center py-12">
      <div class="text-gray-400 text-lg mb-2">📭 Нет данных для отображения</div>
      <p class="text-gray-500 text-sm">Попробуйте изменить дату или обновить страницу</p>
    </div>
  </div>
</template>
