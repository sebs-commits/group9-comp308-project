//#region External Imports
import { useState } from 'react';
import {Button, Col, Form, Row, Card, Container} from 'react-bootstrap';
import { FaPaperPlane } from "react-icons/fa";
//#endregion

//#region Internal Imports
import { useMutation, useQuery } from '@apollo/client';
import { Label, Message } from '../../shared/resources';
import { CREATE_USER, GET_USER_BY_USERNAME } from '../../shared/gql/authentication.gql';
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import bannerImage from "../assets/RegisterBanner.jpg"//Do not remove
//#endregion

//Matches the backend type list
const USER_TYPE = {
    RESIDENT: "resident",
    OWNER: "owner",
    ORGANIZER: "organizer"
}

const RegisterComponent = () => {
    //#region States
    const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ type, setType ] = useState(USER_TYPE.RESIDENT);
    const [ password, setPassword ] = useState('');

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
    const [ createUser ] = useMutation(CREATE_USER);
    const { refetch: fecthingUserByUsername } = useQuery(GET_USER_BY_USERNAME, {
        variables: { username }
    });
    //#endregion

    const handleSubmit = async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
    
          if (form.checkValidity() === false) {
            displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
            event.stopPropagation();
            return;
          }

          const checkUser = await fecthingUserByUsername();          
          if(checkUser?.data?.getUserByUsername) {
            displayToastMsg(Label.ERROR, Message.USERNAME_ALREADY_EXISTS, "danger");            
            return;
          }
    
          try {
            await createUser({ variables: { username, email, type, password } });
            displayToastMsg(Label.SUCCESS, Message.USER_SAVED_SUCCESSFULLY, "success");
                        
            setEmail('');
            setType(USER_TYPE.RESIDENT);
            setPassword('');

          } catch(error) {
            displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
            console.error(`An error occurred while creating or updating an event: `, error);
            throw error;
          }    
        };     

    return <>        
        <Container style={{display: "flex", flexDirection: "column", minHeight: "91vh", backgroundColor: "white", padding: "0px"}}>
            <div  style={{ backgroundImage: `url(http://localhost:3001/assets/RegisterBanner.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center', height: '400px', position: 'relative', color: '#fecd00', width: "100%", marginBottom: "50px" }}>
                <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', backgroundColor: "rgb(42, 32, 33, 0.75)", padding: "40px", boxShadow: "4px 4px 6px", width: "40%"}} >
                    <h1 style={{fontWeight: "bold"}}>{Label.REGISTER}</h1>
                    <h3 style={{fontWeight: "bold"}}>{Label.JOIN_US_TODAY}</h3>
                </div>
            </div>

            <Card style={{boxShadow: "0px 4px 4px gray", marginRight: "auto", margin: "auto", padding: "auto", marginTop: "20px"}}>
                <Card.Body>
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row>
                                {/**Username */}
                                <Form.Group className="py-3" as={Col} md={{ span: 6, offset: 3 }} controlId="username">
                                    <Form.Control required
                                                type="text"
                                                placeholder={Label.USERNAME}
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}/>
                                </Form.Group>

                                {/**Email */}
                                <Form.Group className="py-4" as={Col} md={{ span: 6, offset: 3 }} controlId="email">
                                    <Form.Control required
                                                type="text"
                                                placeholder={Label.EMAIL}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}/>
                                </Form.Group>                     

                                {/**Type */}
                                <Form.Group className="py-4" as={Col} md={{ span: 6, offset: 3 }} controlId="type">
                                    <Form.Select required onChange={(e) => setType(e.target.value)} value={type}>
                                        <option value={USER_TYPE.RESIDENT}>{Label.RESIDENT}</option>
                                        <option value={USER_TYPE.OWNER}>{Label.OWNER}</option>
                                        <option value={USER_TYPE.ORGANIZER}>{Label.ORGANIZER}</option>
                                    </Form.Select>
                                </Form.Group>

                                {/**Password */}
                                <Form.Group className="py-4" as={Col} md={{ span: 6, offset: 3 }} controlId="password">
                                    <Form.Control required
                                                type="password"
                                                placeholder={Label.PASSWORD}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}/>
                                </Form.Group>                              
                            </Row>
                        
                            <Button type="submit" size="large" variant="success" className="button my-4">
                                <FaPaperPlane />
                                <span style={{paddingLeft: "5px", fontWeight: "bold"}}>{Label.SUBMIT} </span>
                            </Button>
                        </Form>
                </Card.Body>
            </Card>

            <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}/>
        </Container>    

        <div style={{ backgroundColor: "#6c757d", height: "50px", marginTop: "auto" }}>
            <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>
        </div>    
    </>
}

export default RegisterComponent;