//#region External Imports
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { FaUndo, FaPaperPlane } from "react-icons/fa";
import { useMutation } from '@apollo/client';

//#endregion

//#region Internal Imports
import { CREATE_NEWS } from '../../shared/gql/news.gql'; 
import CustomToast from '../../../shell-app/shared/components/CustomToast';
import { Label, Message } from '../../shared/resources';
//#endregion

const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;

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

        //#region GQL

        //creeate a business listing later...

        //#endregion


        const handleSubmit = async (event) => {
            event.preventDefault();
            const form = event.currentTarget; 
            
            const date = new Date();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();

            const formattedDate = `${month}/${day}/${year}`;
                                            
            if (form.checkValidity() === false) {                
                displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
                event.stopPropagation();
                return;
            }

            if(!regex.test(expiryDate)) {
                displayToastMsg(Label.ERROR, Message.BUSINESS_LISTING_SAVE_UNSUCCESSFULLY, "danger");
                return;
            }
    
            try {

                displayToastMsg(Label.SUCCESS, Message>BUSINESS_LISTING_SAVE_UNSUCCESSFULLY, "success");

                setBusinessListingId('');
                setBusinessName('');
                setAddress('');
                setBusinessPhone('');
                setBusinessDescription('');
                setBusinessDeals('');

            } catch(error) {
                displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
                console.error(`An error occurred while creating or updating a businessListing: `, error);
                throw error;
            }
        };       

    return <>
        <div className="px-5 pb-4">
            <h4 className="pt-4 pb-2">{Label.BUSINESS_TICKET_ID}</h4>
            <Form noValidate onSubmit={handleSubmit}>
                <Row>

                    {/**Business Listing Ticket ID */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="businessListingId">
                        <Form.Label>{Label.BUSINESS_TICKET_ID}</Form.Label>
                        <Form.Control required
                                      type="number"
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
                                            src="https://via.placeholder.com/150" 
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
                                            src="https://via.placeholder.com/150" 
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
                                            src="https://via.placeholder.com/150" 
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