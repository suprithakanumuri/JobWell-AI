import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 70 },
      pngquant: {
        quality: [0.65, 0.8],
        speed: 1,
      },
      svgo: {
        plugins: [{ name: 'removeViewBox' }, { name: 'removeEmptyAttrs', active: false }],
      },
      webp: {
        quality: 75,
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Optional: raise or suppress warning
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react-vendor';
            if (id.includes('axios')) return 'axios-vendor';
            return 'vendor'; // fallback for other libs
          }
        },
      },
    },
  },
});