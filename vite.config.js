import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({

  define: {
    'process.env.IS_PREACT': JSON.stringify("true"),
  },

  
  plugins: [
    react(),
    tailwindcss()
  ],

  server: {
    host : '127.0.0.1',
    port : 5173,
    allowedHosts : ['updates-inf.gl.at.ply.gg'], 
  },
})
