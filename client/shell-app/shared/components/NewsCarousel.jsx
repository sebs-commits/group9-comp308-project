// //#region External Imports
// import { useEffect, useState } from "react";
// import { useQuery } from '@apollo/client';
// import { Carousel, Button, Card } from 'react-bootstrap';
// //#endregion

// //#region Internal Imports
// import { GET_NON_EXPIRED_NEWS } from "../../../community-business-app/shared/gql/news.gql";
// import { Label, Message } from "../../shared/resources"
// //#endregion

// const NewsCarouselComponent = () => {    
//     const [news, setNews] = useState([]);

//     const { refetch: fetchingNews } = useQuery(GET_NON_EXPIRED_NEWS)

//     useEffect(() => {
//         const fetch = async () => {
//             const res = await fetchingNews();
//             if(res?.data?.allNoneExpiredNews.length > 0) setNews([...res.data.allNoneExpiredNews]);
//         }
//         fetch();
//     }, []);

//     const handleOnLearnMore = (e, id) => {
//         e.preventDefault();
//         console.log('News id: ', id);
//     }

//     return <>
//         {news?.length === 0 ? 
//             <> <p>{Message.NO_NEWS_TO_DISPLAY}</p> </> :
//             <Carousel>
//                 {news?.map((n, id) => {
//                     return (
//                     <Carousel.Item key={id}>
//                         <Card className='mb-5'>
//                             <Card.Body>
//                                 <Card.Title>{n.headline}</Card.Title>
//                                 <Card.Text> {n.summary} </Card.Text>
//                                 <Button className='button' variant="link" onClick={(e) => { handleOnLearnMore(e, n._id) }}>{Label.LEARN_MORE}</Button>
//                             </Card.Body>
//                         </Card>
//                     </Carousel.Item>)
//                 })}
//             </Carousel>
//         }
//     </>
// }

// export default NewsCarouselComponent;