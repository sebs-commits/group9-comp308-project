//#region External Imports
import { Container, Row } from 'react-bootstrap';
//#endregion

//#region Internal Imports
import NewsCarouselComponent from '../shared/components/NewsCarousel';
import EventsCarouselComponent from '../shared/components/EventsCarousel';
//#endregion

const HomeComponent = () => {
    return <>
        <Container className="justify-content-center">

            {/**Title */}    
            <Row className="py-4"> <h3>Welcome!</h3> </Row>
            
            {/**News Carousel */}
            <Row className='pd-2'> <h4>News</h4> </Row>
            <Row> <NewsCarouselComponent/> </Row>

            {/**Events Carousel */}
            <Row className='pd-2'> <h4>Events</h4> </Row>
            <Row> <EventsCarouselComponent/> </Row>

        </Container>
    </>
}

export default HomeComponent;