//#region External Imports
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { FaUndo, FaPaperPlane } from "react-icons/fa";
//#endregion

//#region Internal Imports
import { Label, Message } from '../../shared/resources';
import { CREATE_EVENT } from '../../shared/gql/event.gql';
import { useMutation } from '@apollo/client';
import CustomToast from '../../../shell-app/shared/components/CustomToast';
//#endregion

//Matches the backend type list
export const EVENT_TYPE = {
    WORKSHOPS: "workshops",
    MEETUPS: "meetups",
    CLEAN_UP_DRIVES: "clean-up-drives"
}

const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;

const CreateUpdateEvent = () => {
    const navigate = useNavigate();

    //#region States
    const [creatorId, setCreatorId] = useState(sessionStorage.getItem("uid") || 'id');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [summary, setSummary] = useState('');
    const [type, setType] = useState(EVENT_TYPE.WORKSHOPS);
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [price, setPrice] = useState(0);
    const [location, setLocation] = useState('');

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
    const [createEvent] = useMutation(CREATE_EVENT);
    //#endregion

    const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;

      if (form.checkValidity() === false) {
        displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
        event.stopPropagation();
        return;
      }

      if(!regex.test(from) || !regex.test(to)) {
        displayToastMsg(Label.ERROR, Message.INVALID_DATE, "danger");
        return;
      }           

      try {
        await createEvent({ variables: { creatorId, title, description, summary, type: type ? type : EVENT_TYPE.WORKSHOPS, from, to, price, location } })
        displayToastMsg(Label.SUCCESS, Message.EVENT_SAVED_SUCCESSFULLY, "success");

        setTitle('');
        setDescription('');
        setSummary('');
        setType(EVENT_TYPE.WORKSHOPS);
        setFrom('');
        setTo('');
        setPrice(0);
        setLocation('');

      } catch(error) {
        displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
        console.error(`An error occurred while creating or updating an event: `, error);
        throw error;
      }
    };       

    return <>
        <div className="px-5 pb-4">
            <h4 className="pt-4 pb-2">{Label.formEventTitle(true ? Label.CREATE : Label.UPDATE)}</h4>
            <Form noValidate onSubmit={handleSubmit}>
                <Row>
                    {/**Event Title */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="title">
                        <Form.Label>{Label.TITLE}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.TITLE}
                                      value={title}
                                      onChange={(e) => setTitle(e.target.value)}/>
                    </Form.Group>

                    {/**Event Description */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="description">
                        <Form.Label>{Label.DESCRIPTION}</Form.Label>
                        <Form.Control required 
                                      as="textarea" 
                                      rows={3} 
                                      placeholder={Label.DESCRIPTION}
                                      value={description}
                                      onChange={(e) => setDescription(e.target.value)}/>
                    </Form.Group>

                     {/**Event Summary */}
                     <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="summary">
                        <Form.Label >{Label.SUMMARY}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.SUMMARY}
                                      value={summary}
                                      onChange={(e) => setSummary(e.target.value)}/>
                    </Form.Group>

                    {/**Event Type */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="type">
                        <Form.Label>{Label.TYPE}</Form.Label>
                        <Form.Select required onChange={(e) => setType(e.target.value)} value={type}>
                            <option value={EVENT_TYPE.WORKSHOPS}>{Label.WORKSHOP}</option>
                            <option value={EVENT_TYPE.MEETUPS}>{Label.MEETUP}</option>
                            <option value={EVENT_TYPE.CLEAN_UP_DRIVES}>{Label.CLEAN_UP_DRIVE}</option>
                        </Form.Select>
                    </Form.Group>

                    {/**Event's Start and End Dates */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="dates">
                        <Form.Label>{Label.EVENT_START_END_DATES}</Form.Label>
                        <InputGroup className="mb-3">                        
                            <Form.Control required placeholder={Label.START_DATE} onChange={(e) => setFrom(e.target.value)} value={from}/>
                            <Form.Control required placeholder={Label.END_DATE} onChange={(e) => setTo(e.target.value)} value={to}/>
                        </InputGroup>
                    </Form.Group>

                    {/**Event Location */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="location">
                        <Form.Label>{Label.LOCATION}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.LOCATION}
                                      value={location}
                                      onChange={(e) => setLocation(e.target.value)}/>
                    </Form.Group>

                    {/**Event Price */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="price">
                        <Form.Label>{Label.PRICE}</Form.Label>                        
                        <InputGroup className="mb-3">                            
                            <InputGroup.Text>{Label.DOLLAR_SIGN}</InputGroup.Text>
                            <Form.Control type="number" required onChange={(e) => setPrice(e.target.value)} value={price}/>
                            <InputGroup.Text>{Label.TRAILING_AMT}</InputGroup.Text>
                        </InputGroup>
                    </Form.Group>                    
                </Row>
    
                <Button variant="secondary" className="button mx-2 my-2" onClick={() => { navigate("/dashboard"); }}>
                    <FaUndo />
                    <span style={{paddingLeft: "5px"}} >{Label.BACK}</span>                    
                </Button>
               
                <Button type="submit" variant="success" className="button">
                    <FaPaperPlane />
                    <span style={{paddingLeft: "5px"}}>{Label.SUBMIT} </span>
                </Button>
            </Form>

            <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}></CustomToast>
        </div>        
    </>
}

export default CreateUpdateEvent;