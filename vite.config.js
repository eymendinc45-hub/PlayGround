import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  preview: {
    allowedHosts: ['live-44558769835-1.omgithub.com', 'localhost', '127.0.0.1'],
  },
})
