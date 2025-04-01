//#region External Imports
import { Container, Row, Button } from "react-bootstrap"
import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
//#endregion

//#region Internal Imports
import NewsCarouselComponent from "../../shared/components/NewsCarousel"
import { Label } from "../../shared/resources"
//#endregion

export const CommunityOrganizerDashboardComponent = () => {
    const navigate = useNavigate();
    const [ username, setUsername ] = useState(sessionStorage.getItem('username') || '');

    return <>
        <Container className="justify-content-center">
            {/**Welcome */}
            <Row className="pb-4"> <h3>{Label.setTitle(username)}</h3> </Row>
            
            {/**Carousel News */}
            <Row> <NewsCarouselComponent/> </Row>
            
            {/**Add Event Button */}
            <Row className="justify-content-center">
                <Button className='button' variant="success" onClick={() => { navigate("/event"); }}>
                        <FaPlusCircle />
                        <span style={{ paddingLeft: "5px"}} >{Label.EVENTS}</span>
                </Button>
            </Row>
        </Container>
    </>    
}