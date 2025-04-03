import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSubgraphSchema } from "@apollo/federation";
import { ApolloServerPluginInlineTraceDisabled } from "@apollo/server/plugin/disabled";
import express from "express";
import cors from "cors";
import mongoose from "../../config/mongoose.js";
import cookieParser from "cookie-parser";
import { userResolvers } from "./resolvers/user.server.resolver.js";
import { userTypeDefs } from "./schemas/user-typedefs.js";

const port = 4001;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      { typeDefs: userTypeDefs, resolvers: userResolvers },
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
      `🚀 Authentication Server ready at http://localhost:${port}/graphql`
    );
  });
};

startServer();
