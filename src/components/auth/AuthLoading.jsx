function AuthLoading() {
  return (
    <div className="grid min-h-[55vh] place-items-center bg-white px-4 text-center">
      <div>
        <p className="font-[Georgia,serif] text-3xl font-bold text-brand-dark">Ganesh Pickles</p>
        <div className="mx-auto mt-5 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand" />
        <p className="mt-4 text-sm font-semibold text-gray-600">Checking your session...</p>
      </div>
    </div>
  )
}

export default AuthLoading

