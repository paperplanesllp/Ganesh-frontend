// The deployed store must use the API so product visibility, stock, and admin
// changes are always read from the database. Local mock data remains available
// only when it is explicitly requested for a frontend-only preview.
export const IS_FRONTEND_PREVIEW = import.meta.env.VITE_FRONTEND_PREVIEW === 'true'

export const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'api'

export const USE_MOCK_DATA = IS_FRONTEND_PREVIEW || DATA_SOURCE === 'mock'

export const IS_MOCK_DATA_SOURCE = USE_MOCK_DATA
