//#region External Imports
import { createContext, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
//#endregion

//#region Internal Imports
import { CREATE_EVENT, DELETE_EVENT, GET_YOUR_EVENTS, UPDATE_EVENT } from "../gql/event.gql";
//#endregion

export const EMPTY_EVENT = { creatorId: '', title: '', description: '', summary: '',
                      type: '', from: '', to: '', location: '', price: '' }

export const EventsContext = createContext(null);

export const EventsProvider = ({children}) => {    
    //#region States    
    const [event, setEvent] = useState(EMPTY_EVENT);
    const [events, setEvents] = useState([]);
    const [creatorId, setCreatorId] = useState(sessionStorage.getItem('uid') || "id");
    //#endregion

    //#region GQL
    const [createEvent] = useMutation(CREATE_EVENT);
    const [updateEvent] = useMutation(UPDATE_EVENT);
    const [deleteEvent] = useMutation(DELETE_EVENT);

    const { refetch: fetchingEvents } = useQuery(GET_YOUR_EVENTS, {
            variables: { creatorId },
            skip: !creatorId,
    });        
    //#endregion

    //#region Effects
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await fetchingEvents();
                if(res?.data?.userEvents?.length > 0) setEvents([...res.data.userEvents]);                        
            } catch(error) {
                console.error(`An error occurred while fetching your events: `, error);
                throw new Error("An error occurred while fetching your events in the events' context - events.jsx");
            }            
        }

        fetch();
    }, []);   
    //#endregion

    const initEvent = (event) => {  setEvent({...event}); }

    const initEvents = (events) => { setEvents([...events]); }

    const addEventToEvents = async (event) => { 
        try {
            const res = await createEvent({ variables: { ...event, creatorId } });
            setEvents([...events, res?.data?.createEvent]); 
            setEvent(EMPTY_EVENT);
        } catch(error) {
            console.error(`An error occurred while adding an event.`);
            throw new Error("An error occurred while adding an event in the events' context - events.jsx");
        }        
    }

    const updateEventInEvents = async (event) => {
        try {
            await updateEvent({ variables: { ...event  } })      
            setEvents([...events.filter(e => e.id !== event.id), event]);
            setEvent(EMPTY_EVENT);
        } catch(error) {
            console.error(`An error occurred while updating an event.`);
            throw new Error("An error occurred while updating an event in the events' context - events.jsx");
        }
        
    }

    const removeEventFromEvents = async (id) => {
        try {
            await deleteEvent({variables: { id }});
            setEvents([...events.filter(e => e.id !== id)]);
            setEvent(EMPTY_EVENT);
        } catch(error) {
            console.error(`An error occurred while removing an event.`);
            throw new Error("An error occurred while removing an event in the events' context - events/jsx");
        }        
    }

    const emptyEvent = () => { setEvent(EMPTY_EVENT); }

    return (
        <EventsContext.Provider value={{ event, 
                                         initEvent, 
                                         events, 
                                         initEvents, 
                                         addEventToEvents, 
                                         updateEventInEvents, 
                                         removeEventFromEvents, 
                                         emptyEvent}}>
            {children}
        </EventsContext.Provider>
    )
}