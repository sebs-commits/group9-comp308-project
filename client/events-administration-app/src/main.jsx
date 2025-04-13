import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';

const link4002 = createHttpLink({
  uri: 'http://localhost:4002/graphql',
  credentials: 'include',
});

const link4004 = createHttpLink({
  uri: 'http://localhost:4004/graphql',
  credentials: 'include',
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);

    if (kind === 'OperationDefinition' && operation === 'query') {
      return true;
    }
    return false;
  },
  link4002,
  link4004
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>
)