import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import { CommunityOrganizerDashboardComponent, ResidentDashboardComponent, BusinessOwnerDashboardComponent} from './Dashboards';
import { Label } from '../shared/resources';

const Dashboard = () => {
    const [type, setType] = useState(sessionStorage.getItem('type') || '');

    return <> 
        <Container className="justify-content-start" style={{display: "flex", flexDirection: "column", minHeight: "91vh", padding: "0px"}}>
            <Row xs={12} sm={12} md={8} lg={8} xl={8} className="justify-content-start py-5">
                
                { type === 'organizer' && <CommunityOrganizerDashboardComponent/> }

                { type === 'resident' && <ResidentDashboardComponent/> }                
                
                { type === 'owner' && <BusinessOwnerDashboardComponent/> }
                                    
            </Row>
        </Container>
        
        <div style={{ backgroundColor: "#6c757d", height: "50px" }}>
             <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>
        </div>
    </>
}

export default Dashboard;