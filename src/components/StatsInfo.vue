<script setup>
defineProps({
  filteredData: {
    type: Array,
    required: true,
  },
  tableData: {
    // Переименовано с sales-data на table-data
    type: Array,
    required: true,
  },
  pagination: {
    type: Object,
    required: true,
  },
  dateFilters: {
    type: Object,
    required: true,
  },
  columnFilters: {
    type: Object,
    required: true,
  },
  pageType: {
    type: String,
    default: 'sales',
  },
})

// Получение заголовка периода в зависимости от типа страницы
const getPeriodTitle = (pageType) => {
  switch (pageType) {
    case 'sales':
      return 'продажи'
    case 'orders':
      return 'заказы'
    case 'stocks':
      return 'остатки'
    case 'incomes':
      return 'поступления'
    default:
      return 'данные'
  }
}

// Проверка активных фильтров
const hasActiveFilters = (filters) => {
  return Object.values(filters).some(
    (value) => value !== '' && value !== null && value !== undefined,
  )
}
</script>

<template>
  <div>
    <!-- Информация о периоде -->
    <div
      v-if="tableData.length > 0 && dateFilters.dateFrom"
      class="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
    >
      📅 Показаны {{ getPeriodTitle(pageType) }} за период:
      <strong>{{ new Date(dateFilters.dateFrom).toLocaleDateString('ru-RU') }}</strong>
      <span v-if="dateFilters.dateTo">
        - <strong>{{ new Date(dateFilters.dateTo).toLocaleDateString('ru-RU') }}</strong>
      </span>

      <span v-if="hasActiveFilters(columnFilters)" class="ml-4"> • Применены фильтры </span>
    </div>

    <!-- Статистика -->
    <div class="text-sm text-gray-600 text-center sm:text-right">
      <div>
        Показано:
        <strong>{{ filteredData.length }}</strong>
        <span v-if="filteredData.length !== tableData.length" class="text-orange-600">
          (из {{ tableData.length }} на странице)
        </span>
        из
        <strong>{{ pagination.totalItems.toLocaleString('ru-RU') }}</strong> записей
      </div>
      <div class="text-xs text-gray-500">
        Страница {{ pagination.currentPage }} из {{ pagination.totalPages }}
      </div>
    </div>
  </div>
</template>
