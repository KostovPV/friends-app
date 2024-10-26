import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import sitemap from 'vite-plugin-sitemap'; // Updated import statement

// Load environment variables from .env
dotenv.config();

const BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      baseUrl: BASE_URL,
      outDir: 'dist',
      routes: [
        { path: '/', lastmod: new Date().toISOString() },
        { path: '/gallery', lastmod: new Date().toISOString() },
        { path: '/contacts', lastmod: new Date().toISOString() },
        { path: '/terms', lastmod: new Date().toISOString() },
        { path: '/book', lastmod: new Date().toISOString() },
        { path: '/upload', lastmod: new Date().toISOString() },
        { path: '/statistics', lastmod: new Date().toISOString() },
        { path: '/register', lastmod: new Date().toISOString() },
        { path: '/login', lastmod: new Date().toISOString() },
        { path: '/logout', lastmod: new Date().toISOString() },
        { path: '/profile', lastmod: new Date().toISOString() },
      ],
    }),
  ],
});
