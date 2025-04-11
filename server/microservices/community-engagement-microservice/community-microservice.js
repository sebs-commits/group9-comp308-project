import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/federation"; // Re added this
import express from "express";
import cors from "cors";
import mongoose from "../../config/mongoose.js";
import cookieParser from "cookie-parser";
import { combinedTypeDefs } from "./schemas/combined-typedefs.js";
import { combinedResolvers } from "./resolvers/combined.resolver.js";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled"; // No idea what this does, but it gets rid of the added message in console
import { createServer } from "http";
import { Server } from "socket.io";
import AlertModel from "./models/alert.server.model.js";

const port = 4003;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:3000", 
      "http://localhost:3002",
      "http://localhost:3003"
    ],
    credentials: true
  }
})

app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3002",
      "http://localhost:3003",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      { typeDefs: combinedTypeDefs, resolvers: combinedResolvers },
    ]),
    plugins: [ApolloServerPluginInlineTraceDisabled()],
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  let lastChecked = new Date();

  const checkAlert = async () => {
    try {
      const alert = await AlertModel.find({ createdAt: { $gt: lastChecked } }).exec();

      if (alert.length > 0) {      
        io.emit("alert", alert);
        lastChecked = new Date();
      }
    } catch (error) {
      console.log("Error during polling: ", error);
      throw new Error("An error occurred while polling - community-microservice.js");
    }
  };

  setInterval(checkAlert, 2000);

  httpServer.listen(port, () => {
    console.log(`🚀 Gateway Server ready at http://localhost:${port}/graphql`);
    console.log(`🔌 WebSocket Server running at ws://localhost:${port}`);
  }); 
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
