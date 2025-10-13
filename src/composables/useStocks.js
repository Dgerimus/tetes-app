import { ref, computed } from 'vue'
import { API_CONFIG } from '@/utils/constants'

export function useStocks() {
  // Данные
  const stocksData = ref([])
  const stocksLoading = ref(false)
  const stocksError = ref(null)

  // Пагинация
  const stocksPagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  })

  // Фильтры дат (только dateFrom для stocks)
  const stocksDateFilters = ref({
    dateFrom: '',
  })

  // Фильтры по столбцам
  const stocksColumnFilters = ref({
    supplier_article: '',
    warehouse_name: '',
    brand: '',
    quantity: '',
  })

  // Уникальные значения для фильтров
  const stocksUniqueValues = ref({
    supplier_articles: new Set(),
    warehouse_names: new Set(),
    brands: new Set(),
  })

  // Установка даты по умолчанию (сегодня)
  const setStocksDefaultDate = () => {
    const today = new Date()
    stocksDateFilters.value.dateFrom = today.toISOString().split('T')[0]
  }

  // Обновление уникальных значений
  const updateStocksUniqueValues = (data) => {
    if (!data) return

    stocksUniqueValues.value.supplier_articles = new Set(
      data.map((item) => item.supplier_article).filter(Boolean),
    )
    stocksUniqueValues.value.warehouse_names = new Set(
      data.map((item) => item.warehouse_name).filter(Boolean),
    )
    stocksUniqueValues.value.brands = new Set(data.map((item) => item.brand).filter(Boolean))
  }

  // Загрузка данных
  const fetchStocksData = async (page = 1) => {
    stocksLoading.value = true
    stocksError.value = null
    stocksPagination.value.currentPage = page

    try {
      const params = new URLSearchParams({
        dateFrom: stocksDateFilters.value.dateFrom,
        page: page,
        limit: stocksPagination.value.perPage,
        key: API_CONFIG.API_KEY,
      })

      const url = `${API_CONFIG.BASE_URL}/api/stocks?${params}`
      console.log('🔗 Запрос Stocks:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      stocksData.value = data.data || []

      // Обновляем пагинацию
      stocksPagination.value.totalPages = data.meta?.last_page || 1
      stocksPagination.value.totalItems = data.meta?.total || 0

      // Обновляем уникальные значения
      updateStocksUniqueValues(data.data)

      console.log('✅ Stocks данные загружены:', {
        loaded: stocksData.value.length,
        total: stocksPagination.value.totalItems,
        pages: stocksPagination.value.totalPages,
      })
    } catch (err) {
      stocksError.value = err.message
      console.error('❌ Ошибка Stocks:', err)
    } finally {
      stocksLoading.value = false
    }
  }

  // Отфильтрованные данные
  const stocksFilteredData = computed(() => {
    if (!stocksData.value.length) return []

    return stocksData.value.filter((item) => {
      if (
        stocksColumnFilters.value.supplier_article &&
        !item.supplier_article
          ?.toLowerCase()
          .includes(stocksColumnFilters.value.supplier_article.toLowerCase())
      ) {
        return false
      }

      if (
        stocksColumnFilters.value.warehouse_name &&
        !item.warehouse_name
          ?.toLowerCase()
          .includes(stocksColumnFilters.value.warehouse_name.toLowerCase())
      ) {
        return false
      }

      if (
        stocksColumnFilters.value.brand &&
        !item.brand?.toLowerCase().includes(stocksColumnFilters.value.brand.toLowerCase())
      ) {
        return false
      }

      if (stocksColumnFilters.value.quantity) {
        const minQuantity = parseFloat(stocksColumnFilters.value.quantity)
        const itemQuantity = parseFloat(item.quantity)
        if (isNaN(minQuantity) || itemQuantity < minQuantity) {
          return false
        }
      }

      return true
    })
  })

  // Сброс фильтров
  const resetStocksColumnFilters = () => {
    stocksColumnFilters.value = {
      supplier_article: '',
      warehouse_name: '',
      brand: '',
      quantity: '',
    }
  }

  // Смена страницы
  const changeStocksPage = (page) => {
    if (page >= 1 && page <= stocksPagination.value.totalPages) {
      fetchStocksData(page)
    }
  }

  // Изменение количества записей
  const changeStocksPerPage = (newPerPage) => {
    stocksPagination.value.perPage = newPerPage
    stocksPagination.value.currentPage = 1
    fetchStocksData(1)
  }

  // Сброс к сегодняшней дате
  const resetStocksToToday = () => {
    setStocksDefaultDate()
    resetStocksColumnFilters()
    stocksPagination.value.currentPage = 1
    fetchStocksData(1)
  }

  return {
    // Data
    stocksData,
    stocksLoading,
    stocksError,

    // Pagination
    stocksPagination,

    // Filters
    stocksDateFilters,
    stocksColumnFilters,
    stocksUniqueValues,

    // Computed
    stocksFilteredData,

    // Methods
    fetchStocksData,
    resetStocksColumnFilters,
    changeStocksPage,
    changeStocksPerPage,
    resetStocksToToday,
    setStocksDefaultDate,
  }
}
