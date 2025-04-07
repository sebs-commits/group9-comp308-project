import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import React from 'react';
import CreateUpdateRequestComponent from './components/CreateUpdateRequests';
import CreateUpdateAlertComponent from './components/CreateUpdateAlerts';

function App() {
  return (
    <Router>
        <div>
          <header>
            <Navbar bg="secondary" variant="dark" expand="lg">
              <Container>
                <Navbar.Brand as={Link} to={"/news"}>News</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/news">News</Nav.Link>
                    <Nav.Link as={Link} to="/requests">Requests</Nav.Link>
                    <Nav.Link as={Link} to="/alerts">Alerts</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <div>
            <Routes>
                  <Route index element={<CreateUpdateRequestComponent />} />
                  <Route path="requests" element={<CreateUpdateRequestComponent/>}/>
                  <Route path="alerts" element={<CreateUpdateAlertComponent/>}/>
                </Routes>
            </div>
          </header>
        </div>
      </Router>
  )
}

export default App
