import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // Base URL changes depending on environment
  base: mode === 'development' ? '/' : '/wp-content/themes/astra/react-app/dist/',
  build: {
    // Output directory for production build
    outDir: '../wp-content/themes/astra/react-app/dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
}))