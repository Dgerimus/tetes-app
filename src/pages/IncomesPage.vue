<script setup>
import { onMounted } from 'vue'
import { useIncomes } from '../composables/useIncomes'
import DateFilters from '../components/DateFilters.vue'
import ColumnFilters from '../components/ColumnFilters.vue'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import StatsInfo from '../components/StatsInfo.vue'
import LoadingState from '../components/LoadingState.vue'
import IncomesCharts from '../components/charts/IncomesCharts.vue'

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
  incomesData,
  incomesLoading,
  incomesError,
  incomesPagination,
  incomesDateFilters,
  incomesColumnFilters,
  incomesUniqueValues,
  incomesFilteredData,
  fetchIncomesData,
  resetIncomesColumnFilters,
  changeIncomesPage,
  changeIncomesPerPage,
  resetIncomesToLast30Days,
  setIncomesDefaultDates,
} = useIncomes()

// Локальные обработчики
const handleApplyFilters = () => fetchIncomesData(1)
const handleResetDates = () => resetIncomesToLast30Days()
const handleToggleFilters = () => emit('toggle-filters')
const handlePageChange = (page) => changeIncomesPage(page)
const handlePerPageChange = (newPerPage) => changeIncomesPerPage(newPerPage)

const handleUpdateDateFilters = (newFilters) => {
  incomesDateFilters.value.dateFrom = newFilters.dateFrom
  incomesDateFilters.value.dateTo = newFilters.dateTo
}

const handleUpdateColumnFilters = (newFilters) => {
  Object.assign(incomesColumnFilters.value, newFilters)
}

const handleResetColumnFilters = () => {
  resetIncomesColumnFilters()
}

// Инициализация
onMounted(() => {
  setIncomesDefaultDates()
  fetchIncomesData(1)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <!-- Заголовок и фильтры -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-900">💰 Доходы</h1>

      <DateFilters
        :date-filters="incomesDateFilters"
        :loading="incomesLoading"
        @apply-filters="handleApplyFilters"
        @reset-dates="handleResetDates"
        @toggle-column-filters="handleToggleFilters"
        @update:dateFilters="handleUpdateDateFilters"
      >
        <template #filter-button-text> {{ props.showFilters ? '❌' : '⚡' }} Фильтры </template>
      </DateFilters>
    </div>

    <ColumnFilters
      :column-filters="incomesColumnFilters"
      :unique-values="incomesUniqueValues"
      :show-filters="props.showFilters"
      :page-type="'incomes'"
      @update:columnFilters="handleUpdateColumnFilters"
      @reset-filters="handleResetColumnFilters"
    />

    <LoadingState :loading="incomesLoading" :error="incomesError" />

    <StatsInfo
      v-if="incomesData.length > 0"
      :filtered-data="incomesFilteredData"
      :table-data="incomesData"
      :pagination="incomesPagination"
      :date-filters="incomesDateFilters"
      :column-filters="incomesColumnFilters"
      :page-type="'incomes'"
    />

    <DataTable
      v-if="incomesData.length > 0"
      :data="incomesFilteredData"
      :loading="incomesLoading"
      :page-type="'incomes'"
    />

    <Pagination
      v-if="incomesData.length > 0 && incomesPagination.totalPages > 1"
      :pagination="incomesPagination"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
    />
    <!-- ГРАФИКИ ДОХОДОВ -->
    <IncomesCharts v-if="incomesData.length > 0" :data="incomesData" />

    <div v-else-if="!incomesLoading" class="text-center py-12">
      <div class="text-gray-400 text-lg mb-2">📭 Нет данных для отображения</div>
      <p class="text-gray-500 text-sm">Попробуйте изменить даты или обновить страницу</p>
    </div>
  </div>
</template>
