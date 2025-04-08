//#region External Imports
import { Container, Row } from "react-bootstrap"
import { useState } from "react";
//#endregion

//#region Internal Imports
import { Label } from "../../shared/resources"
import { EventManagement } from "../App";
import EventsCarouselComponent from "../../shared/components/EventsCarousel";
//#endregion

export const CommunityOrganizerDashboardComponent = () => {
    const [ username, setUsername ] = useState(sessionStorage.getItem('username') || '');

    return <>
        <Container className="justify-content-center">
            {/**Welcome */}
            <Row className="pb-4"> <h3>{Label.setTitle(username)}</h3> </Row>        

            {/**Event Banner */}
            <EventsCarouselComponent/>
            
            {/**Event Management component */}
            <EventManagement/>

        </Container>
    </>    
}