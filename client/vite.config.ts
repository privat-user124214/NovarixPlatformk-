import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/', // ✅ weil du eine eigene Domain nutzt
  plugins: [react()],
});
