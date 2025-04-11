//#region External Imports
import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { FaUndo, FaPaperPlane } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
//#endregion

//#region Internal Imports
import { Label, Message } from '../../shared/resources';
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import { EventsContext } from '../../shared/contexts/events';
//#endregion

//Matches the backend type list
export const EVENT_TYPE = {
    WORKSHOPS: "workshops",
    MEETUPS: "meetups",
    CLEAN_UP_DRIVES: "clean-up-drives"
}

// AI Query
import { gql, useQuery } from "@apollo/client";
const GET_ASSISTANCE = gql`
    query RequestAssistance($prompt: String!) {
        requestAssistance(prompt: $prompt)
    }
`;

const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;

const CreateUpdateEvent = () => {
    const navigate = useNavigate();

    const { event, initEvent, addEventToEvents, updateEventInEvents, emptyEvent } = useContext(EventsContext);
    useEffect(() => { setIsEditing(!!event.id); }, [event]);

    //#region States
    const [isEditing, setIsEditing] = useState(false);    

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

    const handleReset = (e) => {
        e.preventDefault();
        emptyEvent();
        setIsEditing(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();    
        const data = {...event, type: event.type ? event.type : EVENT_TYPE.WORKSHOPS};
        
        if(!data.title || !data.summary || !data.description || !data.type || !data.from || !data.to || !data.location || !data.price) {
            displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
            event.stopPropagation();
            return;
        }

        if(!regex.test(event.from) || !regex.test(event.to)) {
            displayToastMsg(Label.ERROR, Message.INVALID_DATE, "danger");
            return;
        }

        try {     
            isEditing ? await updateEventInEvents(data) : await addEventToEvents(data);            
            displayToastMsg(Label.SUCCESS, Message.EVENT_SAVED_SUCCESSFULLY, "success");
            setIsEditing(false);

        } catch(error) {
            displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
            console.error(`An error occurred while creating or updating an event: `, error);
            throw error;
        }
    };       

    // --- REQUEST SERVER'S AI QUERY
    const { refetch: fetchAssistance } = useQuery(GET_ASSISTANCE, {
        variables: { prompt: "" },
        skip: true, // won't run automatically (useful don't remove)
    });

    // --- THIS IS THE FUNCTION I WANT TO FOCUS ON
    const handleSuggestDates = async (e) => {
        e.preventDefault();

        const prompt = `
            Given the event's 
                title: "${event?.title}", 
                description: "${event?.description}", 
                summary: "${event?.summary}", 
                type: "${event?.type}", 
                price: "${event?.price}", 
                and location: "${event?.location}", 
            suggest the best from and to dates.
            Keep in mind that the dates need to be past today's date (which is 04/20/2025), and the event length should not exceed 30 days.

            Only respond in this exact format: "MM/DD/YYYY|MM/DD/YYYY|{insert explanation summary (minimum of 50 characters)}"
        `;

        displayToastMsg(Label.INFO, "Suggested dates can take a moment to load...", "info");
        
        try{
            const { data } = await fetchAssistance({ prompt });

            if (!data || !data.requestAssistance) {
                throw new Error("No data returned from AI");
            }

            const resultText = data.requestAssistance;
            console.log("AI Result:", resultText);

            const [suggestedFrom, suggestedTo, explanation] = resultText.split("|");

            if (!suggestedFrom || !suggestedTo || !explanation) { displayToastMsg(Label.ERROR, "AI response format incorrect", "danger"); return; }

            initEvent({
                ...event,
                from: suggestedFrom,
                to: suggestedTo
            });

            displayToastMsg(Label.INFO, ("Explanation: ", explanation.trim()), "info");
        } catch (err) {
            console.error("Error fetching assistance:", err);
            displayToastMsg(Label.ERROR, "Failed to get suggested dates", "danger");
        }
    };

    return <>
        <div className="pb-4" style={{ position: 'relative', left: '-60px' }}>
            <Form noValidate onSubmit={handleSubmit}>                
                <Row className="d-flex justify-content-center align-items-center">
                    <Col xs={12} md={8}>
                        <h4 className="pt-4 pb-2">{Label.formEventTitle(!isEditing ? Label.CREATE : Label.UPDATE)}</h4>
                    </Col>
                </Row>
               
                <Row className="d-flex justify-content-center align-items-center">   
                    <Col md={8} xs={12} className='form-col-bg'>
                        {/**Event Title */}
                        <Form.Group className="py-3" as={Col} controlId="title">                            
                            <Form.Control required
                                        type="text"
                                        placeholder={Label.TITLE}
                                        value={event?.title}
                                        onChange={(e) => {initEvent({ ...event, title: e.target.value})}}/>
                        </Form.Group>

                        {/**Event Description */}
                        <Form.Group className="py-3" as={Col} controlId="description">
                            <Form.Control required 
                                        as="textarea" 
                                        rows={3} 
                                        placeholder={Label.DESCRIPTION}
                                        value={event?.description}
                                        onChange={(e) => {initEvent({ ...event, description: e.target.value})}}/>
                        </Form.Group>

                        {/**Event Summary */}
                        <Form.Group className="py-3" as={Col} controlId="summary">
                            <Form.Control required
                                        type="text"
                                        placeholder={Label.SUMMARY}
                                        value={event?.summary}
                                        onChange={(e) => {initEvent({ ...event, summary: e.target.value})}}/>
                        </Form.Group>

                        {/**Event Type */}
                        <Form.Group className="py-3" as={Col} controlId="type">
                            <Form.Select required onChange={(e) => {initEvent({ ...event, type: e.target.value})}} value={event?.type}>
                                <option value={EVENT_TYPE.WORKSHOPS}>{Label.WORKSHOP}</option>
                                <option value={EVENT_TYPE.MEETUPS}>{Label.MEETUP}</option>
                                <option value={EVENT_TYPE.CLEAN_UP_DRIVES}>{Label.CLEAN_UP_DRIVE}</option>
                            </Form.Select>
                        </Form.Group>

                        {/**Event's Start and End Dates */}
                        <Form.Group className="py-3" as={Col} controlId="dates">
                            <InputGroup>     
                                <Form.Control required placeholder={Label.START_DATE} onChange={(e) => {initEvent({ ...event, from: e.target.value})}} value={event?.from}/>
                                <Form.Control required placeholder={Label.END_DATE} onChange={(e) => {initEvent({ ...event, to: e.target.value})}} value={event?.to}/>

                                <Button variant="primary" onClick={handleSuggestDates} style={{width: "100%"}}>Suggest Dates</Button>
                            </InputGroup>
                        </Form.Group>

                        {/**Event Location */}
                        <Form.Group className="py-3" as={Col} controlId="location">
                            <Form.Control required
                                        type="text"
                                        placeholder={Label.LOCATION}
                                        value={event?.location}
                                        onChange={(e) => {initEvent({ ...event, location: e.target.value})}}/>
                        </Form.Group>

                        {/**Event Price */}
                        <Form.Group className="py-3" as={Col} controlId="price">                  
                            <InputGroup>                            
                                <InputGroup.Text>{Label.DOLLAR_SIGN}</InputGroup.Text>
                                <Form.Control type="number" required onChange={(e) => {initEvent({ ...event, price: e.target.value})}} value={event?.price}/>
                                <InputGroup.Text>{Label.TRAILING_AMT}</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>    
                    </Col>                
                </Row>
                    
                <Row className="d-flex justify-content-center align-items-center mt-4">
                    <Col xs={12} md={8}>
                        {isEditing &&
                            <Button title={Label.RESET} type="button" variant="info" className="my-3" onClick={(e) => handleReset(e)}>
                                <RxReset />
                            </Button>
                        }
                      
                        <Button variant="secondary" className="button mx-2 my-2" onClick={() => { navigate("/dashboard"); }}>
                            <FaUndo />
                            <span style={{paddingLeft: "5px"}} >{Label.BACK}</span>                    
                        </Button>
                    
                        <Button type="submit" variant={!isEditing ? "success" : "warning"} className="button">
                            <FaPaperPlane />
                            <span style={{paddingLeft: "5px"}}>{!isEditing ? Label.CREATE: Label.UPDATE} </span>
                        </Button>
                    </Col>                    
                </Row>     
                                
            </Form>

            <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}></CustomToast>
        </div>        
    </>
}

export default CreateUpdateEvent;