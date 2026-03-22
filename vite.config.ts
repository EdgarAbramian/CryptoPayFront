import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3784,
    host: '0.0.0.0',
    allowedHosts: [
      'mynewproject-ubunthomainssh.7nsymk.easypanel.host',
      'test147.dobrye-ruki.com',
      'localhost',
      '127.0.0.1',
      '.easypanel.host',
      'all'
    ]
  },
})