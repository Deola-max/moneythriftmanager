import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'components'),
          '@contexts': path.resolve(__dirname, 'contexts'),
          '@types': path.resolve(__dirname, 'types'),
          '@hooks': path.resolve(__dirname, 'hooks')
        }
      },
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'styled-components']
      }
    };
});
