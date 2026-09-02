const fields = [
  ['isActive', 'Show product in store', 'Customers can see and purchase this product.'],
  ['freeShipping', 'Free shipping', 'Waive shipping for this product when it is ordered alone.'],
  ['featured', 'Featured product', 'Show in featured product sections.'],
  ['bestseller', 'Bestseller', 'Show in bestseller sections.'],
  ['newArrival', 'New arrival', 'Show in new-arrival sections.'],
]

function ProductStatusFields({ formState, onChange }) {
  return (
    <div className="grid gap-3">
      {fields.map(([name, label, description]) => (
        <label key={name} className="flex gap-3 rounded-lg border border-gray-200 p-3">
          <input type="checkbox" name={name} checked={Boolean(formState[name])} onChange={onChange} className="mt-1 h-4 w-4 accent-brand" />
          <span>
            <span className="block text-sm font-medium text-gray-900">{label}</span>
            <span className="mt-1 block text-xs text-gray-600">{description}</span>
          </span>
        </label>
      ))}
    </div>
  )
}

export default ProductStatusFields
