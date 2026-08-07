function AdminLoadingState({ message = 'Loading admin data...' }) {
  return (
    <div className="grid min-h-[50vh] place-items-center bg-gray-100 px-4 text-center font-[Manrope,Inter,Arial,sans-serif]">
      <div>
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm font-bold text-gray-600">{message}</p>
      </div>
    </div>
  )
}

export default AdminLoadingState
