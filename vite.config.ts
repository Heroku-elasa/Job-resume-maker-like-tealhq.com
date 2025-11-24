import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Cloudflare Pages sets process.env.API_KEY during build. 
  // We must explicitly define it to replace it in the client-side code.
  const apiKey = process.env.API_KEY || env.API_KEY;

  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(apiKey),
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8788', // Default Wrangler port for local dev
          changeOrigin: true,
        }
      }
    }
  };
});