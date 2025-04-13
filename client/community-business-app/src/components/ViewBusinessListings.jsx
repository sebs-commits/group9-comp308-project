//#region External Imports
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Table, Button } from 'react-bootstrap';
import { Form, Row, Col } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
//#endregion

//#region Internal Imports
import { GET_BUSINESS_LISTINGS, GET_BUSINESS_LISTING, UPDATE_BUSINESS_LISTING, DELETE_BUSINESS_LISTING } from '../../shared/gql/businesslisting.gql.js'; 
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import { Label, Message } from '../../shared/resources';
//#endregion

// AI Query
const GET_ASSISTANCE = gql`
    query RequestAssistance($prompt: String!) {
        requestAssistance(prompt: $prompt)
    }
`;

const ViewBusinessComponent = () => {

    //get user type from session storage
    const [type, setType] = useState(sessionStorage.getItem('type') || '');
    //get user token from session storage to see if user is logged in
    const [token, setToken] = useState(sessionStorage.getItem("token") || 'auth');

    const navigate = useNavigate();

    //#region States
    const [message, setMessage] = useState("");
    const [header, setHeader] = useState("");
    const [bg, setBg] = useState("");        
    const [showA, setShowA] = useState(false);
    //#endregion

    const [review, setReview] = useState(''); // state for the reviews


    const [businessListings, setBusinessListings] = useState([]); // state for the business listings
    const [deleteListing] = useMutation(DELETE_BUSINESS_LISTING);
    const [updateBusinessListing] = useMutation(UPDATE_BUSINESS_LISTING);
    const {loading, error, data, refetch} = useQuery(GET_BUSINESS_LISTINGS);

    //#region CustomToast Related
    const toggleShowA = () => setShowA(!showA);
    const displayToastMsg = (header, message, bg) => {
        toggleShowA();
        setHeader(header);
        setMessage(message);
        setBg(bg);
    }
    //#endregion

    useEffect(() => {
        const fetch = async () => {
            const res = await refetch();
            const data = res?.data || [];
            const businessListings = data.listings || []; 
            setBusinessListings(businessListings);
        }
        fetch();
    }, [data]);


    const handleDelete = async function (listingTicketId) {
        await deleteListing({ variables: { listingTicketId } });
        const res = await refetch();
        const data = res?.data || [];
        const businessListings = data.listings || []; 
        setBusinessListings(businessListings);
    };


    const handleSubmit = async (e, businessListingId, businessName, businessAddress, businessPhone, businessDescription, imageList, businessDeals, reviews, creatorUsername) => {
        e.preventDefault();
   
        //check if the review is blank. If so, error message
        if(review == "") {
            displayToastMsg(Label.ERROR, Message.REVIEW_EMPTY, "danger");
            return;
        }

        try {
            updateBusinessListing({
                variables: {
                    listingTicketId: businessListingId,
                    businessName: businessName,
                    address: businessAddress,
                    phoneNumber: businessPhone,
                    businessDescription: businessDescription,
                    //pass the images
                    images: imageList,
                    discounts: businessDeals,
                    reviews: [...reviews, review], //pass the reviews
                    creatorUsername: creatorUsername // pass the creatorUsername from the listing
                }
            });
            displayToastMsg(Label.SUCCESS, Message.REVIEW_SUCCESSFUL, "success");
            setReview('');
        } catch(error) {
            displayToastMsg(Label.ERROR, Message.REVIEW_NOT_SUCCESSFUL, "danger");
            console.error(`An error occurred while sending a review: `, error);
            throw error;
        }            
    }; 
    
    // --- REQUEST SERVER'S AI QUERY
    const { refetch: fetchAssistance } = useQuery(GET_ASSISTANCE, {
        variables: { prompt: "" },
        skip: true, // won't run automatically (useful don't remove)
    });

    const [summaryText, setSummaryText] = useState("");

    // --- THIS IS THE FUNCTION I WANT TO FOCUS ON
    const handleReviewSummary = async (e, listing) => {
        e.preventDefault();

        const prompt = `
            Given the listing
                businessName: "${listing?.businessName}", 
                businessDescription: "${listing?.businessDescription}", 
            and it's reviews:
            ${listing?.reviews?.map((review) => `   - ${review}`).join('\n')}

            provide a summary of the reviews, and point out the major points of feedback.
            Keep in mind rude or simple feedback should not be focused on, and the summary should be strictly professional.
            The summary should be less than 100 words.
        `;

        displayToastMsg(Label.INFO, "Summarized Feedback can take a moment to load...", "info");

        try{
            const { data } = await fetchAssistance({ prompt });

            if (!data || !data.requestAssistance) {
                throw new Error("No data returned from AI");
            }

            const summaryText = data.requestAssistance;
            console.log("AI Result:", summaryText);

            if (!summaryText) { displayToastMsg(Label.ERROR, "AI response gave incorrect output", "danger"); return; }

            setSummaryText(summaryText);

            displayToastMsg(Label.SUCCESS, "AI response received", "success");
        } catch (err) {
            console.error("Error fetching assistance:", err);
            displayToastMsg(Label.ERROR, "Failed to get suggested dates", "danger");
        }
    };


    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        console.error("Error fetching business listings:", error);
        return <p>Error loading business listings.</p>;
    }

    return <>
            <div className="d-flex flex-wrap justify-content-center">
              {businessListings?.map((listing, index) => (
                <Table className="table-hover table-bordered w-75 mt-3" key={index}>
                <tbody key={index}>
                <tr>
                  <td><b>Business Name:</b> {listing.businessName}</td>
                  <td><b>Address:</b> {listing.address}</td>
                  <td><b>Phone Number:</b> {listing.phoneNumber}</td>
                </tr>
                <tr>
                    <td colSpan="2" ><b>Description:</b> {listing.businessDescription}</td>
                    <td><b>Discounts/Offers/Deals: </b>{listing.discounts}</td>
                </tr>
                <tr>
                    <td colSpan="3" className="text-center">
                        <img 
                            src={listing.images[0]} 
                            alt="Image 1" 
                            style={{ width: "30%", height: "auto", margin: "0 5px"}} 
                        />
                        <img 
                            src={listing.images[1]} 
                            alt="Image 2" 
                            style={{ width: "30%", height: "30%", margin: "0 5px"}} 
                        />
                        <img 
                            src={listing.images[2]} 
                            alt="Image 3" 
                            style={{ width: "30%", height: "30%", margin: "0 5px" }} 
                        />
                    </td>
                </tr>
                {/*List of reviews here*/}
                <tr>
                    <td colSpan="3">
                        <b>Reviews:</b>
                    </td>
                </tr>
                
                {listing.reviews.map((review, index) => (
                    <tr key={index}>
                        <td colSpan="3">
                            {review}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td colSpan="3">
                        {}
                    </td>
                </tr>
                {/*Enter reviews here*/}
                {/*User must be logged in to provide a review*/}
                {token !== 'auth' && 
                <tr>
                    <td colSpan="3">
                    
                        <Form noValidate onSubmit={(e) => 
                        handleSubmit(e, listing.listingTicketId, listing.businessName, listing.address, listing.phoneNumber, 
                            listing.businessDescription, listing.images, listing.discounts, listing.reviews, listing.creatorUsername)}>
                            <Row>
                                {/*User has to log in to provide a review*/}
                                
                                <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessReviews">
                                    <Form.Label><b>Enter Review:</b></Form.Label>
                                    <Form.Control required
                                        type="text"
                                        placeholder={Label.ENTER_REVIEW_DESCRIPTION}
                                        value={review}
                                        onChange={(e) => setReview(e.target.value)}
                                        
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault(); // Prevent the default "Enter" key behavior
                                            }
                                        }}/>
                                        {/*Suggestions from Copilot for onKeyDown() on 2025-04-10 after prompt 'Why is preventDefault() not working?'*/}
                                </Form.Group>
                                <Button type="submit" variant="success" className='m-1' style={{ width: 'auto', height: 'auto' }}>
                                    {Label.SUBMIT} 
                                </Button>
                                
                            </Row>
                        </Form>
                    </td>
                </tr>
                }
                {sessionStorage.getItem("username") === listing.creatorUsername && (
                    <tr>
                        <td colSpan="3">
                        
                            <div className="d-flex align-items-start flex-wrap">
                                <textarea className="form-control mb-2" style={{ flex: 1, minHeight: '100px', resize: 'vertical' }} value={summaryText} readOnly />
                                <Button variant="primary" className="ms-2 mb-2" style={{ whiteSpace: 'nowrap', height: 'fit-content' }} onClick={(e) => handleReviewSummary(e, listing)}>Summarize Feedback</Button>
                            </div>
                        </td>
                    </tr>
                )}
                {sessionStorage.getItem("username") === listing.creatorUsername && (
                    <tr>
                        <td colSpan="5" className='text-center'>
                            <Button variant='danger' className='m-1' onClick={() => handleDelete(listing.listingTicketId)}>{Label.DELETE_BTN}</Button>
                        </td>
                    </tr>
                )}
                </tbody>
                </Table>
              ))}
          </div>
        <CustomToast header={header} message={message} showA={showA} toggleShowA={toggleShowA} bg={bg}></CustomToast>
        {/*Footer*/}
        <div style={{ backgroundColor: "#6c757d", height: "50px" }}>
            <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>
        </div>
    </>
}

export default ViewBusinessComponent;