import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // This ensures correct paths for assets. Adjust if necessary for subdirectories.
});
