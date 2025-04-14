import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FaUndo, FaPaperPlane } from "react-icons/fa";
import { useMutation } from "@apollo/client";
import { CREATE_REQUEST, UPDATE_REQUEST } from "../../shared/gql/request.gql";
import { Label, Message } from "../../shared/resources";
import CustomToast from "../../../shell-app/shared/components/CustomToast";
import ResidentRequestList from "./ResidentRequestList";

// Matches the backend type list
const REQUEST_TYPE = {
  HELP: "help",
  MAINTENANCE: "maintenance",
  ACCOMMODATION: "accommodation",
  DONATION: "donation",
};

// Matches the backend location list
const LOCATIONS = [
  "Toronto",
  "Mississauga",
  "Brampton",
  "Markham",
  "Vaughan",
  "Oakville",
];

const CreateUpdateRequestComponent = () => {
  const navigate = useNavigate();

  //#region States
  const [creatorId] = useState(sessionStorage.getItem("uid") || "id");
  const [title, setTitle] = useState("");
  const [type, setType] = useState(REQUEST_TYPE.HELP);
  const [request, setRequest] = useState("");
  const [location, setLocation] = useState(LOCATIONS[0]); // Default to the first location
  const [editingRequestId, setEditingRequestId] = useState(null); // Track the request being edited

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
  };
  //#endregion

  //#region GQL
  const [createRequest] = useMutation(CREATE_REQUEST);
  const [updateRequest] = useMutation(UPDATE_REQUEST);
  //#endregion

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      displayToastMsg(Label.ERROR, Message.INVALID_FORM, "danger");
      event.stopPropagation();
      return;
    }

    try {
      if (editingRequestId) {
        await updateRequest({
          variables: {
            _id: editingRequestId,
            creatorId,
            title,
            type,
            request,
            location,
          },
        });
        displayToastMsg(
          Label.SUCCESS,
          Message.REQUEST_UPDATED_SUCCESSFULLY,
          "success"
        );
      } else {
        // Create request logic
        await createRequest({
          variables: { creatorId, title, type, request, location },
        });
        displayToastMsg(
          Label.SUCCESS,
          Message.REQUEST_SAVED_SUCCESSFULLY,
          "success"
        );
      }

      // Reset form fields
      setTitle("");
      setType(REQUEST_TYPE.HELP);
      setRequest("");
      setLocation(LOCATIONS[0]); // Reset to default location
      setEditingRequestId(null);
    } catch (error) {
      displayToastMsg(Label.ERROR, Message.TRY_AGAIN, "danger");
      console.error(
        `An error occurred while creating or updating a request: `,
        error
      );
    }
  };

  const handleEdit = (request) => {
    // Populate form fields
    setTitle(request.title);
    setType(request.type);
    setRequest(request.request);
    setLocation(request.location);
    setEditingRequestId(request.id); // Set the id of the request being edited
  };

  return (
    <>
      <div className="px-5 pb-4">
        <h4 className="pt-4 pb-2">
          {editingRequestId ? Label.UPDATE : Label.CREATE}
        </h4>
        <Form noValidate onSubmit={handleSubmit}>
          <Row>
            {/** Title */}
            <Form.Group
              className="pb-2"
              as={Col}
              md={{ span: 6, offset: 3 }}
              controlId="headline"
            >
              <Form.Label>{Label.TITLE}</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder={Label.TITLE}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            {/** Type */}
            <Form.Group
              className="py-2"
              as={Col}
              md={{ span: 6, offset: 3 }}
              controlId="type"
            >
              <Form.Label>{Label.TYPE}</Form.Label>
              <Form.Select
                required
                onChange={(e) => setType(e.target.value)}
                value={type}
              >
                <option value={REQUEST_TYPE.HELP}>{Label.HELP}</option>
                <option value={REQUEST_TYPE.MAINTENANCE}>
                  {Label.MAINTENANCE}
                </option>
                <option value={REQUEST_TYPE.ACCOMMODATION}>
                  {Label.ACCOMMODATION}
                </option>
                <option value={REQUEST_TYPE.DONATION}>{Label.DONATION}</option>
              </Form.Select>
            </Form.Group>

            {/** Request */}
            <Form.Group
              className="py-2"
              as={Col}
              md={{ span: 6, offset: 3 }}
              controlId="request"
            >
              <Form.Label>{Label.REQUEST}</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={3}
                placeholder={Label.REQUEST}
                value={request}
                onChange={(e) => setRequest(e.target.value)}
              />
            </Form.Group>

            {/** Location */}
            <Form.Group
              className="py-2"
              as={Col}
              md={{ span: 6, offset: 3 }}
              controlId="location"
            >
              <Form.Label>{Label.LOCATION}</Form.Label>
              <Form.Select
                required
                onChange={(e) => setLocation(e.target.value)}
                value={location}
              >
                {LOCATIONS.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Button
            variant="secondary"
            className="button mx-2 my-2"
            onClick={() => {
              navigate("/dashboard");
            }}
          >
            <FaUndo />
            <span style={{ paddingLeft: "5px" }}>{Label.BACK} </span>
          </Button>
          <Button type="submit" variant="success" className="button mx-2 my-2">
            <FaPaperPlane />
            <span style={{ paddingLeft: "5px" }}> {Label.SUBMIT} </span>
          </Button>
        </Form>
        {/* Gonna pass down the toast as a prop */}

        <ResidentRequestList
          onEdit={handleEdit}
          displayToastMsg={displayToastMsg}
        />

        <CustomToast
          header={header}
          message={message}
          showA={showA}
          toggleShowA={toggleShowA}
          bg={bg}
        />
      </div>
    </>
  );
};

export default CreateUpdateRequestComponent;
