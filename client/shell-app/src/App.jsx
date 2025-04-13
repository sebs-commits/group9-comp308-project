import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

//#region External Imports
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Modal, Button } from "react-bootstrap";
import { Suspense, lazy, useEffect, useState, React } from "react";
import { useMutation } from "@apollo/client";
import io from "socket.io-client";
//#endregion

//#region Internal Imports
import HomeComponent from "./HomeComponent";
import { LOGOUT } from "../../authentication-app/shared/gql/authentication.gql";
import { Label } from "../shared/resources";
import Dashboard from "./Dashboard";
import DisplaySelectedEventComponent from "../shared/components/DisplaySelectedEvent";
import { EventProvider } from "../../events-administration-app/shared/contexts/event";
//#endregion

//#region Exposed Components
export const EventManagement = lazy(() =>
  import("eventsAndAdministrationApp/EventManagement")
);
const RegisterComponent = lazy(() =>
  import("authenticationApp/RegisterComponent"));
const LoginComponent = lazy(() => import("authenticationApp/LoginComponent"));
const CreateNews = lazy(() => import("communityBusinessApp/CreateNews"));
const CreateUpdateRequests = lazy(() =>import("communityBusinessApp/CreateUpdateRequests"));
const CreateUpdateAlerts = lazy(() =>import("communityBusinessApp/CreateUpdateAlerts"));
const CreateUpdateBusinessListing = lazy(() =>import("communityBusinessApp/CreateUpdateBusinessListing"));
const ViewBusinessListing = lazy(() =>import("communityBusinessApp/ViewBusinessListings"));
const NewsPage = lazy(() => import("communityBusinessApp/NewsPage"));

const UpdateVolunteerComponent = lazy(() => import('authenticationApp/UpdateVolunteerComponent'));
const GeneralDiscussions = lazy(() => import("communityBusinessApp/GeneralDiscussions"));
//#endregion

function App() {
  const navigate = useNavigate();

  //#region States
  const [token, setToken] = useState(sessionStorage.getItem("token") || "auth");
  const [type, setType] = useState(sessionStorage.getItem("type") || "");
  const [alert, setAlert] = useState(null);
  const [show, setShow] = useState(false);
  //#endregion

  const [logout] = useMutation(LOGOUT);

  const handleLogout = async () => {
    try {
      await logout();
      sessionStorage.clear();
      sessionStorage.setItem("token", "auth");
      setToken(sessionStorage.getItem("token"));
      setType(sessionStorage.getItem("type"));
      window.postMessage({ type: "SESSION_CLEARED" }, "*");
      navigate("/login");
    } catch (error) {
      console.log(`An error occurred while loging out: `, error);
      throw error;
    }
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "LOGIN_IN") {
        setToken(sessionStorage.getItem("token"));
        setType(sessionStorage.getItem("type"));
      }
    });
  }, []);

  //Alert polling
  useEffect(() => {
    const socket = io("http://localhost:4003", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server with ID:", socket.id);
    });

    socket.on("alert", (data) => {
      setAlert(data[0]);
      setShow(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
      console.log("Cleaned up WebSocket connection");
    };
  }, []);

  const handleClose = () => setShow(false);

  return (
    <div>
      <header>
        <Navbar bg="secondary" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/home">
              {Label.HOME}
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link as={Link} to="/home">
                  {Label.HOME}
                </Nav.Link>
                {token === "auth" && (
                  <Nav.Link as={Link} to="/register">
                    {Label.REGISTER}
                  </Nav.Link>
                )}
                {token !== "auth" && (
                  <Nav.Link as={Link} to="/dashboard">
                    {Label.DASHBOARD}
                  </Nav.Link>
                )}
                
                <Nav.Link as={Link} to="/viewlistings">
                  {Label.VIEW_LISTINGS}
                </Nav.Link>

                {token !== "auth" ? (
                  <Nav.Link
                    as={Link}
                    onClick={async () => await handleLogout()}
                  >
                    {Label.LOGOUT}
                  </Nav.Link>
                ) : (
                  <Nav.Link as={Link} to="/login">
                    {Label.LOGIN}
                  </Nav.Link>
                )}

                {type === 'resident' && (
                  <Nav.Link as={Link} to="/volunteer">
                    {Label.VOLUNTEER}
                  </Nav.Link>
                )}

                {type === "owner" && (
                  <Nav.Link as={Link} to="/listing">
                    {Label.CREATE_LISTING}
                  </Nav.Link>
                )}
                {token !== 'auth' && type === 'resident' && (
                  <Nav.Link as={Link} to="/discussions">
                    Discussions
                  </Nav.Link>
                )}
                
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
              <Route
                path="displayevent/:id"
                element={
                  <EventProvider>
                    <DisplaySelectedEventComponent />
                  </EventProvider>
                }
              />
              <Route path="/viewlistings" element={<ViewBusinessListing />} />
              <Route path="/news/:id" element={<NewsPage />} />

                    {/**Protected Routes */}
                    {token !== 'auth' && <Route path="event" element={<EventManagement /> }/>}
                    {token === 'auth' && <Route path="register" element={<RegisterComponent />} />}
                    {token !== 'auth' && <Route path="dashboard" element= { <Dashboard /> } />}
                    {token === 'auth' && <Route path="login" element={<LoginComponent />} />}
                    {token !== 'auth' && <Route path="news" element={<CreateNews />}/>}
                    {token !== 'auth' && <Route path="requests" element={<CreateUpdateRequests />}/>}
                    {token !== 'auth' && <Route path="alerts" element={<CreateUpdateAlerts />}/>}
                    {token === 'auth' && <Route path="*" element={<HomeComponent />} />}
                    {token !== 'auth' && <Route path="/listing" element={<CreateUpdateBusinessListing />} />}
                    {token !== "auth" && <Route path="discussions" element={<GeneralDiscussions />} />}

      
              {token !== 'auth' && (
                <Route 
                  path="/volunteer" 
                  element={<UpdateVolunteerComponent />} 
                />
              )}
            </Routes>
                </Suspense>
            </div>
          </header>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{alert?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{alert?.subtitle}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            {Label.CLOSE}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default App;
