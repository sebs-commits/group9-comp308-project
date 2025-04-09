//#region External Imports
import { useParams } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { useQuery } from "@apollo/client";
//#endregion

//#region Internal Imports
import { EMPTY_EVENT } from "./events";
import { GET_EVENT } from "../gql/event.gql";
//#endregion

export const EventContext = createContext(null);

export const EventProvider = ({children}) => {
    const { id } = useParams(); 

    const [eventToDisplay, setEventToDisplay] = useState(EMPTY_EVENT);

    const { refetch: fetchingEvent } = useQuery(GET_EVENT, {
        variables: { id },
        skip: !id,
    });

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await fetchingEvent();
                if(res?.data?.event?.id) setEventToDisplay(res?.data?.event);
            } catch(error) {
                console.error(`An error occurred while fecthing an event`, error);
                throw new Error("An error occurred while fecthing an event - events.jsx");
            }
        }
        fetch();
    }, [id])

    return (
        <EventContext.Provider value={{ eventToDisplay }}>
            {children}
        </EventContext.Provider>
    )
}
