import React, { useEffect, useState } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import {
  GET_USER_REQUESTS,
  DELETE_REQUEST,
} from "../../shared/gql/request.gql";
import { GET_USERS, GET_USER, UPDATE_VOLUNTEER } from '../../../authentication-app/shared/gql/authentication.gql';
import Table from "react-bootstrap/Table";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { Label, Message } from '../../shared/resources';

const GET_ASSISTANCE = gql`
    query RequestAssistance($prompt: String!) {
        requestAssistance(prompt: $prompt)
    }
`;

const ResidentRequestList = ({ onEdit, displayToastMsg }) => {
  const loggedInUserId = sessionStorage.getItem("uid");
  const [uid, setUid]= useState("");

  const { loading, error, data, refetch } = useQuery(GET_USER_REQUESTS, {
    variables: { creatorId: loggedInUserId },
  });

  const [deleteRequest] = useMutation(DELETE_REQUEST);

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (data && data.userRequests) {
      setRequests(data.userRequests);
    }
  }, [data]);

  const handleDelete = async (requestId) => {
    try {
      await deleteRequest({
        variables: { _id: requestId },
      });
      refetch();
      displayToastMsg("Success", "Request deleted successfully", "success");
    } catch (error) {
      displayToastMsg("Error", "Could not delete the request", "danger");
      console.error("Error deleting", error);
    }
  };

  // --- REQUEST SERVER'S AI QUERY
  const { refetch: fetchAssistance } = useQuery(GET_ASSISTANCE, {
      variables: { prompt: "" },
      skip: true, // won't run automatically (useful don't remove)
  });

  // --- REQUEST SERVER'S USERS QUERY
  const { refetch: fetchUsers } = useQuery(GET_USERS, {
      skip: true, // won't run automatically (useful don't remove)
  });
  const [filteredVolunteers, setFilteredVolunteers] = useState([]);
  useEffect(() => {
      if (filteredVolunteers.length > 0) {
          console.log("Updated volunteers:", filteredVolunteers);
      
          const promises = filteredVolunteers.map((voluteer) => {
              setUid(voluteer.id);
              return sendSuggestionToVolunteer(voluteer.id);  // Call the function for each volunteerId
          });
  
          // Wait for all promises to resolve (or reject)
          const res = async () => {
              await Promise.all(promises);
          }

          res();
      }

      console.log("filteredVolunteers: ", filteredVolunteers);
  }, [filteredVolunteers]);
  const [latestRequest, setLatestRequest] = useState(null);

  // --- THIS IS THE FUNCTION I WANT TO FOCUS ON
      const handleVolunteers = async (e, request) => {
          e.preventDefault();

          setLatestRequest(request);
  
          displayToastMsg(Label.INFO, "Suggested volunteers can take a moment to load...", "info");
  
          try{
              const usersResult = await fetchUsers();
              const users = usersResult?.data?.users || [];
              console.log("UsersFound: ", users);
  
              if (!users || !users[0]) { throw new Error("No users returned from auth-microservice"); }
  
              const prompt = `
                  Given the request's 
                      title: "${request?.title}", 
                      description: "${request?.request}", 
                      and location: "${request?.location}", 
                  suggest volunteers based on the theme and location of the event compared to their interests and location.
                  ${users
                      ?.filter(
                        (user) =>
                          user.interests !== "None" && // if volunteer has an interest
                          user.location !== "Nowhere" && // if volunteer has an location
                          !user.ignoredMatches?.includes(request.id) && // if volunteer didn't ignore the request
                          !user.requestMatches?.includes(request.id) // if volunteer isn't yet matched with the request
                      )
                      .map(
                        (user) =>
                          `   - {id: ${user.id}, email: ${user.email}, interests: ${user.interests}, location: ${user.location}}`
                      )
                      .join('\n')
                  }
  
                  Volunteers who have ignored this event's id or don't have an interest or location that accurately match this event should be ignored.
                  Only respond in this exact format: "volunteerId|volunteerId|..." *by ... I mean keep repeating the "volunteerId|" pattern, AND the full string shouldn't end in "|".
              `;
  
              const { data } = await fetchAssistance({ prompt });
  
              if (!data || !data.requestAssistance) { throw new Error("No data returned from AI"); }
  
              const resultText = data.requestAssistance;
              console.log("AI Result:", resultText);
              //const resultText = "67f98454f863585bd717f3e0";
  
              const volunteers = resultText.split("|").map(v => v.trim());
  
              if (!volunteers) { displayToastMsg(Label.ERROR, "AI response format incorrect", "danger"); return; }
  
              await setFilteredVolunteers(users.filter(
                  (user) => volunteers.includes(String(user.id))
              ));
  
              console.log("Volunteers: ", volunteers);
          } catch (err) {
              console.error("Error fetching assistance:", err);
              displayToastMsg(Label.ERROR, "Failed to get new suggested volunteers", "danger");
          }
      };

      const { refetch: fetchUser } = useQuery(GET_USER, {
          variables: { id: uid },
          skip: !uid
      });
  
      const [ updateVolunteer ] = useMutation(UPDATE_VOLUNTEER)
         
      const sendSuggestionToVolunteer = async (volunteerId) => {
  
          if (!volunteerId || volunteerId === "" || volunteerId.trim() === "") { displayToastMsg(Label.ERROR, "No volunteer ID provided", "danger"); return; }
          console.log("Volunteer ID: ", volunteerId);
  
          try {
              const {data} = await fetchUser({id: volunteerId});           
              console.log("Fetched user data:", data?.user);  // Log the response
  
              if (!data || !data.user) { throw new Error("No userData returned from service"); }
  
              const id = data.user.id;
              const interests = data.user.interests;
              const location = data.user.location;
              const eventMatches = data.user.eventMatches;
              const newRequestMatches = data.user.requestMatches === "" ? (data.user.requestMatches, latestRequest.id) : (data.user.requestMatches, "|", latestRequest.id);
              const ignoredMatches = data.user.ignoredMatches;
  
              console.log("UpdateVolunteer: ", id, ", ", interests, ", ", location, ", ", eventMatches, ", ", newRequestMatches, ", ", ignoredMatches);
              await updateVolunteer({ variables: { id, interests, location, eventMatches, requestMatches: newRequestMatches, ignoredMatches } });
  
              displayToastMsg(Label.SUCCESS, Message.USER_VOLUNTEER_UPDATED_SUCCESSFULLY, "success");
          } catch (error) {
              console.error(("Error sending suggestion to volunteer: ", volunteerId), error);
              displayToastMsg(Label.ERROR, ("Failed to send suggestion to volunteer: ", volunteerId), "danger");
          }
  
      }

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
            {filteredVolunteers.length > 0 && (
              <th>Suggested Volunteers</th>
            )}
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
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDelete(request.id)}
                >
                  Delete
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-2"
                  onClick={(e) => handleVolunteers(e, request)}
                >
                  Suggest Volunteers
                </Button>
              </td>
              {filteredVolunteers.length > 0 && (
                <td>
                  {filteredVolunteers.map((user) => (
                      <div 
                          key={user.id} 
                          style={{ 
                              backgroundColor: '#f0f0f0', 
                              padding: '10px', 
                              borderRadius: '5px', 
                              marginBottom: '10px'
                          }}
                      >
                          <strong style={{ color: 'black' }}>Sent Suggestion To {user.username} at {user.email}</strong>
                      </div>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ResidentRequestList;
