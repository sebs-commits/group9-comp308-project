//#region External Imports
import { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane } from "react-icons/fa";
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

import { gql, useQuery, useMutation } from "@apollo/client";
import { GET_USERS, GET_USER, UPDATE_VOLUNTEER } from '../../../authentication-app/shared/gql/authentication.gql';
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
    const [uid, setUid]= useState("");
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
            e.stopPropagation();
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

    // --- REQUEST SERVER'S USERS QUERY
    const { refetch: fetchUsers } = useQuery(GET_USERS, {
        skip: true, // won't run automatically (useful don't remove)
    });
    const [filteredVolunteers, setFilteredVolunteers] = useState([]);
    useEffect(() => {
        if (filteredVolunteers.length > 0) {
            console.log("Updated volunteers:", filteredVolunteers);
        
            const promises = filteredVolunteers.map((voluteer) => {
                setUid(voluteer.id);
                return sendSuggestionToVolunteer(voluteer.id);  // Call the function for each volunteerId
            });
    
            // Wait for all promises to resolve (or reject)
            const res = async () => {
                await Promise.all(promises);
            }

            res();
        }

        console.log("filteredVolunteers: ", filteredVolunteers);
    }, [filteredVolunteers]);

    // --- THIS IS THE FUNCTION I WANT TO FOCUS ON
    const handleVolunteers = async (e) => {
        e.preventDefault();

        displayToastMsg(Label.INFO, "Suggested volunteers can take a moment to load...", "info");

        try{
            const usersResult = await fetchUsers();
            const users = usersResult?.data?.users || [];
            console.log("UsersFound: ", users);

            if (!users || !users[0]) { throw new Error("No users returned from auth-microservice"); }

            const prompt = `
                Given the event's 
                    title: "${event?.title}", 
                    description: "${event?.description}", 
                    summary: "${event?.summary}", 
                    type: "${event?.type}", 
                    price: "${event?.price}", 
                    and location: "${event?.location}", 
                suggest volunteers based on the theme and location of the event compared to their interests and location.
                ${users
                    ?.filter(
                      (user) =>
                        user.interests !== "None" && // if volunteer has an interest
                        user.location !== "Nowhere" && // if volunteer has an location
                        !user.ignoredMatches?.includes(event.id) && // if volunteer didn't ignore the event
                        !user.eventMatches?.includes(event.id) // if volunteer isn't yet matched with the event
                    )
                    .map(
                      (user) =>
                        `   - {id: ${user.id}, email: ${user.email}, interests: ${user.interests}, location: ${user.location}}`
                    )
                    .join('\n')
                }

                Volunteers who have ignored this event's id or don't have an interest or location that accurately match this event should be ignored.
                Only respond in this exact format: "volunteerId|volunteerId|..." *by ... I mean keep repeating the "volunteerId|" pattern, AND the full string shouldn't end in "|".
            `;

            const { data } = await fetchAssistance({ prompt });

            if (!data || !data.requestAssistance) { throw new Error("No data returned from AI"); }

            const resultText = data.requestAssistance;
            console.log("AI Result:", resultText);
            //const resultText = "67f98454f863585bd717f3e0";

            const volunteers = resultText.split("|").map(v => v.trim());

            if (!volunteers) { displayToastMsg(Label.ERROR, "AI response format incorrect", "danger"); return; }

            await setFilteredVolunteers(users.filter(
                (user) => volunteers.includes(String(user.id))
            ));

            console.log("Volunteers: ", volunteers);
        } catch (err) {
            console.error("Error fetching assistance:", err);
            displayToastMsg(Label.ERROR, "Failed to get new suggested volunteers", "danger");
        }
    };

    
    const { refetch: fetchUser } = useQuery(GET_USER, {
        variables: { id: uid },
        skip: !uid
    });

    const [ updateVolunteer ] = useMutation(UPDATE_VOLUNTEER)
       
    const sendSuggestionToVolunteer = async (volunteerId) => {

        if (!volunteerId || volunteerId === "" || volunteerId.trim() === "") { displayToastMsg(Label.ERROR, "No volunteer ID provided", "danger"); return; }
        console.log("Volunteer ID: ", volunteerId);

        try {
            const {data} = await fetchUser({id: volunteerId});           
            console.log("Fetched user data:", data?.user);  // Log the response

            if (!data || !data.user) { throw new Error("No userData returned from service"); }

            const id = data.user.id;
            const interests = data.user.interests;
            const location = data.user.location;
            const newEventMatches = data.user.eventMatches === "" ? (data.user.eventMatches, event.id) : (data.user.eventMatches, "|", event.id);
            const requestMatches = data.user.requestMatches;
            const ignoredMatches = data.user.ignoredMatches;

            console.log("UpdateVolunteer: ", id, ", ", interests, ", ", location, ", ", newEventMatches, ", ", requestMatches, ", ", ignoredMatches);
            await updateVolunteer({ variables: { id, interests, location, eventMatches: newEventMatches, requestMatches, ignoredMatches } });

            displayToastMsg(Label.SUCCESS, Message.USER_VOLUNTEER_UPDATED_SUCCESSFULLY, "success");
        } catch (error) {
            console.error(("Error sending suggestion to volunteer: ", volunteerId), error);
            displayToastMsg(Label.ERROR, ("Failed to send suggestion to volunteer: ", volunteerId), "danger");
        }

    }

    return <>
        <div className="pb-4">
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
                                          
                        <Button type="submit" variant={!isEditing ? "success" : "warning"} className="button mx-2">
                            <FaPaperPlane />
                            <span style={{paddingLeft: "5px"}}>{!isEditing ? Label.CREATE: Label.UPDATE} </span>
                        </Button>
                    </Col>                    
                </Row> 
                {isEditing && 
                <>
                    <Row className="d-flex justify-content-center align-items-center mt-4">
                        <Col xs={12} md={8}>
                            <Button variant="primary" className="button mx-2" onClick={handleVolunteers}>
                                <span style={{paddingLeft: "5px"}}>Suggest Volunteers</span>
                            </Button>
                        </Col>                    
                    </Row>
                    <Row className="d-flex justify-content-center align-items-center">   
                        <Col md={8} xs={12} className='form-col-bg'>
                            {/* Display all current volunteers/users */}
                            {filteredVolunteers.map((user) => (
                                <div 
                                    key={user.id} 
                                    style={{ 
                                        backgroundColor: '#f0f0f0', 
                                        padding: '10px', 
                                        borderRadius: '5px', 
                                        marginBottom: '10px'
                                    }}
                                >
                                    <strong style={{ color: 'black' }}>Sent Suggestion To {user.username} at {user.email}</strong>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </>}
                                
            </Form>

            <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}></CustomToast>
        </div>        
    </>
}

export default CreateUpdateEvent;