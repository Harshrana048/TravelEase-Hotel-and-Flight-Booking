import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy: {
      '/api': {
        target:'https://travelease-hotel-and-flight-booking-1.onrender.com',
      },
    },
  },
  plugins: [react(),
    tailwindcss(),


  ],
})
