import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
    allowedHosts: [
      'barbershopv2-production.up.railway.app',
      '.railway.app', // Permite todos los subdominios de Railway
      'localhost'
    ]
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    allowedHosts: [
      'barbershopv2-production.up.railway.app',
      '.railway.app', // Permite todos los subdominios de Railway
      'localhost'
    ]
  }
})