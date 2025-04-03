import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloGateway } from '@apollo/gateway';
import cors from 'cors';

const app = express();

app.use(cors({
    origin: ['http://localhost:3000','http://localhost:3002', 'http://localhost:3004', 'http://localhost:3006'],
    credentials: true,
  }));

const gateway = new ApolloGateway({
    serviceList: [       
        { name: 'business-event', url: 'http://localhost:3001/graphql' },
        { name: 'auth', url: 'http://localhost:3003/graphql' },
        { name: 'community', url: 'http://localhost:3005/graphql' }
    ]
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.start().then(() => {
    server.applyMiddleware({ app, cors: false });

    app.listen({ port: 4000 }, () => 
        console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
});