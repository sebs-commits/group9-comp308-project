//#region External Imports
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
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
    <div className="px-5 pb-4">
        <h4 className="pt-4 pb-2">{Label.setAlertTitle(true ? Label.CREATE : Label.UPDATE)}</h4>
        <Form noValidate onSubmit={handleSubmit}>
            <Row>
                {/**Title */}
                <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="title">
                    <Form.Label>{Label.TITLE}</Form.Label>
                    <Form.Control required
                                  type="text"
                                  placeholder={Label.TITLE}
                                  value={title}
                                  onChange={(e) => setTitle(e.target.value)}/>
                </Form.Group>

                 {/**Subtitle */}
                 <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="subtitle">
                    <Form.Label>{Label.SUBTITLE}</Form.Label>
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

        <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}></CustomToast>
    </div>  
</>
}

export default CreateUpdateAlertComponent;