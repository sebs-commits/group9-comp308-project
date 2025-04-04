import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'authenticationApp',
      filename: 'remoteEntry.js',
      exposes: {
        './RegisterComponent': './src/components/RegisterComponent',
        './LoginComponent': './src/components/LoginComponent'
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