//#region External Imports
import { useContext } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaUndo } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
//#endregion

//#region Internal Imports
import { Label, Message } from "../resources";
import { EventContext } from "../../../events-administration-app/shared/contexts/event";
import image from "../../src/assets/Event.jpg"
//#endregion

const DisplaySelectedEventComponent = () => {
    const { eventToDisplay } = useContext(EventContext);
    const navigate = useNavigate();
      
    const getFormattedDate = (from, to) => ((from === to) ? from : `${from} - ${to}`)

    return (
        <>
            <Container style={{ height: "90vh" }}>
                {eventToDisplay ?
                    <Row className="d-flex justify-content-center">
                        <Col xs={12} sm={12} md={8} lg={8} xl={8} className='main-col' style={{ marginTop: "30px" }}>
                            <Card style={{ borderRadius: "1px", boxShadow: "1px 2px 4px black" }}>
                                <Card.Img variant="top" style={{ maxHeight: "300px" }} src={image}/>
                                <Card.Body>
                                    <Card.Title>{eventToDisplay.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">{eventToDisplay.summary}</Card.Subtitle>
                                    {/**Style - Copilot suggestion */}
                                    <Card.Text style={{ background: "linear-gradient(135deg, #fff, #f0f0f0)", padding: "15px",  borderRadius: "10px",  color: "#333", 
                                            boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.3)", textAlign: "left", transition: "transform 0.3s ease-in-out",
                                            fontFamily: "'Roboto', sans-serif" }} 
                                            className="py-3" onMouseOver={(e) => e.target.style.transform = "scale(1.02)"} onMouseOut={(e) => e.target.style.transform = "scale(1.0)"} >
                                        {eventToDisplay.description}<br/>
                                        <span className="event-subtitle" style={{ fontWeight: "bold" }}>{Label.TYPE}: </span> {eventToDisplay.type}<br/>
                                        <span className="event-subtitle" style={{ fontWeight: "bold" }}>{Label.EVENT_DATE}: </span>{getFormattedDate(eventToDisplay.from, eventToDisplay.to)}<br/>
                                        <span className="event-subtitle" style={{ fontWeight: "bold" }}>{Label.LOCATION}: </span>{eventToDisplay.location}<br/>
                                        <span className="event-subtitle" style={{ fontWeight: "bold" }}>{Label.PRICE}: </span>{eventToDisplay.price} $
                                    </Card.Text>

                                </Card.Body>
                            </Card>                                            
                        </Col>
                    </Row>                
                    :
                    <Row className="d-flex justify-content-center">
                        <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col' style={{ marginTop: "30px" }}>
                            <h3>{Message.NO_EVENT_TO_DISPLAY}</h3>
                        </Col>
                    </Row>
                }        
                <Row className="d-flex justify-content-center py-4">
                    <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col'>
                        <Button className='button' variant="secondary" onClick={() => { navigate(-1) }}>
                            <FaUndo />
                            <span style={{ paddingLeft: "5px"}}>{Label.BACK}</span>
                        </Button>
                    </Col>
                </Row>
            </Container>

            <div style={{ backgroundColor: "#6c757d", height: "50px" }}>
                <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>
            </div>
        </>
    )
}

export default DisplaySelectedEventComponent;