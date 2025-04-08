//#region External Imports
import { Container, Row } from "react-bootstrap"
import { useState } from "react";
//#endregion

//#region Internal Imports
// import NewsCarouselComponent from "../../shared/components/NewsCarousel"
import { Label } from "../../shared/resources"
///#endregion

export const BusinessOwnerDashboardComponent = () => {
    const [ username, setUsername ] = useState(sessionStorage.getItem('username') || '');

    return <>
        <Container className="justify-content-center">
            {/**Welcome */}
            <Row className="pb-4"> <h3>{Label.setTitle(username)}</h3> </Row>
            
            {/**Carousel News */}
            {/* <Row> <NewsCarouselComponent/> </Row> */}

        </Container>
    </>    
}
