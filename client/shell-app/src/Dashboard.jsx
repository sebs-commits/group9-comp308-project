import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import { CommunityOrganizerDashboardComponent, ResidentDashboardComponent, BusinessOwnerDashboardComponent} from './Dashboards';

const Dashboard = () => {
    const [type, setType] = useState(sessionStorage.getItem('type') || '');

    return <> 
        <Container className="py-5 justify-content-center">
            <Row xs={12} sm={12} md={8} lg={8} xl={8} className="justify-content-center">
                
                { type === 'organizer' && <CommunityOrganizerDashboardComponent/> }

                { type === 'resident' && <ResidentDashboardComponent/> }                
                
                { type === 'owner' && <BusinessOwnerDashboardComponent/> }
                                    
            </Row>
        </Container>
    </>
}

export default Dashboard;