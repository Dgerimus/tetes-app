<script setup>
import { PAGES } from '@/utils/constants'

defineProps({
  currentPage: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const switchPage = (pageId) => {
  emit('page-change', pageId)
}
</script>

<template>
  <nav class="bg-white shadow-sm border-b">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex space-x-4 py-4">
        <button
          v-for="page in PAGES"
          :key="page.id"
          class="px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
          :class="
            currentPage === page.id
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
          @click="switchPage(page.id)"
        >
          <span>{{ page.name }}</span>
        </button>
      </div>
    </div>
  </nav>
</template>
