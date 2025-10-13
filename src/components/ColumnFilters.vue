<script setup>
const props = defineProps({
  columnFilters: {
    type: Object,
    required: true,
  },
  uniqueValues: {
    type: Object,
    required: true,
  },
  showFilters: {
    type: Boolean,
    default: false,
  },
  pageType: {
    type: String,
    default: 'sales', // 'sales', 'orders', 'stocks', 'incomes'
  },
})

const emit = defineEmits(['update:columnFilters', 'reset-filters'])

const updateFilter = (key, value) => {
  const newFilters = {
    ...props.columnFilters,
    [key]: value,
  }
  emit('update:columnFilters', newFilters)
}

const resetFilters = () => {
  emit('reset-filters')
}

// Конфигурация фильтров для разных страниц
const getFilterConfig = (pageType) => {
  const baseFilters = [
    {
      key: 'supplier_article',
      label: 'Артикул',
      type: 'text',
      placeholder: 'Поиск по артикулу...',
      datalistId: 'supplierArticles',
      datalistValues: props.uniqueValues.supplier_articles,
    },
    {
      key: 'warehouse_name',
      label: 'Склад',
      type: 'text',
      placeholder: 'Поиск по складу...',
      datalistId: 'warehouses',
      datalistValues: props.uniqueValues.warehouse_names,
    },
  ]

  switch (pageType) {
    case 'sales':
    case 'orders':
      return [
        ...baseFilters,
        {
          key: 'brand',
          label: 'Бренд',
          type: 'text',
          placeholder: 'Поиск по бренду...',
          datalistId: 'brands',
          datalistValues: props.uniqueValues.brands,
        },
        {
          key: 'discount_percent',
          label: 'Мин. скидка %',
          type: 'number',
          placeholder: '0',
          min: 0,
          max: 100,
        },
      ]
    case 'stocks':
      return [
        ...baseFilters,
        {
          key: 'brand',
          label: 'Бренд',
          type: 'text',
          placeholder: 'Поиск по бренду...',
          datalistId: 'brands',
          datalistValues: props.uniqueValues.brands,
        },
        {
          key: 'quantity',
          label: 'Мин. кол-во',
          type: 'number',
          placeholder: '0',
          min: 0,
        },
      ]
    case 'incomes':
      return [
        ...baseFilters,
        {
          key: 'quantity',
          label: 'Мин. кол-во',
          type: 'number',
          placeholder: '0',
          min: 0,
        },
      ]
    default:
      return baseFilters
  }
}
</script>

<template>
  <div v-if="showFilters" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-lg font-semibold text-blue-800">Фильтры по столбцам</h3>
      <button
        @click="resetFilters"
        class="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200 transition-colors"
      >
        Сбросить
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Динамические фильтры -->
      <div v-for="filter in getFilterConfig(pageType)" :key="filter.key">
        <label class="block text-sm font-medium text-gray-700 mb-1">{{ filter.label }}:</label>

        <input
          :type="filter.type"
          :value="props.columnFilters[filter.key]"
          @input="updateFilter(filter.key, $event.target.value)"
          :placeholder="filter.placeholder"
          :min="filter.min"
          :max="filter.max"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
          :list="filter.datalistId"
        />

        <datalist v-if="filter.datalistId && filter.datalistValues" :id="filter.datalistId">
          <option v-for="value in filter.datalistValues" :key="value" :value="value" />
        </datalist>
      </div>
    </div>
  </div>
</template>
