import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // VITE_BASE is set to /trials/ by the GitHub Pages workflow.
  // Locally it is unset, so the app serves from /.
  base: process.env.VITE_BASE ?? '/',
})
