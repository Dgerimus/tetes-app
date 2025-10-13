<script setup>
defineProps({
  dateFilters: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['apply-filters', 'reset-dates', 'toggle-column-filters'])

const applyFilters = () => {
  emit('apply-filters')
}

const resetDates = () => {
  emit('reset-dates')
}

const toggleColumnFilters = () => {
  emit('toggle-column-filters')
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 rounded-lg"
  >
    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-gray-700 whitespace-nowrap">С:</label>
      <input
        type="date"
        :value="dateFilters.dateFrom"
        @input="$emit('update:dateFilters', { ...dateFilters, dateFrom: $event.target.value })"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>

    <div class="flex items-center gap-3">
      <label class="text-sm font-medium text-gray-700 whitespace-nowrap">По:</label>
      <input
        type="date"
        :value="dateFilters.dateTo"
        @input="$emit('update:dateFilters', { ...dateFilters, dateTo: $event.target.value })"
        class="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>

    <div class="flex gap-2">
      <button
        @click="applyFilters"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        :disabled="loading"
      >
        {{ loading ? '⏳' : '🔍' }} Применить
      </button>

      <button
        @click="resetDates"
        class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
        :disabled="loading"
      >
        📅 30 дней
      </button>

      <button
        @click="toggleColumnFilters"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
      >
        <slot name="filter-button-text">⚡ Фильтры</slot>
      </button>
    </div>
  </div>
</template>
