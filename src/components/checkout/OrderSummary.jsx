import { useCart } from '../../context/CartContext'
import { formatCurrency } from '../../utils/currency'
import CartSummary from '../cart/CartSummary'
import { calculateShippingCharge, calculateTotalCartWeightKg } from '../../utils/shipping'

function OrderSummary({ deliveryState }) {
  const { cartItems, cartCount, subtotal } = useCart()
  const totalWeightKg = calculateTotalCartWeightKg(cartItems.filter((item) => !item.freeShipping))
  const deliveryCharge = calculateShippingCharge(deliveryState, totalWeightKg)
  const total = subtotal + deliveryCharge

  return (
    <div className="grid gap-4">
      <CartSummary
        cartCount={cartCount}
        subtotal={subtotal}
        deliveryCharge={deliveryCharge}
        total={total}
        checkout={false}
      />
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-[Georgia,serif] text-xl font-bold text-brand-dark">Order Items</h2>
        <div className="grid gap-3">
          {cartItems.map((item) => (
            <div key={item.key} className="border-b border-gray-200 pb-3 text-sm last:border-b-0 last:pb-0">
              <div className="flex justify-between gap-4">
                <span className="font-semibold text-gray-900">{item.name}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</span>
              </div>
              <p className="mt-1 text-gray-600">
                {item.variantLabel} x {item.quantity}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 rounded-xl bg-brand-light p-3 text-sm font-semibold text-brand">
          {deliveryCharge === 0
            ? 'Free shipping applied to this order.'
            : `Shipping to ${deliveryState}: ${formatCurrency(deliveryCharge)} for ${Math.ceil(totalWeightKg)} kg chargeable weight`}
        </p>
      </div>
    </div>
  )
}

export default OrderSummary
