//#region External Imports
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
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
        const [creatorId, setCreatorId] = useState(sessionStorage.getItem("uid") || 'id');
        const [headline, setHeadline] = useState('');
        const [summary, setSummary] = useState('');
        const [fullnews, setFullNews] = useState('');
        const [expiryDate, setExpiryDate] = useState('');

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
        const [createNews] = useMutation(CREATE_NEWS);
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
                displayToastMsg(Label.ERROR, Message.INVALID_DATE, "danger");
                return;
            }
    
            try {
                await createNews({ variables: { creatorId, headline, summary, fullnews, creationDate: formattedDate, expiryDate } })    
                displayToastMsg(Label.SUCCESS, Message.NEWS_SAVED_SUCCESSFULLY, "success");

                setHeadline('');
                setSummary('');
                setFullNews('');
                setExpiryDate('');

            } catch(error) {
                displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
                console.error(`An error occurred while creating or updating a news: `, error);
                throw error;
            }
        };       

    return <>
        <div className="px-5 pb-4">
            <h4 className="pt-4 pb-2">{Label.setNewsTitle(true ? Label.CREATE : Label.UPDATE)}</h4>
            <Form noValidate onSubmit={handleSubmit}>
                <Row>
                    {/**Headline */}
                    <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="headline">
                        <Form.Label>{Label.HEADLINE}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.HEADLINE}
                                      value={headline}
                                      onChange={(e) => setHeadline(e.target.value)}/>
                    </Form.Group>

                     {/**Summary */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="summary">
                        <Form.Label>{Label.SUMMARY}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.SUMMARY}
                                      value={summary}
                                      onChange={(e) => setSummary(e.target.value)}/>
                    </Form.Group>

                    {/**Full News */}
                    <Form.Group className="py-2" as={Col} md={{ span: 6, offset: 3 }} controlId="fullnews">
                        <Form.Label>{Label.NEWS}</Form.Label>
                        <Form.Control required 
                                      as="textarea" 
                                      rows={3} 
                                      value={fullnews}
                                      placeholder={Label.NEWS}
                                      onChange={(e) => setFullNews(e.target.value)}/>
                    </Form.Group>     

                    {/**Expiry Date */}
                     <Form.Group className="pb-2" as={Col} md={{ span: 6, offset: 3 }} controlId="expiryDate">
                        <Form.Label>{Label.EXPIRY_DATE}</Form.Label>
                        <Form.Control required
                                      type="text"
                                      placeholder={Label.EXPIRY_DATE}
                                      value={expiryDate}
                                      onChange={(e) => setExpiryDate(e.target.value)}/>
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