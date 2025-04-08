//#region External Imports
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaUndo, FaPaperPlane } from "react-icons/fa";
import { useMutation, useQuery } from '@apollo/client';

//#endregion

//#region Internal Imports
import { CREATE_BUSINESS_LISTING, GET_BUSINESS_LISTING, UPDATE_BUSINESS_LISTING } from '../../shared/gql/businesslisting.gql.js'; 
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import { Label, Message } from '../../shared/resources';
//#endregion

//github co-pilot suggestion on 2025-04-02: 'how could I add a regex to validate the phone number?'
const phoneNumberRegex = /^\(?([2-9][0-9]{2})\)?[-.●]?([2-9][0-9]{2})[-.●]?([0-9]{4})$/;
//end of suggestion


const CreateUpdateNewsComponent = () => {
        const navigate = useNavigate();

        //#region States
        //const [creatorId, setCreatorId] = useState(sessionStorage.getItem("uid") || 'id'); 
        const [businessListingId, setBusinessListingId] = useState('');
        const [businessName, setBusinessName] = useState('');
        const [businessAddress, setAddress] = useState('');
        const [businessPhone, setBusinessPhone] = useState('');
        const [businessDescription, setBusinessDescription] = useState('');
        const [businessDeals, setBusinessDeals] = useState('');

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
        const [createBusinessListing] = useMutation(CREATE_BUSINESS_LISTING);
        const [updateBusinessListing] = useMutation(UPDATE_BUSINESS_LISTING);
        const { data, refetch } = useQuery(GET_BUSINESS_LISTING, {
            variables: { listingTicketId: businessListingId },
            skip: !businessListingId 
        });
        //#region GQL


        //makes sure to send deals to the news or dashboard?
        // or have them visible to users on the view business listing page

        //creeate a business listing later...

        //#endregion

        const handleSubmit = async (event) => {
            event.preventDefault();
            // Validate phone number
            if (!phoneNumberRegex.test(businessPhone)) {
                displayToastMsg(Label.ERROR, Message.PHONE_NUMBER_INVALID, "danger");
                return;
            }
            // Validate required fields
            if (businessListingId == "" || businessName == "" || businessAddress == "" || businessPhone == "" || businessDescription == "") {
                displayToastMsg(Label.ERROR, Message.MISSING_FIELDS, "danger");
                return;
            }
            // ***validate image list*** --> later!
            


            //validate if businessListingId already exists in the DB. If so, update it. If not, create a new one.
            //suggestion from copilot 2025-04-02: 'why does refetch({businessListingId}) return a nothing?'})'
            if(refetch({ listingTicketId: businessListingId }) && data && data.listing) {
            //end of suggestion
                // Business Listing ID already exists so then update the business listing
                try {
                    updateBusinessListing({
                        variables: {
                            listingTicketId: businessListingId,
                            businessName: businessName,
                            address: businessAddress,
                            phoneNumber: businessPhone,
                            businessDescription: businessDescription,
                            images: [], // --> **To be implemented later**
                            discounts: businessDeals
                        }
                    });
                    displayToastMsg(Label.SUCCESS, Message.BUSINESS_LISTING_UPDATED_SUCCESSFULLY, "success");
                } catch(error) {
                    displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
                    console.error(`An error occurred while creating or updating a businessListing: `, error);
                    throw error;
                }            
            } else {
                //create a new business listing
                try {
                    createBusinessListing({
                        variables: {
                            listingTicketId: businessListingId,
                            businessName: businessName,
                            address: businessAddress,
                            phoneNumber: businessPhone,
                            businessDescription: businessDescription,
                            images: [], // --> **To be implemented later**
                            discounts: businessDeals
                        }
                    });
                    displayToastMsg(Label.SUCCESS, Message.BUSINESS_LISTING_SAVED_SUCCESSFULLY, "success");
                } catch(error) {
                    displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
                    console.error(`An error occurred while creating or updating a businessListing: `, error);
                    throw error;
                }
            }
                setBusinessListingId('');
                setBusinessName('');
                setAddress('');
                setBusinessPhone('');
                setBusinessDescription('');
                setBusinessDeals('');
        };       

    return <>
        <div className="px-5 pb-4">
            <h4 className="pt-4 pb-2">{Label.BUSINESS_PAGE_TITLE}</h4>
            <Form noValidate onSubmit={handleSubmit}>
                <Row>

                    {/**Business Listing Ticket ID */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessListingId">
                        <Form.Label>{Label.BUSINESS_TICKET_ID}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.BUSINESS_TICKET_ID_DESCRIPTION}
                                      value={businessListingId}
                                      onChange={(e) => setBusinessListingId(e.target.value)}/>
                    </Form.Group>

                    {/**Business Name */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessName">
                        <Form.Label>{Label.BUSINESS_NAME}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.BUSINESS_NAME}
                                      value={businessName}
                                      onChange={(e) => setBusinessName(e.target.value)}/>
                    </Form.Group>

                     {/**Adress */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessAddress">
                        <Form.Label>{Label.ADDRESS}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.ADDRESS}
                                      value={businessAddress}
                                      onChange={(e) => setAddress(e.target.value)}/>
                    </Form.Group>

                     {/**Phone Number */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessPhone">
                        <Form.Label>{Label.BUSINESS_PHONE}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.BUSINESS_PHONE}
                                      value={businessPhone}
                                      onChange={(e) => setBusinessPhone(e.target.value)}/>
                    </Form.Group>

                    {/**Business Description */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessDescription">
                        <Form.Label>{Label.BUSINESS_DESCRIPTION}</Form.Label>
                        <Form.Control required 
                                      as="textarea" 
                                      rows={3} 
                                      value={businessDescription}
                                      placeholder={Label.BUSINESS_DESCRIPTION}
                                      onChange={(e) => setBusinessDescription(e.target.value)}/>
                    </Form.Group>     

                    {/**Image List ***TO BE ADDED LATER** */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="imageList">
                        <Form.Label>{Label.IMAGE_LIST}</Form.Label>

                        {/*Copilot boilerplate suggestion on 2025-04-02" 'how could I add a 1 row 3 column table at line 149?' and 'then how could I add images in each cell?'*/}
                        <Table bordered className="mt-2">
                            <thead>
                                <tr>
                                    <th>Image 1</th>
                                    <th>Image 2</th>
                                    <th>Image 3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <img 
                                            //src="" 
                                            alt="Image 1" 
                                            style={{ width: "100%", height: "auto" }} 
                                        />
                                        <Button 
                                            variant="primary" 
                                            className="mt-2"
                                            onClick={() => console.log('Button 1 clicked')}>
                                                Find Image 1
                                        </Button>
                                    </td>
                                    <td>
                                        <img 
                                            //src=
                                            alt="Image 2" 
                                            style={{ width: "100%", height: "auto" }} 
                                        />
                                        <Button 
                                            variant="primary" 
                                            className="mt-2"
                                            onClick={() => console.log('Button 2 clicked')}>
                                                Find Image 2
                                        </Button>
                                    </td>
                                    <td>
                                        <img 
                                            //src= 
                                            alt="Image 3" 
                                            style={{ width: "100%", height: "auto" }} 
                                        />
                                        <Button 
                                            variant="primary" 
                                            className="mt-2"
                                            onClick={() => console.log('Button 3 clicked')}>
                                                Find Image 3
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>  
                        {/*End of suggestion on 2025-04-02*/}
                    </Form.Group>

                    {/**Business Deals List */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessDeals">
                        <Form.Label>{Label.BUSINESS_DEALS}</Form.Label>
                        <Form.Control required 
                                      as="textarea" 
                                      rows={3} 
                                      value={businessDeals}
                                      placeholder={Label.BUSINESS_DEALS_DESCRIPTION}
                                      onChange={(e) => setBusinessDeals(e.target.value)}/>
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

export default CreateUpdateNewsComponent;