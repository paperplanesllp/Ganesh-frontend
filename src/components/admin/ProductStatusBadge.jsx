const styles = {
  active: 'bg-brand-light text-brand',
  inactive: 'bg-gray-100 text-gray-600',
  stock: 'bg-brand-light text-brand',
  low: 'bg-brand-light text-brand-dark',
  out: 'bg-brand-light text-brand',
  badge: 'bg-brand-light text-brand-dark',
}

function ProductStatusBadge({ type, children }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[type] || styles.badge}`}>
      {children}
    </span>
  )
}

export default ProductStatusBadge
