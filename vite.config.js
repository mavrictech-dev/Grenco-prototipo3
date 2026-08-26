import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * El plugin que inyectaba el preload del hero ya no hace falta: el LCP pasó a
 * ser el poster del primer panel de video, que vive en public/video/ con ruta
 * estable y sin hash, asi que el <link rel="preload"> va escrito directamente
 * en index.html.
 */
export default defineConfig({
  plugins: [react()],

  build: {
    target: 'es2020',
    cssCodeSplit: false, // una sola hoja: es una landing de una pagina
    reportCompressedSize: false,
    assetsInlineLimit: 2048, // los SVG/fuentes chicos van embebidos
    rollupOptions: {
      output: {
        // React aparte del codigo de la landing: cambia mucho menos, asi el
        // navegador reutiliza su cache entre despliegues. Se filtra por ruta
        // real y no por nombre de paquete, porque el entrypoint es
        // 'react-dom/client' y una lista de especificadores no lo alcanza.
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react';
          }
          if (id.includes('node_modules/scheduler')) return 'react';
          return undefined;
        },
        assetFileNames: (info) => {
          const name = info.names?.[0] ?? '';
          if (/\.(woff2?|ttf|otf)$/.test(name)) return 'assets/fonts/[name]-[hash][extname]';
          if (/\.(png|jpe?g|webp|svg|avif)$/.test(name)) return 'assets/img/[name]-[hash][extname]';
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },

  server: {
    port: 5173,
    open: true,
  },
});
