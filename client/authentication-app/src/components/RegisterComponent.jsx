//#region External Imports
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaPaperPlane } from "react-icons/fa";
//#endregion

//#region Internal Imports
import { useMutation } from '@apollo/client';
import { Label, Message } from '../../shared/resources';
import { CREATE_USER } from '../../shared/gql/authentication.gql';
import CustomToast from '../../../shell-app/shared/components/CustomToast';
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
    //#endregion


    /**
     * 
        TODO: Missing validation.
                1. Unique username
                2. Email (Regex)
     */
    const handleSubmit = async (event) => {
          event.preventDefault();
          const form = event.currentTarget;
    
          if (form.checkValidity() === false) {
            displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
            event.stopPropagation();
            return;
          }
    
          try {
            await createUser({ variables: { username, email, type, password } });
            displayToastMsg(Label.SUCCESS, Message.USER_SAVED_SUCCESSFULLY, "success");
            
            setUsername('');
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
        <div className="px-5 pb-4">
            <h4 className="pt-4 pb-2">{Label.formUserTitle(true ? Label.CREATE : Label.UPDATE)}</h4>
            <Form noValidate onSubmit={handleSubmit}>
                <Row>
                    {/**Username */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="username">
                        <Form.Label>{Label.USERNAME}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.USERNAME}
                                      value={username}
                                      onChange={(e) => setUsername(e.target.value)}/>
                    </Form.Group>

                    {/**Email */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="email">
                        <Form.Label>{Label.EMAIL}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.EMAIL}
                                      value={email}
                                      onChange={(e) => setEmail(e.target.value)}/>
                    </Form.Group>                     

                    {/**Type */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="type">
                        <Form.Label>{Label.TYPE}</Form.Label>
                        <Form.Select required onChange={(e) => setType(e.target.value)} value={type}>
                            <option value={USER_TYPE.RESIDENT}>{Label.RESIDENT}</option>
                            <option value={USER_TYPE.OWNER}>{Label.OWNER}</option>
                            <option value={USER_TYPE.ORGANIZER}>{Label.ORGANIZER}</option>
                        </Form.Select>
                    </Form.Group>

                    {/**Password */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="password">
                        <Form.Label>{Label.PASSWORD}</Form.Label>
                        <Form.Control required
                                      type="password"
                                      placeholder={Label.PASSWORD}
                                      value={password}
                                      onChange={(e) => setPassword(e.target.value)}/>
                    </Form.Group>                              
                </Row>
               
                <Button type="submit" variant="success" className="button my-2">
                    <FaPaperPlane />
                    <span style={{paddingLeft: "5px"}}>{Label.SUBMIT} </span>
                </Button>
            </Form>

            <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}/>
        </div>        
    </>
}

export default RegisterComponent;