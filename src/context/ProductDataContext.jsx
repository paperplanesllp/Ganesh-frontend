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

function isVathakuzhambuMix(product) {
  return product.slug === 'vathakuzhambu-mix' || product.name?.trim().toLowerCase() === 'vathakuzhambu mix'
}

function isIdlyPowder(product) {
  return product.slug === 'idly-powder' || product.name?.trim().toLowerCase() === 'idly powder'
}

function isTenderMangoPickle(product) {
  return product.slug === 'tender-mango-pickle' || product.name?.trim().toLowerCase() === 'tender mango pickle'
}

function isChillyPickle(product) {
  return product.slug === 'chilly-pickle' || product.name?.trim().toLowerCase() === 'chilly pickle'
}

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
    () => {
      const categorizedProducts = products.map((product) => {
        if (isVathakuzhambuMix(product)) {
          return { ...product, category: 'Pickles', spiceLevel: 'Hot' }
        }

        if (isIdlyPowder(product)) {
          return { ...product, image: '/images/id.png', images: ['/images/id.png'], media: [] }
        }

        if (isTenderMangoPickle(product)) {
          return { ...product, image: '/images/Tender mango.png', images: ['/images/Tender mango.png'], media: [] }
        }

        if (isChillyPickle(product)) {
          return { ...product, image: '/images/Greenchilly.png', images: ['/images/Greenchilly.png'], media: [] }
        }

        return product
      })

      return {
        products: categorizedProducts,
        activeProducts: categorizedProducts.filter((product) => product.isActive !== false),
        refreshProducts,
        saveProducts,
        resetProducts,
      }
    },
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
