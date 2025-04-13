import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { getMainDefinition } from "@apollo/client/utilities";
import { BrowserRouter } from 'react-router-dom';

// We need to combine two URIs here
const link4000 = createHttpLink({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
});

const link4001 = createHttpLink({
  uri: 'http://localhost:4001/graphql', // volunteer authentication
  credentials: 'include',
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    const opName = definition?.name?.value;

    if (definition.kind === 'OperationDefinition' && opName) { // Stops queries from being sent to 4001 instead of 4000
      return opName.startsWith("auth");
    }
    return false;
  },
  link4001,
  link4000
);


const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ApolloProvider client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
)
