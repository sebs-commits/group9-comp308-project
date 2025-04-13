//#region External Imports
import { Col, Row, Table, Pagination, Button, Modal } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { FaTrash } from "react-icons/fa";
//#endregion

//#region Internal Imports
import { EventsContext } from '../../shared/contexts/events';
import { Label, Message } from '../../shared/resources';
//#endregion

const DisplayEvents = () => { 
    const { initEvent, events, removeEventFromEvents } = useContext(EventsContext);

    //#region States
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(9); 
    const [show, setShow] = useState(false);
    const [idToDelete, setIdToDelete] = useState("");
    //#endregion

    const handleSelect = (selectedPage) => { setPage(selectedPage); };

    const paginatedData = events.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleClose = () => setShow(false);   
    
    const onDelete = (e, id) => {
        e.stopPropagation();
        setIdToDelete(id);
        setShow(true);
    }

    const handleDelete = async (e) => {
        e.stopPropagation();
        await removeEventFromEvents(idToDelete);
        handleClose();        
    }

    const handleEdit = (e, event) => {
        e.preventDefault();
        initEvent(event);
    }

    return (
        <div className="pb-4 px-3">
            <Row className="d-flex justify-content-center align-items-center">
                <Col xs={12} md={6}>
                    <h4 className="pt-4 pb-2" style={{color: "black"}}>{Label.YOUR_EVENTS}</h4>
                </Col>               
            </Row>

            {paginatedData?.length === 0 ?                 
                <> 
                    {/**No events */}
                    <h5 style={{paddingTop: "50px"}}>{Message.NO_EVENTS_TO_DISPLAY}</h5> 
                </> : 

                <Row className="d-flex justify-content-center align-items-center">
                    <Col>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>{Label.TITLE}</th>
                                    <th style={{ width: "10%" }}></th>
                                </tr>
                            </thead>

                            <tbody>
                                {paginatedData?.map((e, i) => {
                                    return (
                                        <tr key={e.id} onClick={(event) => { handleEdit(event, e) }} style={{cursor: "pointer"}}>
                                            <td>{e.title}</td>
                                            <td>
                                                <Button type="button" variant="danger" onClick={(event) => { onDelete(event, e.id) }}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>

                        <Pagination style={{ paddingTop: "18px" }}>
                            {/* Previous Page Button */}
                            <Pagination.Prev onClick={() => setPage(page > 1 ? page - 1 : page)} disabled={page === 1} />
                            
                            {/* Page Number Buttons */}
                            {[...Array(Math.ceil(events.length / itemsPerPage))].map((_, index) => (
                            <Pagination.Item key={index} active={index + 1 === page} onClick={() => handleSelect(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                            ))}

                            {/* Next Page Button */}
                            <Pagination.Next onClick={() => setPage(page < Math.ceil(paginatedData.length / itemsPerPage) ? page + 1 : page)}
                            disabled={page === Math.ceil(paginatedData.length / itemsPerPage)} />
                        </Pagination>
                    </Col>                    
                </Row>
            } 

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{Label.DELETE}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{Message.PERMANENT_ACTION}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>{Label.CANCEL}</Button>
                    <Button variant="danger" onClick={handleDelete}> {Label.DELETE} </Button>
                </Modal.Footer>
            </Modal>            
        </div>
    )    
}

export default DisplayEvents;