import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3002'], 
    credentials: true,
  }));

const gateway = new ApolloGateway({
    serviceList: [       
        { name: 'events', url: 'http://localhost:3001/graphql' }
    ],
});

const server = new ApolloServer({  gateway, subscriptions: false });

server.start().then(() => {
    server.applyMiddleware({ app, cors: false });

    app.listen({ port: 4000 }, () => 
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
});