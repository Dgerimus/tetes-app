<script setup>
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pageType: {
    type: String,
    default: 'sales', // 'sales', 'orders', 'stocks', 'incomes'
  },
})

// Форматирование чисел
const formatNumber = (num) => {
  return parseFloat(num || 0).toLocaleString('ru-RU')
}

// Форматирование даты
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ru-RU')
}

// Получение заголовков таблицы в зависимости от типа страницы
const getTableHeaders = (pageType) => {
  switch (pageType) {
    case 'sales':
      return [
        { key: 'date', label: 'Дата продажи' },
        { key: 'supplier_article', label: 'Артикул' },
        { key: 'total_price', label: 'Сумма' },
        { key: 'discount_percent', label: 'Скидка' },
        { key: 'warehouse_name', label: 'Склад' },
        { key: 'brand', label: 'Бренд' },
      ]
    case 'orders':
      return [
        { key: 'date', label: 'Дата заказа' },
        { key: 'supplier_article', label: 'Артикул' },
        { key: 'total_price', label: 'Сумма' },
        { key: 'discount_percent', label: 'Скидка' },
        { key: 'warehouse_name', label: 'Склад' },
        { key: 'brand', label: 'Бренд' },
      ]
    case 'stocks':
      return [
        { key: 'date', label: 'Дата' },
        { key: 'supplier_article', label: 'Артикул' },
        { key: 'quantity', label: 'Кол-во' },
        { key: 'quantity_full', label: 'Всего' },
        { key: 'warehouse_name', label: 'Склад' },
        { key: 'brand', label: 'Бренд' },
      ]
    case 'incomes':
      return [
        { key: 'date', label: 'Дата поступления' },
        { key: 'supplier_article', label: 'Артикул' },
        { key: 'quantity', label: 'Кол-во' },
        { key: 'warehouse_name', label: 'Склад' },
        { key: 'nm_id', label: 'NM ID' },
      ]
    default:
      return []
  }
}

// Получение значения ячейки в зависимости от типа данных
const getCellValue = (item, key) => {
  const value = item[key]

  switch (key) {
    case 'date':
      return formatDate(value)
    case 'total_price':
      return `${formatNumber(value)} ₽`
    case 'quantity':
    case 'quantity_full':
      return formatNumber(value)
    case 'discount_percent':
      return value
    default:
      return value || '-'
  }
}

// Получение классов для ячеек
const getCellClass = (key, value) => {
  if (key === 'discount_percent' && value > 0) {
    return 'text-orange-600 font-medium'
  }
  if (key === 'total_price') {
    return 'font-medium'
  }
  return ''
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="header in getTableHeaders(pageType)"
            :key="header.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(item, index) in data" :key="index" class="hover:bg-gray-50 transition-colors">
          <td
            v-for="header in getTableHeaders(pageType)"
            :key="header.key"
            class="px-6 py-4 whitespace-nowrap text-sm"
            :class="getCellClass(header.key, item[header.key])"
          >
            {{ getCellValue(item, header.key) }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Сообщение если нет данных после фильтрации -->
    <div v-if="data.length === 0 && !loading" class="text-center py-8 bg-yellow-50 text-yellow-700">
      🔍 Нет данных, соответствующих выбранным фильтрам
    </div>
  </div>
</template>
