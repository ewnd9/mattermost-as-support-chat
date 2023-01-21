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
      // // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      // '/foo': 'http://localhost:4567',
      // // with options: http://localhost:5173/api/bar-> http://jsonplaceholder.typicode.com/bar
      // '/api': {
      //   target: 'http://jsonplaceholder.typicode.com',
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ''),
      // },
      // Proxying websockets or socket.io: ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io

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
