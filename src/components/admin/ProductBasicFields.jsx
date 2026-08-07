import { categoryOptions, createSlugPreview, spiceLevelOptions } from '../../utils/adminProductFormHelpers'
import { FieldError, SelectField, TextInput } from './ProductFormFields'

function ProductBasicFields({ formState, errors, onChange, isEdit }) {
  const slugPreview = createSlugPreview(formState.name)

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <TextInput label="Product name" name="name" value={formState.name} error={errors.name} helper="The name customers will see." onChange={onChange} required />
      </div>
      <fieldset className="rounded-xl border border-brand/20 bg-brand-light/30 p-4 md:col-span-2">
        <legend className="px-1 text-sm font-bold text-gray-900">Product category</legend>
        <p className="mb-3 mt-1 text-xs text-gray-600">Choose where this product should appear in the catalogue.</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {categoryOptions.map((category) => {
            const isSelected = formState.category === category
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isSelected}
                className={`min-h-12 rounded-xl border px-4 text-sm font-bold transition ${isSelected ? 'border-brand bg-brand text-white shadow-sm' : 'border-gray-200 bg-white text-gray-800 hover:border-brand hover:text-brand'}`}
                onClick={() => onChange({ target: { name: 'category', value: category } })}
              >
                {category}
              </button>
            )
          })}
        </div>
        <FieldError id="category-error" message={errors.category} />
      </fieldset>
      <TextInput label="Product URL" name="slug" value={formState.slug} error={errors.slug} helper="Leave empty to create it from the product name." onChange={onChange} placeholder={slugPreview || 'mango-pickle'}>
        <span className="text-xs text-gray-600">Preview: {slugPreview || 'enter-product-name'}</span>
      </TextInput>
      <TextInput label="Flavour" name="flavour" value={formState.flavour} error={errors.flavour} onChange={onChange} required />
      <SelectField label="Spice level" name="spiceLevel" value={formState.spiceLevel} error={errors.spiceLevel} onChange={onChange} options={spiceLevelOptions} />
      <SelectField label="Food type" name="foodType" value={formState.foodType} error={errors.foodType} onChange={onChange} options={['Vegetarian']} />
      <div className="md:col-span-2">
        <TextInput label="Short description" name="shortDescription" value={formState.shortDescription} error={errors.shortDescription} helper="A short sentence shown on product cards." onChange={onChange} required />
      </div>
      {isEdit && (
        <label className="flex gap-3 rounded-lg border border-brand-light bg-brand-light p-4 text-sm font-medium text-brand-dark md:col-span-2">
          <input type="checkbox" name="updateSlug" checked={formState.updateSlug} onChange={onChange} className="mt-1 h-4 w-4 accent-brand" />
          <span>Update product URL slug from the product name. Old product links may stop working.</span>
        </label>
      )}
    </div>
  )
}

export default ProductBasicFields
