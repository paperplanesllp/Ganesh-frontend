export const IS_FRONTEND_PREVIEW = import.meta.env.VITE_FRONTEND_PREVIEW !== 'false'

export const DATA_SOURCE = import.meta.env.VITE_DATA_SOURCE || 'mock'

export const USE_MOCK_DATA = IS_FRONTEND_PREVIEW || DATA_SOURCE === 'mock'

export const IS_MOCK_DATA_SOURCE = USE_MOCK_DATA
