import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select']
                }
            }
        }
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        allowedHosts: [
            "f08f172c-ab06-433f-aa2f-30c498986833-00-2n6bjrfy6tvjp.pike.replit.dev",
            "localhost",
        ],
        proxy: {
            '/api': {
                target: 'http://0.0.0.0:8000',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
});
