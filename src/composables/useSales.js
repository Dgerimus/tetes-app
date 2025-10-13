import { ref, computed } from 'vue'
import { API_CONFIG } from '@/utils/constants'

export function useSales() {
  // Данные
  const salesData = ref([])
  const salesLoading = ref(false)
  const salesError = ref(null)

  // Пагинация
  const salesPagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  })

  // Фильтры дат
  const salesDateFilters = ref({
    dateFrom: '',
    dateTo: '',
  })

  // Фильтры по столбцам
  const salesColumnFilters = ref({
    supplier_article: '',
    warehouse_name: '',
    brand: '',
    discount_percent: '',
  })

  // Уникальные значения для фильтров
  const salesUniqueValues = ref({
    supplier_articles: new Set(),
    warehouse_names: new Set(),
    brands: new Set(),
  })

  // Установка дат по умолчанию
  const setSalesDefaultDates = () => {
    const today = new Date()
    const monthAgo = new Date()
    monthAgo.setDate(today.getDate() - 30)

    salesDateFilters.value.dateFrom = monthAgo.toISOString().split('T')[0]
    salesDateFilters.value.dateTo = today.toISOString().split('T')[0]
  }

  // Обновление уникальных значений
  const updateSalesUniqueValues = (data) => {
    if (!data) return

    salesUniqueValues.value.supplier_articles = new Set(
      data.map((item) => item.supplier_article).filter(Boolean),
    )
    salesUniqueValues.value.warehouse_names = new Set(
      data.map((item) => item.warehouse_name).filter(Boolean),
    )
    salesUniqueValues.value.brands = new Set(data.map((item) => item.brand).filter(Boolean))
  }

  // Загрузка данных
  const fetchSalesData = async (page = 1) => {
    salesLoading.value = true
    salesError.value = null
    salesPagination.value.currentPage = page

    try {
      const params = new URLSearchParams({
        dateFrom: salesDateFilters.value.dateFrom,
        dateTo: salesDateFilters.value.dateTo,
        page: page,
        limit: salesPagination.value.perPage,
        key: API_CONFIG.API_KEY,
      })

      const url = `${API_CONFIG.BASE_URL}/api/sales?${params}`
      console.log('🔗 Запрос Sales:', url)

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
      salesData.value = data.data || []

      // Обновляем пагинацию
      salesPagination.value.totalPages = data.meta?.last_page || 1
      salesPagination.value.totalItems = data.meta?.total || 0

      // Обновляем уникальные значения
      updateSalesUniqueValues(data.data)

      console.log('✅ Sales данные загружены:', {
        loaded: salesData.value.length,
        total: salesPagination.value.totalItems,
        pages: salesPagination.value.totalPages,
      })
    } catch (err) {
      salesError.value = err.message
      console.error('❌ Ошибка Sales:', err)
    } finally {
      salesLoading.value = false
    }
  }

  // Отфильтрованные данные
  const salesFilteredData = computed(() => {
    if (!salesData.value.length) return []

    return salesData.value.filter((item) => {
      if (
        salesColumnFilters.value.supplier_article &&
        !item.supplier_article
          ?.toLowerCase()
          .includes(salesColumnFilters.value.supplier_article.toLowerCase())
      ) {
        return false
      }

      if (
        salesColumnFilters.value.warehouse_name &&
        !item.warehouse_name
          ?.toLowerCase()
          .includes(salesColumnFilters.value.warehouse_name.toLowerCase())
      ) {
        return false
      }

      if (
        salesColumnFilters.value.brand &&
        !item.brand?.toLowerCase().includes(salesColumnFilters.value.brand.toLowerCase())
      ) {
        return false
      }

      if (salesColumnFilters.value.discount_percent) {
        const discount = parseFloat(salesColumnFilters.value.discount_percent)
        const itemDiscount = parseFloat(item.discount_percent)
        if (isNaN(discount) || itemDiscount < discount) {
          return false
        }
      }

      return true
    })
  })

  // Сброс фильтров
  const resetSalesColumnFilters = () => {
    salesColumnFilters.value = {
      supplier_article: '',
      warehouse_name: '',
      brand: '',
      discount_percent: '',
    }
  }

  // Смена страницы
  const changeSalesPage = (page) => {
    if (page >= 1 && page <= salesPagination.value.totalPages) {
      fetchSalesData(page)
    }
  }

  // Изменение количества записей
  const changeSalesPerPage = (newPerPage) => {
    salesPagination.value.perPage = newPerPage
    salesPagination.value.currentPage = 1
    fetchSalesData(1)
  }

  // Сброс к последним 30 дням
  const resetSalesToLast30Days = () => {
    setSalesDefaultDates()
    resetSalesColumnFilters()
    salesPagination.value.currentPage = 1
    fetchSalesData(1)
  }

  return {
    // Data
    salesData,
    salesLoading,
    salesError,

    // Pagination
    salesPagination,

    // Filters
    salesDateFilters,
    salesColumnFilters,
    salesUniqueValues,

    // Computed
    salesFilteredData,

    // Methods
    fetchSalesData,
    resetSalesColumnFilters,
    changeSalesPage,
    changeSalesPerPage,
    resetSalesToLast30Days,
    setSalesDefaultDates,
  }
}
