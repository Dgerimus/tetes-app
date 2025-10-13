import { ref, computed } from 'vue'
import { API_CONFIG } from '@/utils/constants'

export function useIncomes() {
  // Данные
  const incomesData = ref([])
  const incomesLoading = ref(false)
  const incomesError = ref(null)

  // Пагинация
  const incomesPagination = ref({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    perPage: 50,
  })

  // Фильтры дат
  const incomesDateFilters = ref({
    dateFrom: '',
    dateTo: '',
  })

  // Фильтры по столбцам
  const incomesColumnFilters = ref({
    supplier_article: '',
    warehouse_name: '',
    quantity: '',
  })

  // Уникальные значения для фильтров
  const incomesUniqueValues = ref({
    supplier_articles: new Set(),
    warehouse_names: new Set(),
  })

  // Установка дат по умолчанию
  const setIncomesDefaultDates = () => {
    const today = new Date()
    const monthAgo = new Date()
    monthAgo.setDate(today.getDate() - 30)

    incomesDateFilters.value.dateFrom = monthAgo.toISOString().split('T')[0]
    incomesDateFilters.value.dateTo = today.toISOString().split('T')[0]
  }

  // Обновление уникальных значений
  const updateIncomesUniqueValues = (data) => {
    if (!data) return

    incomesUniqueValues.value.supplier_articles = new Set(
      data.map((item) => item.supplier_article).filter(Boolean),
    )
    incomesUniqueValues.value.warehouse_names = new Set(
      data.map((item) => item.warehouse_name).filter(Boolean),
    )
  }

  // Загрузка данных
  const fetchIncomesData = async (page = 1) => {
    incomesLoading.value = true
    incomesError.value = null
    incomesPagination.value.currentPage = page

    try {
      const params = new URLSearchParams({
        dateFrom: incomesDateFilters.value.dateFrom,
        dateTo: incomesDateFilters.value.dateTo,
        page: page,
        limit: incomesPagination.value.perPage,
        key: API_CONFIG.API_KEY,
      })

      const url = `${API_CONFIG.BASE_URL}/api/incomes?${params}`
      console.log('🔗 Запрос Incomes:', url)

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
      incomesData.value = data.data || []

      // Обновляем пагинацию
      incomesPagination.value.totalPages = data.meta?.last_page || 1
      incomesPagination.value.totalItems = data.meta?.total || 0

      // Обновляем уникальные значения
      updateIncomesUniqueValues(data.data)

      console.log('✅ Incomes данные загружены:', {
        loaded: incomesData.value.length,
        total: incomesPagination.value.totalItems,
        pages: incomesPagination.value.totalPages,
      })
    } catch (err) {
      incomesError.value = err.message
      console.error('❌ Ошибка Incomes:', err)
    } finally {
      incomesLoading.value = false
    }
  }

  // Отфильтрованные данные
  const incomesFilteredData = computed(() => {
    if (!incomesData.value.length) return []

    return incomesData.value.filter((item) => {
      if (
        incomesColumnFilters.value.supplier_article &&
        !item.supplier_article
          ?.toLowerCase()
          .includes(incomesColumnFilters.value.supplier_article.toLowerCase())
      ) {
        return false
      }

      if (
        incomesColumnFilters.value.warehouse_name &&
        !item.warehouse_name
          ?.toLowerCase()
          .includes(incomesColumnFilters.value.warehouse_name.toLowerCase())
      ) {
        return false
      }

      if (incomesColumnFilters.value.quantity) {
        const minQuantity = parseFloat(incomesColumnFilters.value.quantity)
        const itemQuantity = parseFloat(item.quantity)
        if (isNaN(minQuantity) || itemQuantity < minQuantity) {
          return false
        }
      }

      return true
    })
  })

  // Сброс фильтров
  const resetIncomesColumnFilters = () => {
    incomesColumnFilters.value = {
      supplier_article: '',
      warehouse_name: '',
      quantity: '',
    }
  }

  // Смена страницы
  const changeIncomesPage = (page) => {
    if (page >= 1 && page <= incomesPagination.value.totalPages) {
      fetchIncomesData(page)
    }
  }

  // Изменение количества записей
  const changeIncomesPerPage = (newPerPage) => {
    incomesPagination.value.perPage = newPerPage
    incomesPagination.value.currentPage = 1
    fetchIncomesData(1)
  }

  // Сброс к последним 30 дням
  const resetIncomesToLast30Days = () => {
    setIncomesDefaultDates()
    resetIncomesColumnFilters()
    incomesPagination.value.currentPage = 1
    fetchIncomesData(1)
  }

  return {
    // Data
    incomesData,
    incomesLoading,
    incomesError,

    // Pagination
    incomesPagination,

    // Filters
    incomesDateFilters,
    incomesColumnFilters,
    incomesUniqueValues,

    // Computed
    incomesFilteredData,

    // Methods
    fetchIncomesData,
    resetIncomesColumnFilters,
    changeIncomesPage,
    changeIncomesPerPage,
    resetIncomesToLast30Days,
    setIncomesDefaultDates,
  }
}
