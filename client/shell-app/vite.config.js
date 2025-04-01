import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shellApp',
      remotes: {
        eventsAndAdministrationApp: 'http://localhost:3002/assets/remoteEntry.js',
        authenticationApp: 'http://localhost:3004/assets/remoteEntry.js',
        communityBusinessApp: 'http://localhost:3006/assets/remoteEntry.js'
      },
      shared: [ 'react', 'react-dom', '@apollo/client', 'graphql', 'react-router-dom' ],
    }),
  ],
});