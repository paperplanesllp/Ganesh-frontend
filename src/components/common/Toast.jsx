import { useCart } from '../../context/CartContext'

function Toast() {
  const { toast } = useCart()

  if (!toast) return null

  return (
    <div
      role="status"
      className="fixed bottom-5 left-1/2 z-50 w-[min(92%,380px)] -translate-x-1/2 rounded-2xl bg-brand-dark px-5 py-4 text-sm font-semibold text-white shadow-lg"
    >
      {toast.message}
    </div>
  )
}

export default Toast
