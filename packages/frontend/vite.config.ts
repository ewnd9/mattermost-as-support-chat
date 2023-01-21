import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    // viteCommonjs({
    //   exclude: ['core-js'],
    // }),
  ],
  server: {
    proxy: {
      '/websocket': {
        target: 'ws://localhost:8081',
        ws: true,
        // changeOrigin: true,
      },
      '/trpc': {
        target: 'http://localhost:8081',
        changeOrigin: true,
      },
    },
  },
});
