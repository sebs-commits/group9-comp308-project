//#region External Imports
import { Container, Row, Col, Button } from 'react-bootstrap';
import { GrLinkNext } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';
//#endregion

//#region Internal Imports
import bannerImage from './assets/Banner.jpg';
import secondImage from './assets/home_second.jpg'
import EventsCarouselComponent from '../shared/components/EventsCarousel';
import { Label } from '../shared/resources';
//#endregion

const HomeComponent = () => {
    const navigate = useNavigate();
    return <>
        <Container>
            <Row style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '400px', position: 'relative', color: '#fecd00' }} >
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: "rgb(42, 32, 33, 0.75)", padding: "40px", boxShadow: "4px 4px 6px", width: "50%"}} >
                    <h1 style={{fontWeight: "bold"}}>{Label.NEIGHBORHOOD_WATCH}</h1>
                    <h3 style={{fontWeight: "bold"}}>{Label.MAIN_SUBTITLE}</h3>
                </div>
            </Row>

            {/**Events Carousel */}
            <Row style={{ backgroundColor: "white", height: "225px", color: "black" }}> 
                <h2 style={{ margin:"auto", padding: "auto", color: "black", marginBottom: "0px", fontFamily: "Roboto" }}>{Label.CONNECT_TODAY}</h2>
                <Button variant="outline-dark" style={{width: "auto", height: "40px", marginRight: "auto", marginLeft: "auto", marginTop: "20px", borderRadius: "0px" }} onClick={() => { navigate("/register") }}>
                    <GrLinkNext />
                    <span style={{paddingLeft: "5px", fontWeight: "bold", fontSize: "16px"}}>{Label.REGISTER_NOW}</span>
                </Button>
            </Row>

           
            <Row style={{ backgroundColor: "#2b2b2b", height: "auto", minHeight: "400px",}}>
                <Col md="6" style={{ marginBottom: "20px" }}>                                                                                        
                    <h3 style={{ paddingTop: "20px" }}>{Label.ABOUT_US}</h3>
                    <hr style={{ marginRight: "20px", marginLeft: "20px" }}/>
                    <p style={{
                         textAlign: "justify",
                         fontSize: "20px",
                         display: "flex",
                         justifyContent: "left",
                         alignItems: "center",
                         paddingLeft: "50px",
                         paddingRight: "40px",
                         textIndent: "2em"
                    }}>
                        {Label.ABOUT_US_TEXT}
                    </p>
                    
                </Col>

                <Col md="6" style={{ backgroundImage: `url(${secondImage})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}> </Col>
            </Row>

            <Row style={{backgroundColor: "#1f1f1f" }}> 
                <h5 style={{ textAlign: "left", fontFamily: "Roboto", paddingLeft: "20px", paddingTop: "20px", color: "white", fontSize: "16px"}}>{Label.UPCOMING_EVENT}</h5>
                <EventsCarouselComponent/> 
            </Row>            
        </Container>
            <div style={{ backgroundColor: "#6c757d", height: "50px" }}>
                <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>

            </div>
    </>
}

export default HomeComponent;