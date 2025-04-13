//#region External Imports
import { Container, Row, Col } from 'react-bootstrap';
//#endregion

//#region Internal Imports
import CreateUpdateEvent from './CreateUpdateEvent';
import DisplayEvents from './DisplayEvents';
import { EventsProvider } from '../../shared/contexts/events';
import EventsCarouselComponent from '../../../shell-app/shared/components/EventsCarousel';
//#endregion

const EventMagagement = () => {
    return (
        <>
            <EventsProvider>
                <Container style={{backgroundColor: "white", minHeight: "95vh"}}>
                    <Row className="d-flex justify-content-center py-5" style={{ backgroundColor: "#2b2b2b" }}>
                        <EventsCarouselComponent/>
                    </Row>
                    <Row className="d-flex justify-content-center py-3" style={{ background: 'linear-gradient(to left,#ffffff 52%, #1f1f1f 48%)'}}>
                        {/**Display the create/update component */}
                        <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col' style={{ marginTop: "30px" }}>
                            <CreateUpdateEvent />
                        </Col>

                        {/**Display the list TODO: Adjust for small screens*/}
                        <Col xs={12} sm={12} md={6} lg={5} xl={5} className='main-col' style={{ marginTop: "30px" }}>
                            <DisplayEvents />
                        </Col>
                    </Row>          
                </Container>                                
            </EventsProvider>              
        </>
  )
}

export default EventMagagement;