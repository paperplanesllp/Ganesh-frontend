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

function isThamaraVathal(product) {
  return product.slug === 'thamara-vathal' || product.name?.trim().toLowerCase() === 'thamara vathal'
}

function isUnnithandu(product) {
  return product.slug === 'unnithandu' || product.name?.trim().toLowerCase() === 'unnithandu'
}

function isVadukapullyRed(product) {
  return product.slug === 'vadukapully-red' || product.name?.trim().toLowerCase() === 'vadukapully red'
}

function isCurdChilly(product) {
  return product.slug === 'curd-chilly' || product.name?.trim().toLowerCase() === 'curd chilly'
}

function isKappaNarthangai(product) {
  return product.slug === 'kappa-narthangai' || product.name?.trim().toLowerCase() === 'kappa narthangai'
}

function isKaruvadamRiceRed(product) {
  return product.slug === 'karuvadam-rice-red' || product.name?.trim().toLowerCase() === 'karuvadam rice red'
}

function isKaruvadamRiceWhite(product) {
  return product.slug === 'karuvadam-rice-white' || product.name?.trim().toLowerCase() === 'karuvadam rice white'
}

function isManathakkali(product) {
  return product.slug === 'manathakkali' || product.name?.trim().toLowerCase() === 'manathakkali'
}

function isPulyinchi(product) {
  return product.slug === 'pulyinchi' || product.name?.trim().toLowerCase() === 'pulyinchi'
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

        if (isThamaraVathal(product)) {
          return { ...product, image: '/images/tamara vathal .png', images: ['/images/tamara vathal .png'], media: [] }
        }

        if (isUnnithandu(product)) {
          return { ...product, image: '/images/Unnithandu.png', images: ['/images/Unnithandu.png'], media: [] }
        }

        if (isVadukapullyRed(product)) {
          return { ...product, image: '/images/vadukapully red.png', images: ['/images/vadukapully red.png'], media: [] }
        }

        if (isCurdChilly(product)) {
          return { ...product, image: '/images/curd chilli.png', images: ['/images/curd chilli.png'], media: [] }
        }

        if (isKappaNarthangai(product)) {
          return { ...product, image: '/images/Kappa narthangai.png', images: ['/images/Kappa narthangai.png'], media: [] }
        }

        if (isKaruvadamRiceRed(product)) {
          return { ...product, image: '/images/Karuvadam Rice Red.png', images: ['/images/Karuvadam Rice Red.png'], media: [] }
        }

        if (isKaruvadamRiceWhite(product)) {
          return { ...product, image: '/images/Karuvadam Rice White.png', images: ['/images/Karuvadam Rice White.png'], media: [] }
        }

        if (isManathakkali(product)) {
          return { ...product, image: '/images/manathakkali vathal.png', images: ['/images/manathakkali vathal.png'], media: [] }
        }

        if (isPulyinchi(product)) {
          return { ...product, image: '/images/Pulyinchi (1).png', images: ['/images/Pulyinchi (1).png'], media: [] }
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
