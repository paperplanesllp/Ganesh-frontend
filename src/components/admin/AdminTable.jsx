import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from '../../utils/currency'
import { getPrimaryProductImage } from '../../utils/productImages'
import { AdminIcon } from './AdminIcons'
import ProductStatusBadge from './ProductStatusBadge'

function getStockBadge(product) {
  if (!product.inStock || product.totalStock === 0) return <ProductStatusBadge type="out">Out of stock</ProductStatusBadge>
  if (product.variants?.some((variant) => variant.stock > 0 && variant.stock <= 5)) return <ProductStatusBadge type="low">Low Stock</ProductStatusBadge>
  return <ProductStatusBadge type="stock">In Stock</ProductStatusBadge>
}

function formatAdminDate(value) {
  if (!value) return 'Unknown'
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value))
}

function ActionButtons({ product, onToggleStatus, onDeactivate, isRowSaving }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined
    const close = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
      if (event.type === 'pointerdown' && menuRef.current && !menuRef.current.contains(event.target)) setIsOpen(false)
    }
    document.addEventListener('keydown', close)
    document.addEventListener('pointerdown', close)
    return () => {
      document.removeEventListener('keydown', close)
      document.removeEventListener('pointerdown', close)
    }
  }, [isOpen])

  const handleMenuAction = (callback) => {
    setIsOpen(false)
    callback()
  }

  return (
    <div className="flex items-center gap-2">
      <Link to={`/admin/products/${product._id}/edit`} className="inline-flex min-h-10 items-center rounded-lg bg-brand px-3 text-xs font-medium text-white hover:bg-brand-dark">
        Edit
      </Link>
      {product.slug && (
        <Link to={`/products/${product.slug}`} className="inline-flex min-h-10 items-center rounded-lg border border-gray-200 px-3 text-xs font-medium text-brand hover:bg-brand-light">
          View
        </Link>
      )}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          disabled={isRowSaving}
          className="grid h-10 w-10 place-items-center rounded-lg border border-gray-200 text-brand hover:bg-brand-light disabled:opacity-50"
          aria-label={`More actions for ${product.name}`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((current) => !current)}
        >
          <AdminIcon name="dots" className="h-5 w-5" />
        </button>
        {isOpen && (
          <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg" role="menu">
            <button type="button" role="menuitem" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-brand-light" onClick={() => handleMenuAction(() => onToggleStatus(product, { featured: !product.featured }))}>
              {product.featured ? 'Remove featured' : 'Mark featured'}
            </button>
            <button type="button" role="menuitem" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-brand-light" onClick={() => handleMenuAction(() => onToggleStatus(product, { bestseller: !product.bestseller }))}>
              {product.bestseller ? 'Remove bestseller' : 'Mark bestseller'}
            </button>
            <button type="button" role="menuitem" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-900 hover:bg-brand-light" onClick={() => handleMenuAction(() => onToggleStatus(product, { newArrival: !product.newArrival }))}>
              {product.newArrival ? 'Remove new arrival' : 'Mark new arrival'}
            </button>
            {product.isActive ? (
              <button type="button" role="menuitem" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand hover:bg-brand-light" onClick={() => handleMenuAction(() => onDeactivate(product))}>
                Deactivate
              </button>
            ) : (
              <button type="button" role="menuitem" className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-brand hover:bg-brand-light" onClick={() => handleMenuAction(() => onToggleStatus(product, { isActive: true }))}>
                Activate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminTable({ products, onToggleStatus, onDeactivate, savingProductId }) {
  return (
    <div className="overflow-visible rounded-xl border border-gray-200 bg-white">
      <table className="hidden w-full border-collapse text-left lg:table">
        <thead className="bg-gray-100 text-xs font-medium uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Price</th>
            <th className="px-4 py-3">Variants</th>
            <th className="px-4 py-3">Stock</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {products.map((product) => (
            <tr key={product._id} className="align-middle hover:bg-gray-100/60">
              <td className="px-4 py-3">
                <div className="flex min-w-64 gap-3">
                  <img src={getPrimaryProductImage(product)} alt="" className="h-12 w-12 rounded-lg bg-gray-100 object-contain" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">{product.name}</p>
                    <p className="mt-1 max-w-60 truncate text-xs text-gray-600">{product.variants?.[0]?.sku || product.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{product.category}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(product.startingPrice || 0)}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{product.variants?.length || 0}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{product.totalStock || 0}</td>
              <td className="px-4 py-3">
                <div className="grid gap-1">
                  <ProductStatusBadge type={product.isActive ? 'active' : 'inactive'}>{product.isActive ? 'Active' : 'Inactive'}</ProductStatusBadge>
                  {getStockBadge(product)}
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{formatAdminDate(product.updatedAt)}</td>
              <td className="px-4 py-3">
                <ActionButtons product={product} onToggleStatus={onToggleStatus} onDeactivate={onDeactivate} isRowSaving={savingProductId === product._id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="grid gap-3 p-3 lg:hidden">
        {products.map((product) => (
          <article key={product._id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex gap-3">
              <img src={getPrimaryProductImage(product)} alt="" className="h-20 w-20 rounded-lg bg-gray-100 object-contain" />
              <div className="min-w-0 flex-1">
                <h3 className="break-words font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{product.category}</p>
                <p className="mt-2 text-sm font-medium text-gray-900">{formatCurrency(product.startingPrice || 0)}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <ProductStatusBadge type={product.isActive ? 'active' : 'inactive'}>{product.isActive ? 'Active' : 'Inactive'}</ProductStatusBadge>
              {getStockBadge(product)}
            </div>
            <p className="mt-3 text-sm text-gray-600">{product.variants?.length || 0} variants - {product.totalStock || 0} stock</p>
            <div className="mt-4">
              <ActionButtons product={product} onToggleStatus={onToggleStatus} onDeactivate={onDeactivate} isRowSaving={savingProductId === product._id} />
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminTable
