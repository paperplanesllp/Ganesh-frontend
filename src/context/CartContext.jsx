import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { getPrimaryProductImage } from '../utils/productImages'
import { getProductId, getVariantId } from '../utils/localProductCatalog'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'ganesh-pickles-cart'

function isPositiveFiniteNumber(value) {
  return Number.isFinite(value) && value > 0
}

function normalizeStoredItem(item) {
  if (!item || typeof item !== 'object') return null

  const productId = item.productId || item._id || item.id
  const storedVariant = item.variant || item.selectedVariant
  const variantId = item.variantId || getVariantId(storedVariant)
  const price = Number(storedVariant?.price ?? item.price)
  const stock = Number(storedVariant?.stock ?? item.stock)
  const quantity = Number(item.quantity)

  if (
    typeof productId !== 'string' ||
    typeof variantId !== 'string' ||
    typeof item.slug !== 'string' ||
    typeof item.name !== 'string' ||
    typeof item.image !== 'string' ||
    !storedVariant ||
    typeof storedVariant.label !== 'string' ||
    !isPositiveFiniteNumber(price) ||
    !Number.isFinite(stock) ||
    stock < 0 ||
    !Number.isInteger(quantity) ||
    quantity < 1
  ) {
    return null
  }

  const safeStock = Math.max(0, Math.floor(stock))
  const safeQuantity = Math.min(quantity, safeStock)
  if (safeQuantity < 1) return null

  const variant = {
    ...storedVariant,
    id: variantId,
    _id: storedVariant._id || variantId,
    price,
    stock: safeStock,
  }

  return {
    key: `${productId}:${variantId}`,
    productId,
    variantId,
    slug: item.slug,
    name: item.name,
    image: item.image,
    variant,
    variantLabel: storedVariant.label,
    grams: storedVariant.grams,
    price,
    originalPrice: storedVariant.originalPrice ?? item.originalPrice ?? null,
    quantity: safeQuantity,
    stock: safeStock,
    freeShipping: item.freeShipping === true,
    deliveryCharge: Math.max(0, Number(item.deliveryCharge) || 0),
  }
}

function readStoredCart() {
  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!storedValue) return []

    const parsedValue = JSON.parse(storedValue)
    if (!Array.isArray(parsedValue)) return []

    return parsedValue.map(normalizeStoredItem).filter(Boolean)
  } catch {
    window.localStorage.removeItem(CART_STORAGE_KEY)
    return []
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readStoredCart)
  const [toast, setToast] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const toastTimeoutRef = useRef(null)
  const toastIdRef = useRef(0)

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems))
  }, [cartItems])

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current)
    },
    [],
  )

  const showToast = (message, type = 'success') => {
    if (toastTimeoutRef.current) window.clearTimeout(toastTimeoutRef.current)

    toastIdRef.current += 1
    setToast({ id: toastIdRef.current, message, type })
    toastTimeoutRef.current = window.setTimeout(() => setToast(null), 2800)
  }

  const addToCart = (product, variant, quantity = 1) => {
    const stock = Number.isFinite(variant?.stock) ? Math.max(0, Math.floor(variant.stock)) : 0
    const productId = getProductId(product)
    const variantId = getVariantId(variant)

    if (!productId || !variantId || stock < 1 || !isPositiveFiniteNumber(variant.price)) {
      showToast('This variant is currently out of stock.', 'error')
      return false
    }

    const requestedQuantity = Number.isFinite(Number(quantity)) ? Math.max(1, Math.floor(Number(quantity))) : 1
    const key = `${productId}:${variantId}`
    const existingItem = cartItems.find((item) => item.key === key)
    const currentQuantity = existingItem?.quantity || 0
    const nextQuantity = Math.min(currentQuantity + requestedQuantity, stock)
    const addedQuantity = nextQuantity - currentQuantity

    setCartItems((currentItems) => {
      const currentExistingItem = currentItems.find((item) => item.key === key)

      if (currentExistingItem) {
        return currentItems.map((item) =>
          item.key === key
            ? {
                ...item,
                quantity: Math.min(item.quantity + requestedQuantity, stock),
                variant: { ...variant, id: variantId, _id: variantId },
                price: variant.price,
                originalPrice: variant.originalPrice || null,
                deliveryCharge: product.delivery?.type === 'fixed'
                  ? Math.max(0, Number(product.delivery.charge) || 0)
                  : 0,
                stock,
                freeShipping: product.freeShipping === true,
              }
            : item,
        )
      }

      return [
        ...currentItems,
        {
          key,
          productId,
          variantId,
          slug: product.slug,
          name: product.name,
          image: getPrimaryProductImage(product),
          variant: { ...variant, id: variantId, _id: variantId },
          variantLabel: variant.label,
          grams: variant.grams,
          price: variant.price,
          originalPrice: variant.originalPrice || null,
          deliveryCharge: product.delivery?.type === 'fixed'
            ? Math.max(0, Number(product.delivery.charge) || 0)
            : 0,
          quantity: Math.min(requestedQuantity, stock),
          stock,
          freeShipping: product.freeShipping === true,
        },
      ]
    })

    if (addedQuantity < 1) {
      showToast(`You already have the available stock for ${variant.label}.`, 'info')
      return false
    }

    if (addedQuantity < requestedQuantity) {
      showToast(`Only ${stock} item(s) available for ${variant.label}.`, 'info')
    } else {
      showToast(`${product.name} added to cart`)
    }

    return addedQuantity > 0
  }

  const removeFromCart = (key) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.key !== key))
    showToast('Item removed from cart', 'info')
  }

  const updateQuantity = (key, quantity) => {
    const nextQuantity = Number(quantity)
    if (!Number.isInteger(nextQuantity)) return

    if (nextQuantity < 1) {
      removeFromCart(key)
      return
    }

    setCartItems((currentItems) =>
      currentItems.map((item) => {
        if (item.key !== key) return item
        const stock = Number.isFinite(item.variant?.stock) ? Math.max(1, Math.floor(item.variant.stock)) : nextQuantity
        return { ...item, quantity: Math.min(nextQuantity, stock) }
      }),
    )
  }

  const clearCart = () => {
    setCartItems([])
    showToast('Cart cleared', 'info')
  }

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const price = Number.isFinite(item.price) ? item.price : 0
        const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0
        return sum + price * quantity
      }, 0),
    [cartItems],
  )

  const savings = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const originalPrice = Number(item.originalPrice)
        if (!Number.isFinite(originalPrice) || originalPrice <= item.price) return sum
        return sum + (originalPrice - item.price) * item.quantity
      }, 0),
    [cartItems],
  )

  const cartCount = useMemo(
    () =>
      cartItems.reduce((total, item) => {
        const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 0
        return total + quantity
      }, 0),
    [cartItems],
  )

  // The delivery state is collected at checkout, so cart totals exclude shipping.
  // The backend remains authoritative for the final order-level charge.
  const deliveryCharge = 0
  const total = subtotal + deliveryCharge

  const value = {
    cartItems,
    cartCount,
    subtotal,
    savings,
    deliveryCharge,
    shipping: deliveryCharge,
    total,
    isCartOpen,
    toast,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setIsCartOpen,
    showToast,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
