//#region External Imports
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'; 
import { useMutation } from '@apollo/client';
import { Form, Button, Card, Row, Col, Container } from 'react-bootstrap';
import { GrLogin } from "react-icons/gr";
//#endregion

//#region Internal Imports
import { LOGIN_USER } from '../../shared/gql/authentication.gql';
import { Label, Message } from '../../shared/resources';
import CustomToast from '../../../shell-app/shared/components/CustomToast';
//#endregion

const LoginComponent = () => {
    const navigate = useNavigate();
    
    //#region States
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [ token, setToken ] = useState(sessionStorage.getItem("token") || 'auth');
    
    const [message, setMessage] = useState("");
    const [header, setHeader] = useState("");
    const [bg, setBg] = useState("");        
    const [showA, setShowA] = useState(false);
    //#endregion

    //#region GQL
    const [ loginUser ] = useMutation(LOGIN_USER)
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

    const authenticateUser = async () => {
        try {
            const res = await loginUser({ variables: { username, password } });             
            sessionStorage.setItem("token", res?.data?.loginUser[0]);
            sessionStorage.setItem("uid", res?.data?.loginUser[1]);
            sessionStorage.setItem("username", res?.data?.loginUser[2]);
            sessionStorage.setItem("type", res?.data.loginUser[3]);
            setToken(sessionStorage.getItem("token"));
            navigate("/dashboard")
            window.postMessage({ type: 'LOGIN_IN' }, '*');
        } catch(error) {
            console.error(`An error occurred while authenticating the user: `, error);
            displayToastMsg(Label.ERROR, Message.INVLID_USERNAME_OR_PASSWORD, "danger");
            throw error;
        }
    }    

    useEffect(() => {
        window.addEventListener('message', (event) => {
            if (event.data.type === 'SESSION_CLEARED') {            
              setToken(sessionStorage.getItem("token"));
            }
          });
     }, [])

    return (
        <> 
            <div style={{display: "flex", flexDirection: "column", minHeight: "91vh"}}>
                <div style={{ flex: "1" }}>                
                    {
                    token === "auth" && 
                    <>
                    <Container>
                        <Row className="justify-content-center">
                            <Col xs={12} sm={12} md={6} lg={4} xl={4} className="justify-content-center py-5">
                                <Card bg="light" style={{ borderRadius: "0px", boxShadow: "0px 1px 4px #fecd00" }}>
                                    <Card.Body>
                                    <div className='text-center' style={{position: "relative", zIndex: 0}}>
                                        <h2 className='justify-content-center text-center pt-4' style={{color:"black"}}>{Label.LOGIN}</h2>
                                        <div>
                                            <Form className='pt-4 mt-2 mb-2 mr-2 ml-2 rounded d-flex flex-column align-items-center' style={{zIndex: 1 }}>
                                                <Form.Group size="lg" className='py-3'>
                                                    <Form.Control 
                                                        className='w-100'
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        placeholder={Label.USERNAME}
                                                        onChange={(e) => setUsername(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Form.Group size="lg" className='py-3'>
                                                    <Form.Control 
                                                        className='w-100'
                                                        type="password"
                                                        name="password"
                                                        id="password"
                                                        placeholder={Label.PASSWORD}
                                                        onChange={e => setPassword(e.target.value)}
                                                    />
                                                </Form.Group>
                                                <Button className="login-button mt-4 mb-4 button" size="lg" variant="success" type="Button" onClick={authenticateUser}>
                                                    <GrLogin />
                                                    <span style={{ paddingLeft: "5px" }}>{Label.LOGIN}</span>
                                                </Button>
                                            </Form>
                                        </div>
                                    </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>      
                    
                    <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}/>                    
                    </>            
                }     
            </div>
        </div>   
        
        <div style={{ backgroundColor: "#6c757d", height: "50px"}}>
            <p style={{fontWeight: "bold", fontSize:"12px", color: "#fecd00", paddingTop: "20px"}}>&copy; {Label.COPYRIGHT}</p>
        </div>              
        </>
    )
}

export default LoginComponent;