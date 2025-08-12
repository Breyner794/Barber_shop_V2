import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Configuración para desarrollo local
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 5173,
    strictPort: true,
    
    // ✅ HMR más conservador para móvil
    hmr: {
      timeout: 30000, // Reducido de 60s
      heartbeatInterval: 60000, // Aumentado para menos interferencia
    },
    
    allowedHosts: [
      'barbershopv2-production.up.railway.app',
      '.railway.app',
      'localhost'
    ]
  },
  
  // ✅ Configuración para preview/producción
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT) || 3000,
    strictPort: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  
  // ✅ Build optimizations
  build: {
    outDir: 'dist',
    sourcemap: false,
    // ✅ Optimización para Railway
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['lucide-react']
        }
      }
    }
  }
})