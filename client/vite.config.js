import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true
    },
    server: {
        host: '0.0.0.0',
        port: 5000,
        allowedHosts: true,
        proxy: {
            '/api/chat': {
                target: 'http://localhost:5001',
                changeOrigin: true,
                configure: function (proxy) {
                    proxy.on('proxyReq', function (proxyReq) {
                        proxyReq.setHeader('Accept', 'text/event-stream');
                    });
                    proxy.on('proxyRes', function (proxyRes) {
                        proxyRes.headers['cache-control'] = 'no-cache';
                        proxyRes.headers['x-accel-buffering'] = 'no';
                    });
                }
            },
            '/api': {
                target: 'http://localhost:5001',
                changeOrigin: true
            },
            '/google_login': {
                target: 'http://localhost:5001',
                changeOrigin: true
            },
            '/logout': {
                target: 'http://localhost:5001',
                changeOrigin: true
            }
        }
    }
});
