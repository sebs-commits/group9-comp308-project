//#region External Imports
import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaPaperPlane } from "react-icons/fa";
//#endregion

//#region Internal Imports
import { useMutation, useQuery, useLazyQuery } from '@apollo/client';
import { Label, Message } from '../../shared/resources';
import { CREATE_USER, UPDATE_VOLUNTEER, GET_USER } from '../../shared/gql/authentication.gql';
import CustomToast from '../../../shell-app/shared/components/CustomToast';
//#endregion

//Matches the backend type list
const USER_TYPE = {
    RESIDENT: "resident",
    OWNER: "owner",
    ORGANIZER: "organizer"
}

const UpdateVolunteerComponent = () => {
    //#region States
    /*const [ username, setUsername ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ type, setType ] = useState(USER_TYPE.RESIDENT);
    const [ password, setPassword ] = useState('');*/

    const [message, setMessage] = useState("");
    const [header, setHeader] = useState("");
    const [bg, setBg] = useState("");        
    const [showA, setShowA] = useState(false);
    //#endregion

    const [ id, setID ] = useState('');
    const [ interests, setInterests ] = useState('None');
    const [ location, setLocation ] = useState('Nowhere');
    const [ participation, setParticipation ] = useState('Nothing');

    //console.log("Before GET_USER");

    const { loading, error, data, refetch } = useQuery(GET_USER);
    //const [fetchUser, { data, loading, error }] = useLazyQuery(GET_USER);

    //console.log("Error?: ", error);

    useEffect(() => {
        const fetch = async () => {
            console.log("Current User ID: ", sessionStorage.getItem("uid"));
            const _id = sessionStorage.getItem("uid");

            if (!_id) { console.error("No UID found in sessionStorage"); return; }

            const res = await refetch({variables: { id: _id }});
            console.log("Refetch: ", res);
            //const data = res?.data || [];

            console.log("Error?: ", res?.error);
            console.log("Data: ", res?.data);
            const id = res?.data?.id || null; 
            const interests = res?.data?.interests || 'None'; 
            const location = res?.data?.location || 'Nowhere'; 
            const participation = res?.data?.participation || 'Nothing'; 

            setID(id);
            setInterests(interests);
            setLocation(location);
            setParticipation(participation);
        }
        fetch();
    }, [data]);

    //console.log("toggleShowA");

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
    //const [ createUser ] = useMutation(CREATE_USER);

    //console.log("updateVolunteer");

    const [ updateVolunteer ] = useMutation(UPDATE_VOLUNTEER);
    //#endregion


    /**
     * 
        TODO: Missing validation.
                1. Unique username
                2. Email (Regex)
     */
    /*const handleSubmit = async (event) => {
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
    };     */

    //console.log("handleSubmit");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.currentTarget;

        if (form.checkValidity() === false) {
            displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
            e.stopPropagation();
            return;
        }

        try {
            await updateVolunteer({ variables: { id, interests, location, participation } });

            displayToastMsg(Label.SUCCESS, Message.USER_VOLUNTEER_UPDATED_SUCCESSFULLY, "success");
        } catch(error) {
            displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
            console.error(`An error occurred while updating the volunteer: `, error);
            throw error;
        }    
    }; 

    return <>
        <div className="px-5 pb-4">
            <h4 className="pt-4 pb-2">{Label.formUserTitle(Label.UPDATEVOLUNTEER)}</h4>
            <Form noValidate onSubmit={handleSubmit}>
                <Row>
                    {/**Interests */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="interests">
                        <Form.Label>{Label.INTERESTS}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.INTERESTS}
                                      value={interests}
                                      onChange={(e) => setInterests(e.target.value)}/>
                    </Form.Group>

                    {/**Location */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="location">
                        <Form.Label>{Label.LOCATION}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.LOCATION}
                                      value={location}
                                      onChange={(e) => setLocation(e.target.value)}/>
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

export default UpdateVolunteerComponent;