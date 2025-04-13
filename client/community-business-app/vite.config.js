import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "communityBusinessApp",
      filename: "remoteEntry.js",
      exposes: {
        "./CreateNews": "./src/components/CreateNews",
        "./CreateUpdateRequests": "./src/components/CreateUpdateRequests",
        "./CreateUpdateAlerts": "./src/components/CreateUpdateAlerts",
        "./CreateUpdateBusinessListing":
          "./src/components/CreateUpdateBusinessListing",
        "./ViewBusinessListings": "./src/components/ViewBusinessListings",
        "./NewsList": "./src/components/NewsList",
        "./NewsPage": "./src/components/NewsPage",
      },
      shared: [
        "react",
        "react-dom",
        "@apollo/client",
        "graphql",
        "react-router-dom",
      ],
    }),
  ],

  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
