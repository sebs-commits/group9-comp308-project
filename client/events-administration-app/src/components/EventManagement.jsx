//#region External Imports
import { Container, Row, Col } from 'react-bootstrap';
//#endregion

//#region Internal Imports
import CreateUpdateEvent from './CreateUpdateEvent';
import DisplayEvents from './DisplayEvents';
import { EventProvider } from '../../shared/contexts/events';
//#endregion

const EventMagagement = () => {
    return (
        <EventProvider>
            <Container fluid>
                <Row className="d-flex justify-content-center">
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
        </EventProvider>
  )
}

export default EventMagagement;