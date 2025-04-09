import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

//#region External Imports
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Suspense, lazy, useEffect, useState } from 'react';
import React from 'react';
import { useMutation } from "@apollo/client"
//#endregion

//#region Internal Imports
import HomeComponent from './HomeComponent';
import { LOGOUT } from '../../authentication-app/shared/gql/authentication.gql';
import { Label } from '../shared/resources';
import Dashboard from './Dashboard';
import DisplaySelectedEventComponent from '../shared/components/DisplaySelectedEvent';
import { EventProvider } from '../../events-administration-app/shared/contexts/event';
//#endregion

//#region Exposed Components
export const EventManagement = lazy(() => import('eventsAndAdministrationApp/EventManagement'));
const RegisterComponent = lazy(() => import('authenticationApp/RegisterComponent'));
const LoginComponent = lazy(() => import('authenticationApp/LoginComponent'));
const CreateUpdateNews = lazy(() => import('communityBusinessApp/CreateUpdateNews'));
const CreateUpdateRequests = lazy(() => import('communityBusinessApp/CreateUpdateRequests'))
const CreateUpdateAlerts = lazy(() => import('communityBusinessApp/CreateUpdateAlerts'))
const CreateUpdateBusinessListing = lazy(() => import('communityBusinessApp/CreateUpdateBusinessListing'))
//#endregion

function App() {
  const navigate = useNavigate();

  //#region States
  const [token, setToken] = useState(sessionStorage.getItem("token") || 'auth');
  const [type, setType] = useState(sessionStorage.getItem("type") || '');
  //#endregion
  
  const [logout] = useMutation(LOGOUT);
  
  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.clear()
      sessionStorage.setItem("token", "auth")
      setToken(sessionStorage.getItem("token"));
      setType(sessionStorage.getItem("type"));
      window.postMessage({ type: 'SESSION_CLEARED' }, '*');  
      navigate("/login")    
    } catch(error) {
      console.log(`An error occurred while loging out: `, error);
      throw error;
    }
  }

  useEffect(() => {
    window.addEventListener('message', (event) => {
        if (event.data.type === 'LOGIN_IN') {
          setToken(sessionStorage.getItem("token"));
          setType(sessionStorage.getItem("type"));
        }
    });
  }, [])

  return (
    
        <div>
          <header>
            <Navbar bg="secondary" variant="dark" expand="lg">
              <Container>
                <Navbar.Brand as={Link} to="/home">{Label.HOME}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                  <Nav className="mr-auto">
                    <Nav.Link as={Link} to="/home">{Label.HOME}</Nav.Link>                    
                    {token === 'auth' && <Nav.Link as={Link} to="/register">{Label.REGISTER}</Nav.Link>}
                    {token !== 'auth' && <Nav.Link as={Link} to="/dashboard">{Label.DASHBOARD}</Nav.Link>}
                    {token !== 'auth' ? <Nav.Link as={Link} onClick={async () => await handleLogout()}>{Label.LOGOUT}</Nav.Link> : <Nav.Link as={Link} to="/login">{Label.LOGIN}</Nav.Link> }     
                    {type === 'owner' && <Nav.Link as={Link} to="/listing">{Label.LISTING}</Nav.Link>}              
                  </Nav>
                </Navbar.Collapse>
              </Container>
            </Navbar>

            <div>
                <Suspense fallback={<div>{Label.LOADING}</div>}>
                  <Routes>
                    {/**Unprotected Routes */}
                    <Route index element={<HomeComponent />} />
                    <Route path="home" element={<HomeComponent />} />                  
                    <Route path="displayevent/:id" element={<EventProvider><DisplaySelectedEventComponent /></EventProvider> } /> 

                    {/**Protected Routes */}
                    {token !== 'auth' && <Route path="event" element={<EventManagement /> }/>}
                    {token === 'auth' && <Route path="register" element={<RegisterComponent />} />}
                    {token !== 'auth' && <Route path="dashboard" element= { <Dashboard /> } />}
                    {token === 'auth' && <Route path="login" element={<LoginComponent />} />}
                    {token !== 'auth' && <Route path="news" element={<CreateUpdateNews />}/>}
                    {token !== 'auth' && <Route path="requests" element={<CreateUpdateRequests />}/>}
                    {token !== 'auth' && <Route path="alerts" element={<CreateUpdateAlerts />}/>}
                    {token === 'auth' && <Route path="*" element={<HomeComponent />} />}
                    {token !== 'auth' && <Route path="/listing" element={<CreateUpdateBusinessListing />} />}

                    
                  </Routes>
                </Suspense>
            </div>
          </header>
        </div>      
  )
}

export default App
