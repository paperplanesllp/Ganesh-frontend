import { FieldError, TextArea } from './ProductFormFields'

function RepeatableList({ field, label, values, errors, onArrayChange, addArrayItem, removeArrayItem }) {
  const addLabels = {
    highlights: 'Add highlight',
    usageSuggestions: 'Add suggestion',
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        <button type="button" className="min-h-10 rounded-lg border border-gray-200 px-3 text-sm font-medium text-brand hover:bg-brand-light" onClick={() => addArrayItem(field)}>
          {addLabels[field] || 'Add'}
        </button>
      </div>
      <div className="grid gap-3">
        {values.map((value, index) => (
          <div key={index} className="grid gap-2 md:grid-cols-[1fr_auto]">
            <input className="min-h-11 rounded-lg border border-gray-200 px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/15" value={value} aria-label={`${label} ${index + 1}`} onChange={(event) => onArrayChange(field, index, event.target.value)} />
            <button type="button" className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand hover:bg-brand-light" aria-label={`Remove ${label.toLowerCase()} ${index + 1}`} onClick={() => removeArrayItem(field, index)}>
              Remove
            </button>
            <FieldError id={`${field}-${index}-error`} message={errors[`${field}.${index}`]} />
          </div>
        ))}
      </div>
    </div>
  )
}

function ProductContentFields({ formState, errors, onChange, onArrayChange, addArrayItem, removeArrayItem }) {
  return (
    <div className="grid gap-5">
      <TextArea label="Full description" name="description" value={formState.description} error={errors.description} onChange={onChange} rows={5} required />
      <RepeatableList field="highlights" label="Highlights" values={formState.highlights} errors={errors} onArrayChange={onArrayChange} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
      <RepeatableList field="usageSuggestions" label="Serving suggestions" values={formState.usageSuggestions} errors={errors} onArrayChange={onArrayChange} addArrayItem={addArrayItem} removeArrayItem={removeArrayItem} />
    </div>
  )
}

export default ProductContentFields
