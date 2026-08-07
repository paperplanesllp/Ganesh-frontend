import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Permit standard ngrok development hostnames while keeping Vite's host check enabled.
    allowedHosts: ['.ngrok-free.app', '.ngrok.io'],
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // Match the backend's local CORS allowlist after the browser request enters the proxy.
        headers: { Origin: 'http://localhost:5173' },
      },
    },
  },
})
