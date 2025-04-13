//#region External Imports
import { Row } from "react-bootstrap"
import { useState } from "react";
//#endregion

//#region Internal Imports
import { Label } from "../../shared/resources"
import { EventManagement } from "../App";
import bannerImage from '../assets/OrganizerBanner.jpg';
//#endregion

export const CommunityOrganizerDashboardComponent = () => {
    const [ username, setUsername ] = useState(sessionStorage.getItem('username') || '');

    return <>        
        {/**Welcome */}
        <Row style={{ backgroundImage: `url(${bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '400px', position: 'relative', color: '#fecd00'}} >
            <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: "rgb(42, 32, 33, 0.75)", boxShadow: "4px 4px 6px", width: "50%"}} >
                <h1 style={{fontWeight: "bold"}}>{Label.setTitle(username)}</h1>
            </div>
        </Row>            
        
        {/**Event Management component */}
        <EventManagement/>        
    </>    
}