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
import { useEffect } from 'react';

//#endregion

//#region Internal Imports
import { CREATE_BUSINESS_LISTING, GET_BUSINESS_LISTING, UPDATE_BUSINESS_LISTING } from '../../shared/gql/businesslisting.gql.js'; 
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import { Label, Message } from '../../shared/resources';
import { requestFormReset } from 'react-dom';
//#endregion

//github co-pilot suggestion on 2025-04-02: 'how could I add a regex to validate the phone number?'
const phoneNumberRegex = /^\(?([2-9][0-9]{2})\)?[-.●]?([2-9][0-9]{2})[-.●]?([0-9]{4})$/;
//end of suggestion


const CreateUpdateBusinessComponent = () => {

        const navigate = useNavigate();

        //#region States
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

        //listing images
        const [getImage1, setGetImage1] = useState(null);
        const [getImage2, setGetImage2] = useState(null);
        const [getImage3, setGetImage3] = useState(null);
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

            //makes sure imageList is not null
            const imageList = [getImage1, getImage2, getImage3].filter((image) => image !== null);

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
                            //pass the images
                            images: imageList, //pass the images
                            discounts: businessDeals,
                            reviews: data.listing?.reviews || [], // Use existing reviews if available, otherwise default to an empty array
                            creatorUsername: sessionStorage.getItem("username") || ''
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
                            images: imageList, //pass the images
                            discounts: businessDeals,
                            reviews: [], //no reviews on this page.
                            creatorUsername: sessionStorage.getItem("username") || ''
                        }
                    });
                    displayToastMsg(Label.SUCCESS, Message.BUSINESS_LISTING_SAVED_SUCCESSFULLY, "success");
                } catch(error) {
                    displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
                    console.error(`An error occurred while creating or updating a businessListing: `, error);
                    throw error;
                }
            }

                // Reset fields
                setBusinessListingId('');
                setBusinessName('');
                setAddress('');
                setBusinessPhone('');
                setBusinessDescription('');
                setBusinessDeals('');
                setGetImage1(null);
                setGetImage2(null);
                setGetImage3(null);
                navigate("/dashboard"); //go back to dashboard after submitting the form
        };       

        //get first image from the image from file (after btn click)
        const handleImage1Selected = (e) => {
            const image = e.target.files[0]; //get first file chosen
            //suggestion from copilot on 2025-04-02: 'how could I get the image URL from the file?'
            if (image) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    setGetImage1(fileReader.result); // Set the image to base64
                };
                fileReader.readAsDataURL(image); // Read the file as a Data URL
            }
            //end of suggestion
        };

        //get second image from the image from file (after btn click)
        const handleImage2Selected = (e) => {
            const image = e.target.files[0];//get first file chosen
            //suggestion from copilot on 2025-04-02: 'how could I get the image URL from the file?'
            if (image) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    setGetImage2(fileReader.result); // Set the image to base64
                };
                fileReader.readAsDataURL(image); // Read the file as a Data URL
            }
            //end of suggestion
        };
        //get third image from the image from file (after btn click)
        const handleImage3Selected = (e) => {
            const image = e.target.files[0]; //get first file chosen
            //suggestion from copilot on 2025-04-02: 'how could I get the image URL from the file?'
            if (image) {
                const fileReader = new FileReader();
                fileReader.onload = () => {
                    setGetImage3(fileReader.result); // Set the image to base64
                };
                fileReader.readAsDataURL(image); // Read the file as a Data URL
            }
            //end of suggestion
        };

        //loads an existing business listing if the businessListingId is already in the DB to make it easier to update it.
        useEffect(() => {
            const fetch = async () => {
                try {
                    const result = await refetch({ listingTicketId: businessListingId });
                    //if listing exists, set the state variables to the values from the listing (only if the user owns this listing)
                    if (result?.data?.listing && sessionStorage.getItem("username") === result.data.listing.creatorUsername) {
                        //set the data to the fields on the form
                        setBusinessListingId(result.data.listing.listingTicketId);
                        setBusinessName(result.data.listing.businessName);
                        setAddress(result.data.listing.address);
                        setBusinessPhone(result.data.listing.phoneNumber);
                        setBusinessDescription(result.data.listing.businessDescription);
                        setBusinessDeals(result.data.listing.discounts);
                        setGetImage1(result.data.listing.images[0] || null);
                        setGetImage2(result.data.listing.images[1] || null);
                        setGetImage3(result.data.listing.images[2] || null);
                    }
                } catch (error) {
                    //reset the form except for the businessListingId if no match is found
                    setBusinessName('');
                    setAddress('');
                    setBusinessPhone('');
                    setBusinessDescription('');
                    setBusinessDeals('');
                    setGetImage1(null);
                    setGetImage2(null);
                    setGetImage3(null);
                    console.error("Error fetching business listing data: ", error);
                    displayToastMsg(Label.ERROR, Message.NO_BUSSINESS_LISTING_MATCH, "danger");
                }
            }
                fetch();
            }, [businessListingId]); //fetch when the businessListingId changes

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
                                      placeholder={Label.BUSINESS_NAME_DESCRIPTION}
                                      value={businessName}
                                      onChange={(e) => setBusinessName(e.target.value)}/>
                    </Form.Group>

                     {/**Adress */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessAddress">
                        <Form.Label>{Label.ADDRESS}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.ADDRESS_DESCRIPTION}
                                      value={businessAddress}
                                      onChange={(e) => setAddress(e.target.value)}/>
                    </Form.Group>

                     {/**Phone Number */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessPhone">
                        <Form.Label>{Label.BUSINESS_PHONE}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.BUSINESS_PHONE_DESCRIPTION}
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
                                      placeholder={Label.BUSINESS_DESCRIPTION_DESCRIPTION}
                                      onChange={(e) => setBusinessDescription(e.target.value)}/>
                    </Form.Group>     

                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="imageList">
                        <Form.Label>{Label.IMAGE_LIST}</Form.Label>

                        {/*Copilot boilerplate suggestion on 2025-04-02" 'how could I add a 1 row 3 column table at line 149?' and 
                        'then how could I add images in each cell?'. Mofifications include each table cell contents, removing the thead elements,
                        and cell as adding cells and content as needed*/}
                        <Table bordered className="mt-2">
                            <tbody>
                                <tr>
                                    <td>
                                        <img 
                                            src={getImage1} 
                                            alt="Image 1" 
                                            style={{ width: "100%", height: "auto" }} 
                                        />
                                        <input type='file' className='form-control' onChange={handleImage1Selected}/>

                                    </td>
                                    <td>
                                        <img 
                                            src={getImage2}
                                            alt="Image 2" 
                                            style={{ width: "100%", height: "auto" }} 
                                        />
                                        <input type='file' className='form-control' onChange={handleImage2Selected}/>
                                    </td>
                                    <td>
                                        <img 
                                            src={getImage3} 
                                            alt="Image 3" 
                                            style={{ width: "100%", height: "auto" }} 
                                        />
                                        <input type='file' className='form-control' onChange={handleImage3Selected}/>
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
         {/*Footer*/}
         <div style={{ backgroundColor: "#6c757d", height: "50px" }}>
            <p style={{fontWeight: "bold", paddingTop:"15px", fontSize:"12px", color: "#fecd00"}}>&copy; {Label.COPYRIGHT}</p>
        </div>
    </>
}

export default CreateUpdateBusinessComponent;