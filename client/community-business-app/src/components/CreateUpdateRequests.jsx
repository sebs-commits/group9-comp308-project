import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaUndo, FaPaperPlane } from "react-icons/fa";
import { useMutation } from '@apollo/client';
import { CREATE_REQUEST } from '../../shared/gql/request.gql';
import { Label, Message } from '../../shared/resources';
import CustomToast from '../../../shell-app/shared/components/CustomToast';

//Matches the backend type list
const REQUEST_TYPE = {
    HELP: "help",
    MAINTENANCE: "maintenance",
    ACCOMMODATION: "accommodation",
    DONATION: "donation"
}

const CreateUpdateRequestComponent = () => {
    const navigate = useNavigate();

    //#region States
    const [creatorId, setCreatorId] = useState(sessionStorage.getItem("uid") || 'id');
    const [title, setTitle] = useState('');
    const [type, setType] = useState(REQUEST_TYPE.HELP);
    const [request, setRequest] = useState('');

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
    const [createRequest] = useMutation(CREATE_REQUEST);
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
            await createRequest({ variables: { creatorId, title, type, request } });    
            displayToastMsg(Label.SUCCESS, Message.REQUEST_SAVED_SUCCESSFULLY, "success");
            
            setTitle('');
            setType(REQUEST_TYPE.HELP);
            setRequest('');

        } catch(error) {
            displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
            console.error(`An error occurred while creating or updating a request: `, error);
            throw error;
        }
    };       

return <>
    <div className="px-5 pb-4">
        <h4 className="pt-4 pb-2">{Label.setRequestsTitle(true ? Label.CREATE : Label.UPDATE)}</h4>
        <Form noValidate onSubmit={handleSubmit}>
            <Row>
                {/**Title */}
                <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="headline">
                    <Form.Label>{Label.TITLE}</Form.Label>
                    <Form.Control required
                                  type="text"
                                  placeholder={Label.TITLE}
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}/>            
                </Form.Group>

                 {/**Type */}
                 <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="type">
                        <Form.Label>{Label.TYPE}</Form.Label>
                        <Form.Select required onChange={(e) => setType(e.target.value)} value={type}>
                            <option value={REQUEST_TYPE.HELP}>{Label.HELP}</option>
                            <option value={REQUEST_TYPE.MAINTENANCE}>{Label.MAINTENANCE}</option>
                            <option value={REQUEST_TYPE.ACCOMMODATION}>{Label.ACCOMMODATION}</option>
                            <option value={REQUEST_TYPE.DONATION}>{Label.DONATION}</option>
                        </Form.Select>                        
                    </Form.Group>

                {/**Request */}
                <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="request">
                    <Form.Label>{Label.REQUEST}</Form.Label>
                    <Form.Control required 
                                  as="textarea" 
                                  rows={3} 
                                  placeholder={Label.REQUEST}
                                  value={request}
                                  onChange={(e) => setRequest(e.target.value)}/>                    
                </Form.Group>                    
            </Row>
           
            <Button variant="secondary" className="button mx-2 my-2" onClick={() => { navigate("/dashboard"); }}>
                <FaUndo />
                <span style={{paddingLeft: "5px"}} >{Label.BACK} </span>
                
            </Button>
            <Button type="submit" variant="success" className="button mx-2 my-2">
                <FaPaperPlane />
                <span style={{paddingLeft: "5px"}}> {Label.SUBMIT} </span>
            </Button>
        </Form>

        <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}/>
    </div>  
</>
}

export default CreateUpdateRequestComponent;