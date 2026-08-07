export function AdminIcon({ name, className = 'h-5 w-5' }) {
  const paths = {
    dashboard: <path d="M4 13h6V4H4v9Zm10 7h6V4h-6v16ZM4 20h6v-4H4v4Z" />,
    products: <path d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Zm8 4.5 8-4.5M12 12 4 7.5M12 12v9" />,
    orders: <path d="M6 7h12l1 14H5L6 7Zm3 0V5a3 3 0 0 1 6 0v2M8 11h8M8 15h8" />,
    plus: <path d="M12 5v14M5 12h14" />,
    store: <path d="M4 10h16l-1-5H5l-1 5Zm2 0v9h12v-9M9 19v-5h6v5" />,
    account: <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8c1-4 3.4-6 7-6s6 2 7 6" />,
    logout: <path d="M9 7 4 12l5 5M4 12h11M13 5h4a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-4" />,
    menu: <path d="M5 7h14M5 12h14M5 17h14" />,
    search: <path d="m20 20-4.5-4.5M18 10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z" />,
    edit: <path d="m4 20 4.5-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20Z" />,
    eye: <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />,
    alert: <path d="M12 8v5M12 17h.01M10.3 4.5 2.8 18a1.5 1.5 0 0 0 1.3 2.2h15.8a1.5 1.5 0 0 0 1.3-2.2L13.7 4.5a2 2 0 0 0-3.4 0Z" />,
    check: <path d="m5 12 4 4 10-10" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m9 6 6 6-6 6" />,
    dots: <path d="M12 12h.01M5 12h.01M19 12h.01" />,
    info: <path d="M12 16v-4M12 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        {paths[name] || paths.products}
      </g>
    </svg>
  )
}
