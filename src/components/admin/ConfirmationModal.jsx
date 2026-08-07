import { useEffect, useRef } from 'react'

function ConfirmationModal({ isOpen, title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false, isSubmitting = false, onConfirm, onCancel }) {
  const dialogRef = useRef(null)
  const cancelRef = useRef(null)
  const confirmRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    cancelRef.current?.focus()
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && !isSubmitting) onCancel()
      if (event.key !== 'Tab') return
      const focusable = dialogRef.current?.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, isSubmitting, onCancel])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-black/40 p-3 sm:p-4" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !isSubmitting) onCancel()
    }}>
      <div ref={dialogRef} className="max-h-[calc(100svh-1.5rem)] w-full max-w-md overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 shadow-xl sm:p-6" role="dialog" aria-modal="true" aria-labelledby="confirmation-title">
        <h2 id="confirmation-title" className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-gray-600">{message}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={cancelRef} type="button" disabled={isSubmitting} className="min-h-11 rounded-lg border border-gray-200 px-4 text-sm font-medium text-brand disabled:opacity-60" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button ref={confirmRef} type="button" disabled={isSubmitting} className={`min-h-11 rounded-lg px-4 text-sm font-medium text-white disabled:opacity-60 ${danger ? 'bg-brand hover:bg-brand-dark' : 'bg-brand hover:bg-brand-dark'}`} onClick={onConfirm}>
            {isSubmitting ? 'Working...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
