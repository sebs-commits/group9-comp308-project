import { ApolloServer } from "apollo-server-express";
import { buildSubgraphSchema } from "@apollo/federation";
import express from 'express';
import cors from 'cors';
import mongoose from '../config/mongoose.js';
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import { combinedTypeDefs } from "./schemas/combined-typedefs.js"
import { combinedResolvers } from "./resolvers/combined.resolver.js"

const port = 3005;
process.env.NODE_ENV = process.env.NODE_ENV || "development";
console.log(`Running in ${process.env.NODE_ENV} mode`);

mongoose();

const app = express();
app.use(cookieParser());

app.use(cors({
    origin: [`http://localhost:3000, http://localhost:3006`],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const server = new ApolloServer({
    schema: buildSubgraphSchema([{
            typeDefs: combinedTypeDefs,
            resolvers: combinedResolvers
        }]),
    context: ({ req, res }) => ({ req, res })
})

app.listen(port, async () => {
    await server.start();
    server.applyMiddleware({ app });

    console.log(`Events microservice ready at http://localhost:${port}${server.graphqlPath}`);
});