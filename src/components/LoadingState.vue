<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <div>
    <!-- Статус загрузки -->
    <div
      v-if="loading"
      class="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-2"
    >
      <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
      Загрузка данных...
    </div>

    <!-- Ошибка -->
    <div v-if="error" class="mb-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
      ❌ Ошибка: {{ error }}
    </div>
  </div>
</template>
