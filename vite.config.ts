import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    // Ajoute les en-têtes de sécurité COOP/COEP nécessaires pour Stockfish
    {
      name: 'configure-response-headers',
      configureServer: server => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          next();
        });
      }
    }
  ],
  // Indique à Vite comment "empaqueter" le worker et ses dépendances
  worker: {
    format: 'iife'
  }
})
