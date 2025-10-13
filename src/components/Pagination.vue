<script setup>
import { PER_PAGE_OPTIONS } from '@/utils/constants'

const props = defineProps({
  pagination: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['page-change', 'per-page-change'])

const changePage = (page) => {
  emit('page-change', page)
}

const changePerPage = (event) => {
  const newPerPage = parseInt(event.target.value)
  emit('per-page-change', newPerPage)
}

const getPageNumbers = () => {
  const current = props.pagination.currentPage // Используем props.pagination
  const total = props.pagination.totalPages // Используем props.pagination
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
      pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
      pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
  }

  return pages
}
</script>

<template>
  <div
    class="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg"
  >
    <!-- Пагинация -->
    <div class="flex items-center gap-2">
      <button
        @click="changePage(props.pagination.currentPage - 1)"
        :disabled="props.pagination.currentPage === 1"
        class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ←
      </button>

      <div class="flex gap-1">
        <button
          v-for="pageNum in getPageNumbers()"
          :key="pageNum"
          @click="pageNum !== '...' && changePage(pageNum)"
          :class="[
            'px-3 py-2 text-sm border rounded-md min-w-[40px]',
            pageNum === '...'
              ? 'border-transparent cursor-default'
              : pageNum === props.pagination.currentPage // Используем props.pagination
                ? 'bg-blue-500 text-white border-blue-500'
                : 'border-gray-300 hover:bg-gray-100',
          ]"
          :disabled="pageNum === '...'"
        >
          {{ pageNum }}
        </button>
      </div>

      <button
        @click="changePage(props.pagination.currentPage + 1)"
        :disabled="props.pagination.currentPage === props.pagination.totalPages"
        class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        →
      </button>
    </div>

    <!-- Выбор количества записей и статистика -->
    <div class="flex flex-col sm:flex-row items-center gap-4">
      <!-- Выбор количества записей -->
      <div class="flex items-center gap-2">
        <label class="text-sm text-gray-600 whitespace-nowrap">Записей на странице:</label>
        <select
          :value="props.pagination.perPage"
          @change="changePerPage"
          class="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option v-for="option in PER_PAGE_OPTIONS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>
