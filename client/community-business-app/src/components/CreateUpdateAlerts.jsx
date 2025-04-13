//#region External Imports
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button, Col, Form, Row, Container, Card } from 'react-bootstrap';
import { FaUndo, FaPaperPlane } from "react-icons/fa";
import { useMutation } from '@apollo/client';
//#endregion

//#region Internal Imports
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import { Label, Message } from '../../shared/resources';
import { CREATE_ALERT } from '../../shared/gql/alert.gql';
//#endregion

const CreateUpdateAlertComponent = () => {
    const navigate = useNavigate();

    //#region States
    const [creatorId, setCreatorId] = useState(sessionStorage.getItem("uid") || 'id');
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');    

    const [message, setMessage] = useState("");
    const [header, setHeader] = useState("");
    const [bg, setBg] = useState("");        
    const [showA, setShowA] = useState(false);
    //#endregion
    
    //#region CustomToast Related
    const toggleShowA = () => setShowA(!showA);
    const displayToastMsg = (header, message, bg) => {
        toggleShowA();
        setHeader(header);
        setMessage(message);
        setBg(bg);
    }
    //#endregion

    //#region GQL
    const [createAlert] = useMutation(CREATE_ALERT);
    //#endregion

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget; 
                                        
        if (form.checkValidity() === false) {                
            displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
            event.stopPropagation();
            return;
        }

        try {
            const createdAt = new Date();
            await createAlert({ variables: { creatorId, title, subtitle, createdAt } })    
            displayToastMsg(Label.SUCCESS, Message.ALERT_SAVED_SUCCESSFULLY, "success");

            setTitle('');
            setSubtitle('');

        } catch(error) {
            displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
            console.error(`An error occurred while creating or updating an alert: `, error);
            throw error;
        }
    };       

return <>
    <Container className="justify-content-start" style={{display: "flex", flexDirection: "column", minHeight: "91vh", padding: "0px"}}>
        <Row className="justify-content-center">
            <Col xs={12} sm={12} md={6} lg={4} xl={4} className="justify-content-center py-5">
                <div className="pb-4">
                    <Card bg="light" style={{ borderRadius: "0px", boxShadow: "0px 1px 4px #fecd00" }}>
                        <Card.Body>
                            <h4 className="pt-4 pb-2">{Label.setAlertTitle(true ? Label.CREATE : Label.UPDATE)}</h4>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row>
                                    {/**Title */}
                                    <Form.Group className="py-2" as={Col} controlId="title">                        
                                        <Form.Control required
                                                    type="text"
                                                    placeholder={Label.TITLE}
                                                    value={title}
                                                    onChange={(e) => setTitle(e.target.value)}/>
                                    </Form.Group>
                                </Row>

                                <Row>
                                    {/**Subtitle */}
                                    <Form.Group className="py-2" as={Col}  controlId="subtitle">
                                        <Form.Control required
                                                    type="text"
                                                    placeholder={Label.SUBTITLE}
                                                    value={subtitle}
                                                    onChange={(e) => setSubtitle(e.target.value)}/>
                                    </Form.Group>                
                                </Row>
                            
                                <Button variant="secondary" className="button mx-2 my-2" onClick={() => { navigate("/dashboard"); }}>
                                    <FaUndo />
                                    <span style={{paddingLeft: "5px"}} >{Label.BACK}</span>                    
                                </Button>

                                <Button type="submit" variant="success" className="button mx-2 my-2">
                                    <FaPaperPlane />
                                    <span style={{paddingLeft: "5px"}}>{Label.SUBMIT} </span>
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}></CustomToast>
                </div>  
            </Col>
        </Row>
    </Container>

    <div style={{ backgroundColor: "#6c757d", height: "50px" }}>
        <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>
    </div>
</>
}

export default CreateUpdateAlertComponent;