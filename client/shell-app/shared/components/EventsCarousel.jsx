//#region External Imports
import { useEffect, useState } from "react";
import { useQuery } from '@apollo/client';
import { Carousel, Button, Card } from 'react-bootstrap';
//#endregion

//#region Internal Imports
import { Label, Message } from "../../shared/resources"
import { GET_NON_EXPIRED_EVENTS } from "../../../events-administration-app/shared/gql/event.gql";
//#endregion

const EventsCarouselComponent = () => {    
    const [events, setEvents] = useState([]);

    const { refetch: fetchingEvents } = useQuery(GET_NON_EXPIRED_EVENTS)

    useEffect(() => {
        const fetch = async () => {
            const res = await fetchingEvents();
            if(res?.data?.events.length > 0) setEvents([...res.data.events]);
        }
        fetch();
    }, []);

    const handleOnLearnMore = (e, id) => {
        e.preventDefault();
        console.log('Events id: ', id);
    }

    return <>
        {events?.length === 0 ? 
            <> <p>{Message.NO_EVENTS_TO_DISPLAY}</p> </> :
            <Carousel>
                {events?.map((e, id) => {
                    return (
                    <Carousel.Item key={id}>
                        <Card className='mb-5'>
                            <Card.Body>
                                <Card.Title>{e.headline}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">{e.type}</Card.Subtitle>
                                <Card.Text> {e.summary} </Card.Text>
                                <Button className='button' variant="link" onClick={(e) => { handleOnLearnMore(e, e.id) }}>{Label.LEARN_MORE}</Button>
                            </Card.Body>
                        </Card>
                    </Carousel.Item>)
                })}
            </Carousel>
        }
    </>
}

export default EventsCarouselComponent;