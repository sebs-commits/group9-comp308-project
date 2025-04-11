//#region External Imports
import { Container, Row } from 'react-bootstrap';
//#endregion

//#region Internal Imports
import EventsCarouselComponent from '../shared/components/EventsCarousel';
import { Label } from '../shared/resources';
//#endregion

const HomeComponent = () => {   
    return <>
        <Container className="justify-content-center">

            {/**Title */}    
            <Row className="py-4"> <h3>{Label.WELCOME}</h3> </Row>        

            {/**Events Carousel */}
            <Row className='pd-2'> <h4>{Label.EVENTS}</h4> </Row>
            <Row> <EventsCarouselComponent/> </Row>

        </Container>
    </>
}

export default HomeComponent;