import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import React from 'react';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';

function App() {

  return (
    <Router>
    <div>
      <header>
        <Navbar bg="secondary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to={"/home"}>Home</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/home">Home</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <div>
        <Routes>
              <Route index element={<RegisterComponent />} />
              <Route path="register" element={<RegisterComponent />} />
              <Route path="login" element={<LoginComponent />} />
            </Routes>
        </div>
      </header>
    </div>
  </Router>
  )
}

export default App
