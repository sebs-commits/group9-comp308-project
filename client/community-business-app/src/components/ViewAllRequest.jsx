import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_REQUESTS } from "../../shared/gql/request.gql";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

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
    <div className="px-5 pb-4">
      <h4 className="pt-4 pb-2 text-center">All Requests</h4>
      <Row className="g-4">
        {requests.map((request) => (
          <Col key={request.id} md={4} sm={6}>
            <Card>
              <Card.Body>
                <Card.Title>{request.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {request.type}
                </Card.Subtitle>
                <Card.Text>{request.request}</Card.Text>
                <Card.Footer className="text-muted">
                  Location: {request.location}
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ViewAllRequest;
