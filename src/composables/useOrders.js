import { ref, computed } from 'vue'
import { API_CONFIG } from '@/utils/constants'

export function useOrders() {
  // Данные
  const ordersData = ref([])
  const ordersLoading = ref(false)
  const ordersError = ref(null)

  // Пагинация
  const ordersPagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  })

  // Фильтры дат
  const ordersDateFilters = ref({
    dateFrom: '',
    dateTo: '',
  })

  // Фильтры по столбцам
  const ordersColumnFilters = ref({
    supplier_article: '',
    warehouse_name: '',
    brand: '',
    discount_percent: '',
  })

  // Уникальные значения для фильтров
  const ordersUniqueValues = ref({
    supplier_articles: new Set(),
    warehouse_names: new Set(),
    brands: new Set(),
  })

  // Установка дат по умолчанию
  const setOrdersDefaultDates = () => {
    const today = new Date()
    const monthAgo = new Date()
    monthAgo.setDate(today.getDate() - 30)

    ordersDateFilters.value.dateFrom = monthAgo.toISOString().split('T')[0]
    ordersDateFilters.value.dateTo = today.toISOString().split('T')[0]
  }

  // Обновление уникальных значений
  const updateOrdersUniqueValues = (data) => {
    if (!data) return

    ordersUniqueValues.value.supplier_articles = new Set(
      data.map((item) => item.supplier_article).filter(Boolean),
    )
    ordersUniqueValues.value.warehouse_names = new Set(
      data.map((item) => item.warehouse_name).filter(Boolean),
    )
    ordersUniqueValues.value.brands = new Set(data.map((item) => item.brand).filter(Boolean))
  }

  // Загрузка данных
  const fetchOrdersData = async (page = 1) => {
    ordersLoading.value = true
    ordersError.value = null
    ordersPagination.value.currentPage = page

    try {
      const params = new URLSearchParams({
        dateFrom: ordersDateFilters.value.dateFrom,
        dateTo: ordersDateFilters.value.dateTo,
        page: page,
        limit: ordersPagination.value.perPage,
        key: API_CONFIG.API_KEY,
      })

      const url = `${API_CONFIG.BASE_URL}/api/orders?${params}`
      console.log('🔗 Запрос Orders:', url)

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
      ordersData.value = data.data || []

      // Обновляем пагинацию
      ordersPagination.value.totalPages = data.meta?.last_page || 1
      ordersPagination.value.totalItems = data.meta?.total || 0

      // Обновляем уникальные значения
      updateOrdersUniqueValues(data.data)

      console.log('✅ Orders данные загружены:', {
        loaded: ordersData.value.length,
        total: ordersPagination.value.totalItems,
        pages: ordersPagination.value.totalPages,
      })
    } catch (err) {
      ordersError.value = err.message
      console.error('❌ Ошибка Orders:', err)
    } finally {
      ordersLoading.value = false
    }
  }

  // Отфильтрованные данные
  const ordersFilteredData = computed(() => {
    if (!ordersData.value.length) return []

    return ordersData.value.filter((item) => {
      if (
        ordersColumnFilters.value.supplier_article &&
        !item.supplier_article
          ?.toLowerCase()
          .includes(ordersColumnFilters.value.supplier_article.toLowerCase())
      ) {
        return false
      }

      if (
        ordersColumnFilters.value.warehouse_name &&
        !item.warehouse_name
          ?.toLowerCase()
          .includes(ordersColumnFilters.value.warehouse_name.toLowerCase())
      ) {
        return false
      }

      if (
        ordersColumnFilters.value.brand &&
        !item.brand?.toLowerCase().includes(ordersColumnFilters.value.brand.toLowerCase())
      ) {
        return false
      }

      if (ordersColumnFilters.value.discount_percent) {
        const discount = parseFloat(ordersColumnFilters.value.discount_percent)
        const itemDiscount = parseFloat(item.discount_percent)
        if (isNaN(discount) || itemDiscount < discount) {
          return false
        }
      }

      return true
    })
  })

  // Сброс фильтров
  const resetOrdersColumnFilters = () => {
    ordersColumnFilters.value = {
      supplier_article: '',
      warehouse_name: '',
      brand: '',
      discount_percent: '',
    }
  }

  // Смена страницы
  const changeOrdersPage = (page) => {
    if (page >= 1 && page <= ordersPagination.value.totalPages) {
      fetchOrdersData(page)
    }
  }

  // Изменение количества записей
  const changeOrdersPerPage = (newPerPage) => {
    ordersPagination.value.perPage = newPerPage
    ordersPagination.value.currentPage = 1
    fetchOrdersData(1)
  }

  // Сброс к последним 30 дням
  const resetOrdersToLast30Days = () => {
    setOrdersDefaultDates()
    resetOrdersColumnFilters()
    ordersPagination.value.currentPage = 1
    fetchOrdersData(1)
  }

  return {
    // Data
    ordersData,
    ordersLoading,
    ordersError,

    // Pagination
    ordersPagination,

    // Filters
    ordersDateFilters,
    ordersColumnFilters,
    ordersUniqueValues,

    // Computed
    ordersFilteredData,

    // Methods
    fetchOrdersData,
    resetOrdersColumnFilters,
    changeOrdersPage,
    changeOrdersPerPage,
    resetOrdersToLast30Days,
    setOrdersDefaultDates,
  }
}
