export const AUTH_INTENT_STORAGE_KEY = 'ganesh-pickles-auth-intent'
export const AUTH_ACTIONS = {
  RETURN_TO: 'RETURN_TO',
  BUY_NOW: 'BUY_NOW',
}

export function getSafeInternalPath(value, fallback = '/') {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')
    ? value
    : fallback
}

export function getLoginPath(returnTo) {
  const safeReturnTo = getSafeInternalPath(returnTo)
  return `/login?redirect=${encodeURIComponent(safeReturnTo)}`
}

export function saveAuthIntent(intent) {
  try {
    const returnTo = getSafeInternalPath(intent?.returnTo)
    const nextIntent = {
      action: intent?.action === AUTH_ACTIONS.BUY_NOW ? AUTH_ACTIONS.BUY_NOW : AUTH_ACTIONS.RETURN_TO,
      returnTo,
      ...(intent?.action === AUTH_ACTIONS.BUY_NOW
        ? {
            productId: String(intent.productId || ''),
            variantId: String(intent.variantId || ''),
            selectedVariant: intent.selectedVariant,
            quantity: Math.max(1, Number.parseInt(intent.quantity, 10) || 1),
          }
        : {}),
    }

    window.sessionStorage.setItem(AUTH_INTENT_STORAGE_KEY, JSON.stringify(nextIntent))
    return nextIntent
  } catch {
    return null
  }
}

export function readAuthIntent() {
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(AUTH_INTENT_STORAGE_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return null

    return {
      ...parsed,
      returnTo: getSafeInternalPath(parsed.returnTo),
    }
  } catch {
    return null
  }
}

export function clearAuthIntent() {
  try {
    window.sessionStorage.removeItem(AUTH_INTENT_STORAGE_KEY)
  } catch {
    // Session storage can be unavailable in strict browser modes.
  }
}

export function getAuthDestination(locationState, search = '', fallback = '/') {
  const redirect = new URLSearchParams(search).get('redirect')
  if (redirect) return getSafeInternalPath(redirect, fallback)

  const intent = readAuthIntent()
  if (intent?.returnTo) return intent.returnTo

  if (typeof locationState?.from === 'string') {
    return getSafeInternalPath(locationState.from, fallback)
  }

  const pathname = getSafeInternalPath(locationState?.from?.pathname, fallback)
  const stateSearch = typeof locationState?.from?.search === 'string' ? locationState.from.search : ''
  return `${pathname}${stateSearch}`
}
