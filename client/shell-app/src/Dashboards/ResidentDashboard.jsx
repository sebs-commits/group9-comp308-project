//#region External 
import { Button, Card, Container, Row, Col, Pagination, ButtonGroup } from 'react-bootstrap';
import { FaPlusCircle } from "react-icons/fa";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//#endregion

//#region Internal
import { Label } from '../../shared/resources';
// import NewsCarouselComponent from '../../shared/components/NewsCarousel';
//#endregion

const data = [
    { col1: 'Row 1', col2: 'Data 1', col3: 'Info 1' },
    { col1: 'Row 2', col2: 'Data 2', col3: 'Info 2' },
    { col1: 'Row 3', col2: 'Data 3', col3: 'Info 3' },
    { col1: 'Row 4', col2: 'Data 4', col3: 'Info 4' },
    { col1: 'Row 5', col2: 'Data 5', col3: 'Info 5' },
    { col1: 'Row 6', col2: 'Data 6', col3: 'Info 6' },
    { col1: 'Row 7', col2: 'Data 7', col3: 'Info 7' },
    { col1: 'Row 8', col2: 'Data 8', col3: 'Info 8' },
    { col1: 'Row 9', col2: 'Data 9', col3: 'Info 9' },
    { col1: 'Row 10', col2: 'Data 10', col3: 'Info 10' },
    { col1: 'Row 11', col2: 'Data 11', col3: 'Info 11' },
    { col1: 'Row 12', col2: 'Data 12', col3: 'Info 12' },
];

export const ResidentDashboardComponent = () => {
    const navigate = useNavigate();

    //#region States    
    const [ username, setUsername ] = useState(sessionStorage.getItem('username') || '');
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(3); 
    //#endregion
                      
    const handleSelect = (selectedPage) => { setPage(selectedPage); };
  
    const paginatedData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return  <>
            <Container className="justify-content-center">
                {/**Welcome */}
                <Row className="pb-4"> <h3>{Label.setTitle(username)}</h3> </Row>

                {/**Carousel News */}
                {/* <Row> <NewsCarouselComponent/> </Row> */}

                {/**Add News, Alert, Request Buttons */}
                <Row className="justify-content-center pb-4">
                    <ButtonGroup style={{ width: "70%" }}>
                        <Button className='button' variant="success" onClick={(e) => { navigate("/news"); }}>
                                <FaPlusCircle />
                                <span style={{ paddingLeft: "5px"}} >{Label.NEWS}</span>
                        </Button>

                        <Button className='button' variant="danger" onClick={() => { navigate("/alerts") }}>
                                <FaPlusCircle />
                                <span style={{ paddingLeft: "5px"}}>{Label.ALERT}</span>
                        </Button>

                        <Button className='button' variant="primary" onClick={() => { navigate("/requests") }}>
                                <FaPlusCircle />
                                <span style={{ paddingLeft: "5px"}}>{Label.REQUEST}</span>
                        </Button>
                    </ButtonGroup>                                
                </Row>

                <Row className="px-4">
                    {/**Discussion Table*/}
                    <Col>
                        <span style={{marginBottom: "0px", paddingBottom: "0px", fontSize: "20px", fontWeight: "bold"}}>Discussions</span>
                        <Button size="lg" variant="link" style={{marginTop: "0px", paddingTop: "0px", marginBottom: "4px", color: "#158754"}}>
                            <FaPlusCircle/>
                        </Button>                    
                                            
                        {paginatedData.map((item, index) => (
                            <div key={index}>
                                <Card className='mb-3' bg="dark" style={{ maxHeight: "200px" }}>
                                    <Card.Body>
                                        <Card.Title style={{color: "white"}}>{item.col1}</Card.Title>
                                        <Card.Text style={{ maxWidth: "auto", color: "white"}}>
                                            {item.col2}                             
                                        </Card.Text>
                                        <Button className="button" variant="success">{item.col3}</Button>
                                    </Card.Body>
                                </Card>      
                            </div>
                        ))}

                        <Pagination>
                            {/* Previous Page Button */}
                            <Pagination.Prev onClick={() => setPage(page > 1 ? page - 1 : page)} disabled={page === 1} />
                            
                            {/* Page Number Buttons */}
                            {[...Array(Math.ceil(data.length / itemsPerPage))].map((_, index) => (
                            <Pagination.Item key={index} active={index + 1 === page} onClick={() => handleSelect(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                            ))}

                            {/* Next Page Button */}
                            <Pagination.Next onClick={() => setPage(page < Math.ceil(data.length / itemsPerPage) ? page + 1 : page)}
                            disabled={page === Math.ceil(data.length / itemsPerPage)} />
                        </Pagination>
                    </Col>

                    {/**Insight Table*/}
                    <Col>
                        <span style={{marginBottom: "0px", paddingBottom: "0px", fontSize: "20px", fontWeight: "bold"}}>Insights</span>
                        <Button size="lg" variant="link" style={{marginTop: "0px", paddingTop: "0px", marginBottom: "4px", color: "#158754"}}>
                            <FaPlusCircle/>
                        </Button>  
                        {paginatedData.map((item, index) => (
                            <div key={index}>
                                <Card className='mb-3' bg="dark">
                                    <Card.Body>
                                        <Card.Title style={{color: "white"}}>{item.col1}</Card.Title>
                                        <Card.Text style={{color: "white"}}>
                                            {item.col2}                                                    
                                        </Card.Text>
                                        <Button variant="primary">{item.col3}</Button>
                                    </Card.Body>
                                </Card>      
                            </div>
                        ))}

                        <Pagination>
                            {/* Previous Page Button */}
                            <Pagination.Prev
                                onClick={() => setPage(page > 1 ? page - 1 : page)}
                                disabled={page === 1}
                            />
                            
                            {/* Page Number Buttons */}
                            {[...Array(Math.ceil(data.length / itemsPerPage))].map((_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index + 1 === page}
                                onClick={() => handleSelect(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                            ))}

                            {/* Next Page Button */}
                            <Pagination.Next
                            onClick={() => setPage(page < Math.ceil(data.length / itemsPerPage) ? page + 1 : page)}
                            disabled={page === Math.ceil(data.length / itemsPerPage)}
                            />
                        </Pagination>
                    </Col>                               
                </Row>                       
            </Container>
            </>
}