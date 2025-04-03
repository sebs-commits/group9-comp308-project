import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { buildFederatedSchema, buildSubgraphSchema } from "@apollo/federation";
import express from 'express';
import cors from 'cors';
import mongoose from '../../config/mongoose.js';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import { eventTypeDefs } from "./schemas/events-typedefs.js";
import { eventsResolvers } from "./resolvers/events.server.resolver.js";

const port = 4002;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: [`http://localhost:3000, http://localhost:3002`],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs: eventTypeDefs, resolvers: eventsResolvers }]),
    plugins: [ApolloServerPluginInlineTraceDisabled()], // Disable Apollo Tracing
    context: ({ req, res }) => ({ req, res })
})

server.start().then(() => {
    server.applyMiddleware({ app, cors: false });
    app.listen({ port }, () => {
        console.log(`🚀 Business-Events Server ready at http://localhost:${port}${server.graphqlPath}`);
    });
});