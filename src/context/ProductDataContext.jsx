/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  PRODUCT_STORE_UPDATED_EVENT,
  getCurrentProducts,
  resetMockProducts,
  saveMockProducts,
} from '../utils/localProductCatalog'
import { USE_MOCK_DATA } from '../config/appConfig'
import { getProducts } from '../services/productService'

const ProductDataContext = createContext(null)

export function ProductDataProvider({ children }) {
  const [products, setProducts] = useState(() => getCurrentProducts())

  const refreshProducts = useCallback(() => {
    if (!USE_MOCK_DATA) return
    setProducts(getCurrentProducts())
  }, [])

  const saveProducts = useCallback((nextProducts) => {
    const savedProducts = saveMockProducts(nextProducts)
    setProducts(savedProducts)
    return savedProducts
  }, [])

  const resetProducts = useCallback(() => {
    const seededProducts = resetMockProducts()
    setProducts(seededProducts)
    return seededProducts
  }, [])

  useEffect(() => {
    if (!USE_MOCK_DATA) return undefined

    window.addEventListener(PRODUCT_STORE_UPDATED_EVENT, refreshProducts)
    window.addEventListener('storage', refreshProducts)
    return () => {
      window.removeEventListener(PRODUCT_STORE_UPDATED_EVENT, refreshProducts)
      window.removeEventListener('storage', refreshProducts)
    }
  }, [refreshProducts])

  useEffect(() => {
    if (USE_MOCK_DATA) return undefined

    const controller = new AbortController()

    getProducts({ limit: 50 }, controller.signal)
      .then((data) => {
        const apiProducts = data.products || []
        setProducts(apiProducts.length > 0 ? apiProducts : getCurrentProducts())
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') setProducts(getCurrentProducts())
      })

    return () => controller.abort()
  }, [])

  const value = useMemo(
    () => ({
      products,
      activeProducts: products.filter((product) => product.isActive !== false),
      refreshProducts,
      saveProducts,
      resetProducts,
    }),
    [products, refreshProducts, resetProducts, saveProducts],
  )

  return <ProductDataContext.Provider value={value}>{children}</ProductDataContext.Provider>
}

export function useProductData() {
  const context = useContext(ProductDataContext)

  if (!context) {
    throw new Error('useProductData must be used inside ProductDataProvider')
  }

  return context
}
