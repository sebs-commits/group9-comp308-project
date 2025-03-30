import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'eventsAndAdministrationApp',
      filename: 'remoteEntry.js',
      exposes: {
        './CreateUpdateEvent': './src/CreateUpdateEvent'
      },
      shared: [ 'react', 'react-dom', '@apollo/client', 'graphql', 'react-router-dom' ]
    })
  ],

  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
})