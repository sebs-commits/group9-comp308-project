import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_USER_REQUESTS } from "../../shared/gql/request.gql";
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const ResidentRequestList = ({ onEdit }) => {
  const loggedInUserId = sessionStorage.getItem("uid");

  const { loading, error, data } = useQuery(GET_USER_REQUESTS, {
    variables: { creatorId: loggedInUserId },
  });

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (data && data.userRequests) {
      setRequests(data.userRequests);
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
        Oops, something went wrong trying to fetch your requests
      </Alert>
    );
  }

  return (
    <div className="px-5 pb-4">
      <h4 className="pt-4 pb-2">My Requests</h4>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Type</th>
            <th>Request</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request, index) => (
            <tr key={request.id}>
              <td>{index + 1}</td>
              <td>{request.title}</td>
              <td>{request.type}</td>
              <td>{request.request}</td>
              <td>{request.location}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEdit(request)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResidentRequestList;
