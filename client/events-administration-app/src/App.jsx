import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import React from 'react';
import EventMagagement from './components/EventManagement';

function App() {
  return (
    <Router>
          <header>
            <Navbar bg="secondary" variant="dark" expand="lg">
              <Container fluid>
                <Navbar.Brand as={Link} to={"/events"}>Events</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/events">Events</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <Routes>
                  <Route index element={<EventMagagement />} />
                  <Route path="events" element={<EventMagagement />} />
            </Routes>
          </header>
      </Router>
  )
}

export default App
