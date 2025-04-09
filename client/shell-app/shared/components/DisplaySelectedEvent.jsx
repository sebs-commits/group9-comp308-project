//#region External Imports
import { useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaUndo } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
//#endregion

//#region Internal Imports
import { Label, Message } from "../resources";
import { EventContext } from "../../../events-administration-app/shared/contexts/event";
//#endregion

const DisplaySelectedEventComponent = () => {
    const { eventToDisplay } = useContext(EventContext);
    const navigate = useNavigate();
      
    const getFormattedDate = (from, to) => ((from === to) ? from : `${from} - ${to}`)

    return (
        <Container>
            {eventToDisplay ?
                <Row className="d-flex justify-content-center">
                    <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col' style={{ marginTop: "30px" }}>
                        <h3>{eventToDisplay.title}</h3>
                        <p style={{fontStyle: "italic", color: "gray"}}>{eventToDisplay.summary}</p>
                        <p>{eventToDisplay.description}</p>
                        <p><span className="event-subtitle">{Label.TYPE}: </span> {eventToDisplay.type}</p>
                        <p><span className="event-subtitle">{Label.EVENT_DATE}: </span>{getFormattedDate(eventToDisplay.from, eventToDisplay.to)} </p>
                        <p><span className="event-subtitle">{Label.LOCATION}: </span>{eventToDisplay.location}</p>
                        <p><span className="event-subtitle">{Label.PRICE}: </span>{eventToDisplay.price} $</p>
                        
                    </Col>
                </Row>                
                :
                <Row className="d-flex justify-content-center">
                    <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col' style={{ marginTop: "30px" }}>
                        <h3>{Message.NO_EVENT_TO_DISPLAY}</h3>
                    </Col>
                </Row>
            }        
            <Row className="d-flex justify-content-center py-2">
                <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col'>
                    <Button className='button' variant="secondary" onClick={() => { navigate(-1) }}>
                        <FaUndo />
                        <span style={{ paddingLeft: "5px"}}>{Label.BACK}</span>
                    </Button>
                </Col>
            </Row>
        </Container>
    )
}

export default DisplaySelectedEventComponent;