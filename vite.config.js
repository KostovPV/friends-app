import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import sitemap from 'vite-plugin-sitemap';
import viteCompression from 'vite-plugin-compression'; // Added compression for assets
import viteImagemin from 'vite-plugin-imagemin';

// Load environment variables from .env
dotenv.config();

const BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: BASE_URL, // Updated property to 'hostname' for vite-plugin-sitemap
      outDir: 'dist', 
      changefreq: 'weekly', // Added change frequency for SEO benefits
      priority: 0.7, // Set default priority for all pages
      routes: [
        { path: '/', lastmod: new Date().toISOString(), priority: 1.0 }, // Higher priority for homepage
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
    viteCompression({
      algorithm: 'brotliCompress', // Enable Brotli compression for better optimization
      ext: '.br', // File extension for compressed assets
      deleteOriginalAssets: false, // Retain original files for browsers that don't support Brotli
      threshold: 10240, // Only compress files larger than 10kb
    }),
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      svgo: { plugins: [{ removeViewBox: false }] }
    }),
  ],
  build: {
    outDir: 'dist', // Ensure sitemap and other assets output here
    sourcemap: true, // Enable sourcemaps for better debugging
  },
  server: {
    port: 3000, // Define the server port
    open: true, // Automatically open browser on startup
  },
});
