import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/federation";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import express from "express";
import cors from "cors";
import mongoose from "../../config/mongoose.js";
import cookieParser from "cookie-parser";
import { eventTypeDefs } from "./schemas/events-typedefs.js";
import { eventsResolvers } from "./resolvers/events.server.resolver.js";
import { businessListingTypeDefs } from "./schemas/business-listing-typedefs.js";
import { businessListingResolvers } from "./resolvers/business-listing.server.resolver.js";

const port = 4002;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  })
);

//increase payload size to allow images to be inserted to the database as base64
app.use(express.json({limit: "10mb"})); 

app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      { typeDefs: eventTypeDefs, resolvers: eventsResolvers },
      { typeDefs: businessListingTypeDefs, resolvers: businessListingResolvers },
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

  app.listen(port, () => {
    console.log(
      `🚀 Business-Events Server ready at http://localhost:${port}/graphql`
    );
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
