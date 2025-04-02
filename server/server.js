import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway, IntrospectAndCompose } from '@apollo/gateway';
import cors from 'cors';

const app = express();

app.use(cors({
  //origin: '*', //for sandbox use.
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:3004', 'http://localhost:3006'],
  credentials: true,
}));

const serviceUrls = [
  { name: 'business-events-microservice', url: 'http://localhost:3001/graphql' },
  { name: 'user-auth-microservice', url: 'http://localhost:3003/graphql' },
  { name: 'community-eng-microservice', url: 'http://localhost:3005/graphql' }
];

const supergraphSdl = new IntrospectAndCompose({ subgraphs: serviceUrls });

const gateway = new ApolloGateway({ supergraphSdl });

const server = new ApolloServer({ gateway, subscriptions: false });

server.start().then(() => {
  server.applyMiddleware({ app, cors: false });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
