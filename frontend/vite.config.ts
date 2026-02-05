import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0を解放して外部からアクセス可能にする
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Docker環境でのホットリロードを安定させる
    },
  },
})