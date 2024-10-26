import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { sitemap } from 'vite-plugin-sitemap';


dotenv.config();

// Define the base URL of your website for the sitemap
const BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:3000'; // Default to localhost if BASE_URL is not set

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      // Sitemap options
      baseUrl: BASE_URL,
      outDir: 'dist', // Output directory for the generated sitemap
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
        // Add other routes here
      ],
    }),
  ],
});
