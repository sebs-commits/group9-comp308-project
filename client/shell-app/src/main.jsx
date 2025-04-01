import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { BrowserRouter } from 'react-router-dom';

const link = createHttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include'
});

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
