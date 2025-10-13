<script setup>
import { onMounted } from 'vue'
import { useSales } from '../composables/useSales'
import DateFilters from '../components/DateFilters.vue'
import ColumnFilters from '../components/ColumnFilters.vue'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import StatsInfo from '../components/StatsInfo.vue'
import LoadingState from '../components/LoadingState.vue'
import SalesCharts from '../components/charts/SalesCharts.vue'

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
  salesData,
  salesLoading,
  salesError,
  salesPagination,
  salesDateFilters,
  salesColumnFilters,
  salesUniqueValues,
  salesFilteredData,
  fetchSalesData,
  resetSalesColumnFilters,
  changeSalesPage,
  changeSalesPerPage,
  resetSalesToLast30Days,
  setSalesDefaultDates,
} = useSales()

// Локальные обработчики
const handleApplyFilters = () => fetchSalesData(1)
const handleResetDates = () => resetSalesToLast30Days()
const handleToggleFilters = () => emit('toggle-filters')
const handlePageChange = (page) => changeSalesPage(page)
const handlePerPageChange = (newPerPage) => changeSalesPerPage(newPerPage)

const handleUpdateDateFilters = (newFilters) => {
  salesDateFilters.value.dateFrom = newFilters.dateFrom
  salesDateFilters.value.dateTo = newFilters.dateTo
}

const handleUpdateColumnFilters = (newFilters) => {
  Object.assign(salesColumnFilters.value, newFilters)
}

const handleResetColumnFilters = () => {
  resetSalesColumnFilters()
}

// Инициализация
onMounted(() => {
  setSalesDefaultDates()
  fetchSalesData(1)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <!-- Заголовок и фильтры -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-900">📊 Продажи</h1>

      <DateFilters
        :date-filters="salesDateFilters"
        :loading="salesLoading"
        @apply-filters="handleApplyFilters"
        @reset-dates="handleResetDates"
        @toggle-column-filters="handleToggleFilters"
        @update:dateFilters="handleUpdateDateFilters"
      >
        <template #filter-button-text> {{ props.showFilters ? '❌' : '⚡' }} Фильтры </template>
      </DateFilters>
    </div>

    <ColumnFilters
      :column-filters="salesColumnFilters"
      :unique-values="salesUniqueValues"
      :show-filters="props.showFilters"
      :page-type="'sales'"
      @update:columnFilters="handleUpdateColumnFilters"
      @reset-filters="handleResetColumnFilters"
    />

    <LoadingState :loading="salesLoading" :error="salesError" />

    <StatsInfo
      v-if="salesData.length > 0"
      :filtered-data="salesFilteredData"
      :table-data="salesData"
      :pagination="salesPagination"
      :date-filters="salesDateFilters"
      :column-filters="salesColumnFilters"
      :page-type="'sales'"
    />

    <DataTable
      v-if="salesData.length > 0"
      :data="salesFilteredData"
      :loading="salesLoading"
      :page-type="'sales'"
    />

    <Pagination
      v-if="salesData.length > 0 && salesPagination.totalPages > 1"
      :pagination="salesPagination"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
    />
    <!-- ГРАФИКИ ПРОДАЖ -->
    <SalesCharts v-if="salesData.length > 0" :data="salesData" />

    <div v-else-if="!salesLoading" class="text-center py-12">
      <div class="text-gray-400 text-lg mb-2">📭 Нет данных для отображения</div>
      <p class="text-gray-500 text-sm">Попробуйте изменить даты или обновить страницу</p>
    </div>
  </div>
</template>
