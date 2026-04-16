import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';

export default defineConfig({
  envPrefix: 'NEXT_PUBLIC_',
  logLevel: 'info',
  plugins: [
    babel({
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: /node_modules/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        plugins: ['styled-jsx/babel'],
      },
    }),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  clearScreen: false,
  server: {
    host: '0.0.0.0',
    port: 4000,
    hmr: {
      overlay: false,
    },
  },
});
