//#region External Imports
import { Container, Row } from "react-bootstrap"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Card } from "react-bootstrap";
//#endregion

//#region Internal Imports
import { Label } from "../../shared/resources"
import bannerImage from '../assets/OrganizerBanner.jpg';
///#endregion

export const BusinessOwnerDashboardComponent = () => {
    const [ username, setUsername ] = useState(sessionStorage.getItem('username') || '');


    const navigate = useNavigate();

    const goToPage = async (page) => {
        navigate(page); //go back to dashboard after submitting the form
    }



    return <>
        <Row style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '400px', position: 'relative', color: '#fecd00'}} >
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: "rgb(42, 32, 33, 0.75)", boxShadow: "4px 4px 6px", width: "50%"}} >
                <h1 style={{fontWeight: "bold"}}>{Label.setTitle(username)}</h1>
            </div>
        </Row>
        <Row className="d-flex justify-content-center align-items-center">   
            <Card bg="light" className='m-3' style={{ borderRadius: "0px", boxShadow: "0px 1px 4px #fecd00" }}>
                {/*Button to go to the business owner related pages*/}
                <Card.Body>
                    <Button className="m-3" onClick={() => goToPage('/listing')}>Create Business Listing</Button>
                    <Button className="m-3" onClick={() => goToPage('/viewlistings')}>View Business Listing</Button>              
                </Card.Body>
            </Card>
        </Row>      
    </>    
}
