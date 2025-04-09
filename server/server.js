import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloGateway, IntrospectAndCompose } from "@apollo/gateway";
import axios from "axios";
import cors from "cors";

// Initialize Express
const app = express();
const port = 4000;

// Setup CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    credentials: true,
  })
);

//increase payload size to allow images to be inserted to the database as base64 strings
app.use(express.json({limit: "10mb"}));

// Function to check if a microservice is running
const checkService = async (url, retries = 10, delay = 3000) => {
  const healthCheckQuery = { query: "{ _microservice }" };
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(url, healthCheckQuery);
      if (response.data && response.data.data) {
        console.log(`✅ ${url} is fully operational!`);
        return true;
      }
    } catch (error) {
      console.log(`⏳ Waiting for ${url} (${i + 1}/${retries})...`);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw new Error(`❌ Service at ${url} did not start in time.`);
};

const startGateway = async () => {
  try {
    // Wait until all services are ready
    await checkService("http://localhost:4001/graphql");
    await checkService("http://localhost:4002/graphql");
    await checkService("http://localhost:4003/graphql");

    // Configure the Apollo Gateway
    const gateway = new ApolloGateway({
      supergraphSdl: new IntrospectAndCompose({
        subgraphs: [
          { name: "auth", url: "http://localhost:4001/graphql" },
          { name: "business", url: "http://localhost:4002/graphql" },
          { name: "community", url: "http://localhost:4003/graphql" },
        ],
      }),
    });

    // Initialize Apollo Server 4
    const server = new ApolloServer({
      gateway,
    });

    await server.start();

    // Use expressMiddleware instead of applyMiddleware
    app.use(
      "/graphql",
      expressMiddleware(server, {
        context: async ({ req, res }) => ({ req, res }),
      })
    );

    app.listen({ port }, () =>
      console.log(`🚀 Gateway Server ready at http://localhost:${port}/graphql`)
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1); // Exit if services are not available
  }
};

// Start the gateway
startGateway();
