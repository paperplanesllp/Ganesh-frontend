import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/currency'
import { resolveProductImage } from '../../utils/productImages'
import QuantitySelector from '../product/QuantitySelector'

function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()
  const maxQuantity = item.variant?.stock || 1

  return (
    <article className="grid gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-[120px_1fr_auto]">
      <Link to={`/products/${item.slug}`} className="overflow-hidden rounded-xl bg-brand-light">
        <img src={resolveProductImage(item.image)} alt={item.name} loading="lazy" className="h-28 w-full object-cover sm:h-full" />
      </Link>
      <div>
        <Link
          to={`/products/${item.slug}`}
          className="rounded-md focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
        >
          <h2 className="font-[Georgia,serif] text-xl font-bold text-brand-dark">{item.name}</h2>
        </Link>
        <p className="mt-1 text-sm font-semibold text-gray-600">Selected weight: {item.variantLabel}</p>
        <p className="mt-3 text-sm text-gray-600">Unit price: {formatCurrency(item.price)}</p>
        <button
          type="button"
          className="mt-4 text-sm font-bold text-brand transition duration-200 hover:text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
          onClick={() => removeFromCart(item.key)}
        >
          Remove
        </button>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
        <QuantitySelector
          compact
          value={item.quantity}
          max={maxQuantity}
          min={0}
          onChange={(quantity) => updateQuantity(item.key, quantity)}
        />
        <span className="text-lg font-bold text-brand-dark">{formatCurrency(item.price * item.quantity)}</span>
      </div>
    </article>
  )
}

export default CartItem
