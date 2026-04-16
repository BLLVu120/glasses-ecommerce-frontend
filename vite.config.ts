import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/s3-proxy': {
        target: 'https://optics-management-storage.s3.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3-proxy/, ''),
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. NHÓM 3D (Three.js) - ĐÃ ĐƯỢC TÁCH NHỎ!
            if (id.includes('@react-three/drei')) return 'vendor-r3f-drei';
            if (id.includes('@react-three/fiber')) return 'vendor-r3f-core';

            // Tách các thành phần phụ trợ (Loaders, Controls...) - Thường rất nặng
            if (id.includes('three/examples/jsm') || id.includes('three-stdlib'))
              return 'vendor-three-stdlib';
            // Tách lõi xử lý Math (Vector3, Matrix4...)
            if (id.includes('three/src/math')) return 'vendor-three-math';
            // Tách lõi Render (WebGLRenderer...)
            if (id.includes('three/src/renderers')) return 'vendor-three-renderers';
            // Phần khung xương còn lại của Three.js
            if (id.includes('three')) return 'vendor-three-core';

            // 2. NHÓM BIỂU ĐỒ
            if (id.includes('recharts') || id.includes('d3')) return 'vendor-charts';

            // 3. NHÓM UI & ICONS
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('@radix-ui')) return 'vendor-radix';

            // 4. NHÓM STATE, DATA FETCHING
            if (id.includes('@tanstack')) return 'vendor-query';
            if (id.includes('zustand')) return 'vendor-zustand';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('react-router')) return 'vendor-router';

            // 5. NHÓM FORM & VALIDATION
            if (id.includes('react-hook-form') || id.includes('@hookform')) return 'vendor-form';
            if (id.includes('zod')) return 'vendor-zod';

            // 6. CORE REACT
            if (id.includes('react/') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
  },
});
