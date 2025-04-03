import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import cors from "cors";
import mongoose from "../config/mongoose.js";
import cookieParser from "cookie-parser";
import { combinedTypeDefs } from "./schemas/combined-typedefs.js";
import { combinedResolvers } from "./resolvers/combined.resolver.js";

const port = 3005;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3006"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  const server = new ApolloServer({
    typeDefs: combinedTypeDefs,
    resolvers: combinedResolvers,
  });

  await server.start();

  // This middleware is used to connect apollo with express | I think this was what was missing before
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req, res }) => ({ req, res }),
    })
  );

  app.listen(port, () => {
    console.log(
      `Events microservice ready at http://localhost:${port}/graphql`
    );
  });
};

startServer();
