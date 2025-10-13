<script setup>
import { ref } from 'vue'
import Navigation from './components/Navigation.vue'
import SalesPage from './pages/SalesPage.vue'
import OrdersPage from './pages/OrdersPage.vue'
import StocksPage from './pages/StocksPage.vue'
import IncomesPage from './pages/IncomesPage.vue'

const currentPage = ref('sales')
const showFilters = ref(false)

const switchPage = (pageId) => {
  currentPage.value = pageId
  showFilters.value = false
}

const handleToggleFilters = () => {
  showFilters.value = !showFilters.value
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Navigation :current-page="currentPage" @page-change="switchPage" />

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SalesPage
        v-if="currentPage === 'sales'"
        :show-filters="showFilters"
        @toggle-filters="handleToggleFilters"
      />

      <OrdersPage
        v-else-if="currentPage === 'orders'"
        :show-filters="showFilters"
        @toggle-filters="handleToggleFilters"
      />

      <StocksPage
        v-else-if="currentPage === 'stocks'"
        :show-filters="showFilters"
        @toggle-filters="handleToggleFilters"
      />

      <IncomesPage
        v-else-if="currentPage === 'incomes'"
        :show-filters="showFilters"
        @toggle-filters="handleToggleFilters"
      />
    </main>
  </div>
</template>
