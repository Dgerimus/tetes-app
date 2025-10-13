<script setup>
import { onMounted } from 'vue'
import { useOrders } from '../composables/useOrders'
import DateFilters from '../components/DateFilters.vue'
import ColumnFilters from '../components/ColumnFilters.vue'
import DataTable from '../components/DataTable.vue'
import Pagination from '../components/Pagination.vue'
import StatsInfo from '../components/StatsInfo.vue'
import LoadingState from '../components/LoadingState.vue'
import OrdersCharts from '../components/charts/OrdersCharts.vue' // ← ДОБАВИЛИ

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
  ordersData,
  ordersLoading,
  ordersError,
  ordersPagination,
  ordersDateFilters,
  ordersColumnFilters,
  ordersUniqueValues,
  ordersFilteredData,
  fetchOrdersData,
  resetOrdersColumnFilters,
  changeOrdersPage,
  changeOrdersPerPage,
  resetOrdersToLast30Days,
  setOrdersDefaultDates,
} = useOrders()

// Локальные обработчики
const handleApplyFilters = () => fetchOrdersData(1)
const handleResetDates = () => resetOrdersToLast30Days()
const handleToggleFilters = () => emit('toggle-filters')
const handlePageChange = (page) => changeOrdersPage(page)
const handlePerPageChange = (newPerPage) => changeOrdersPerPage(newPerPage)

const handleUpdateDateFilters = (newFilters) => {
  ordersDateFilters.value.dateFrom = newFilters.dateFrom
  ordersDateFilters.value.dateTo = newFilters.dateTo
}

const handleUpdateColumnFilters = (newFilters) => {
  Object.assign(ordersColumnFilters.value, newFilters)
}

const handleResetColumnFilters = () => {
  resetOrdersColumnFilters()
}

// Инициализация
onMounted(() => {
  setOrdersDefaultDates()
  fetchOrdersData(1)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm p-6">
    <!-- Заголовок и фильтры -->
    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
      <h1 class="text-3xl font-bold text-gray-900">📦 Заказы</h1>

      <DateFilters
        :date-filters="ordersDateFilters"
        :loading="ordersLoading"
        @apply-filters="handleApplyFilters"
        @reset-dates="handleResetDates"
        @toggle-column-filters="handleToggleFilters"
        @update:dateFilters="handleUpdateDateFilters"
      >
        <template #filter-button-text> {{ props.showFilters ? '❌' : '⚡' }} Фильтры </template>
      </DateFilters>
    </div>

    <ColumnFilters
      :column-filters="ordersColumnFilters"
      :unique-values="ordersUniqueValues"
      :show-filters="props.showFilters"
      :page-type="'orders'"
      @update:columnFilters="handleUpdateColumnFilters"
      @reset-filters="handleResetColumnFilters"
    />

    <LoadingState :loading="ordersLoading" :error="ordersError" />

    <StatsInfo
      v-if="ordersData.length > 0"
      :filtered-data="ordersFilteredData"
      :table-data="ordersData"
      :pagination="ordersPagination"
      :date-filters="ordersDateFilters"
      :column-filters="ordersColumnFilters"
      :page-type="'orders'"
    />

    <DataTable
      v-if="ordersData.length > 0"
      :data="ordersFilteredData"
      :loading="ordersLoading"
      :page-type="'orders'"
    />

    <Pagination
      v-if="ordersData.length > 0 && ordersPagination.totalPages > 1"
      :pagination="ordersPagination"
      @page-change="handlePageChange"
      @per-page-change="handlePerPageChange"
    />

    <!-- ГРАФИКИ ЗАКАЗОВ -->
    <OrdersCharts v-if="ordersData.length > 0" :data="ordersData" />

    <div v-else-if="!ordersLoading" class="text-center py-12">
      <div class="text-gray-400 text-lg mb-2">📭 Нет данных для отображения</div>
      <p class="text-gray-500 text-sm">Попробуйте изменить даты или обновить страницу</p>
    </div>
  </div>
</template>
