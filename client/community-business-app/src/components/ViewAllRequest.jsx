import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_REQUESTS } from "../../shared/gql/request.gql";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

const ViewAllRequest = () => {
  const { loading, error, data } = useQuery(GET_REQUESTS);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (data && data.requests) {
      setRequests(data.requests);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center my-5">
        Oops, something went wrong trying to fetch the requests
      </Alert>
    );
  }

  return (
    <Container fluid className="text-light">
      <h4 className="pt-4 pb-3 text-center">All Requests</h4>
      <Row className="g-4">
        {requests.map((request) => (
          <Col key={request.id} xl={3} lg={4} md={6} sm={6} className="mb-4">
            <Card className="bg-dark text-light h-100 border border-secondary rounded-4 opacity-75">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="text-start fw-bold">
                  {request.title}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-start text-light-emphasis">
                  {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                </Card.Subtitle>
                <Card.Text className="text-start flex-grow-1 medium">
                  {request.request}
                </Card.Text>
                <div className="text-start text-light mt-auto small">
                  Location: {request.location}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ViewAllRequest;
