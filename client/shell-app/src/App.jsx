import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Suspense, lazy } from 'react';
import React from 'react';

import HomeComponent from './HomeComponent';

//#region Exposed Components
const CreateUpdateEvent = lazy(() => import('eventsAndAdministrationApp/CreateUpdateEvent'));
//#endregion

function App() {
  return (
    <Router>
        <div className='App'>
          <header className='App-header'>
            <Navbar className="navbar-custom" bg="secondary" variant="dark" expand="lg">
              <Container>
                <Navbar.Brand as={Link} to={"/home"}>Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/home">Home</Nav.Link>
                    <Nav.Link as={Link} to="/eventsAndAdmin">Events</Nav.Link>
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <div>
              <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route index element={<HomeComponent />} />
                  <Route path="home" element={<HomeComponent />} />
                  <Route path="eventsAndAdmin" element={<CreateUpdateEvent />} />
                </Routes>
              </Suspense>
            </div>
          </header>
        </div>
      </Router>
  )
}

export default App
