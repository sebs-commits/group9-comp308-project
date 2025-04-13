import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { format, parseISO } from "date-fns";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  Alert,
  Row,
  Col,
  ListGroup,
} from "react-bootstrap";

import CreateNewDiscussionForm from "./CreateNewDiscussionForm";

import {
  GET_ALL_DISCUSSIONS,
  CREATE_DISCUSSION,
  ADD_REPLY_TO_DISCUSSION,
} from "../../shared/gql/discussions.gql.js";

const formatCreationDate = (dateValue) => {
  try {
    return format(parseISO(dateValue), "MMMM d, yyyy h:mm a");
  } catch (error) {
    console.error("Issue formatting the date", error);
    return "Invalid date" + error;
  }
};

const LoadingState = () => (
  <div className="text-center py-5">
    <Spinner animation="border" variant="primary" />
  </div>
);
const ErrorState = () => (
  <Alert variant="danger" className="text-center mt-4">
    Error loading 
  </Alert>
);


const GeneralDiscussions = () => {
  const currentUserId = sessionStorage.getItem("uid") || null;
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionText, setNewDiscussionText] = useState("");
  const [replyTexts, setReplyTexts] = useState({});

  const { loading, error, data, refetch } = useQuery(GET_ALL_DISCUSSIONS);

  const [
    createDiscussion,
    { loading: creatingDiscussion, error: createError },
  ] = useMutation(
    CREATE_DISCUSSION,
    { onCompleted: () => refetch() }
  );

  const [addReply, { loading: addingReply }] = useMutation(
    ADD_REPLY_TO_DISCUSSION,
    { onCompleted: () => refetch() } 
  );

  const handleDiscussionSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("You must be logged in to post.");
      return;
    }
    if (!newDiscussionTitle.trim() || !newDiscussionText.trim()) return;
    try {
      await createDiscussion({
        variables: {
          title: newDiscussionTitle,
          description: newDiscussionText,
          creatorId: currentUserId,
          newsId: null,
        },
      });
      setNewDiscussionTitle("");
      setNewDiscussionText("");
    } catch (err) {
      console.error("Error creating discussion:", err);
    }
  };

  const handleReplyChange = (discussionId, text) => {
    setReplyTexts((prev) => ({ ...prev, [discussionId]: text }));
  };

  const handleReplySubmit = async (e, discussionId) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Log in to reply");
      return;
    }
    const text = replyTexts[discussionId];
    if (!text || !text.trim()) return;
    try {
      await addReply({
        variables: { discussionId, creatorId: currentUserId, text },
      });
      setReplyTexts((prev) => ({ ...prev, [discussionId]: "" }));
    } catch (err) {
      console.error("Error adding reply", err);
    }
  };

  // Sort discussions by date
  const discussions = data?.discussions
    ? [...data.discussions].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    : [];

  const renderDiscussionList = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState />;

    return discussions.map((discussion) => (
      <Card
        key={discussion._id}
        className="bg-dark border-secondary mb-4 shadow-sm text-start"
      >
        <Card.Header className="border-secondary">
          <h5 className="mb-1 text-light">{discussion.title}</h5>
          <small className="text-secondary">
            Started by ID: {discussion.creatorId}
            {formatCreationDate(discussion.createdAt)}
          </small>
        </Card.Header>
        <Card.Body>
          <Card.Text className="text-light mb-3">
            {discussion.description}
          </Card.Text>
          {/* Replies section */}
          {discussion.replies && discussion.replies.length > 0 && (
            <div className="mt-3">
              <h6 className="text-light small mb-2">Replies:</h6>
              <ListGroup variant="flush">
                {discussion.replies.map((reply) => (
                  <ListGroup.Item
                    key={reply._id}
                    className="bg-secondary border-dark rounded text-light py-2 px-3"
                  >
                    <p className="mb-1 small ws-pre-wrap">{reply.text}</p>
                    <p className="small text-light mb-0">
                      By ID: {reply.creatorId}
                      {formatCreationDate(reply.createdAt)}
                    </p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </Card.Body>
        {/* Reply form */}
        {currentUserId && (
          <Card.Footer className=" border-dark">
            <Form
              onSubmit={(e) => handleReplySubmit(e, discussion._id)}
              className="d-flex gap-2"
            >
              <Form.Control
                type="text"
                size="sm"
                className="bg-dark text-light border-secondary placeholder-light"
                placeholder="Reply..."
                value={replyTexts[discussion._id] || ""}
                onChange={(e) =>
                  handleReplyChange(discussion._id, e.target.value)
                }
                required
              />
              <Button
                variant="success"
                size="sm"
                type="submit"
                disabled={addingReply}
              >
                Reply
              </Button>
            </Form>

          </Card.Footer>
        )}
      </Card>
    ));
  };
  return (
    <Container className="py-5 text-light">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h2 className="mb-5 text-center">General Discussions</h2>

          {/* Render the form only if the user is logged in*/}
          {currentUserId && (
            <CreateNewDiscussionForm
              onSubmit={handleDiscussionSubmit}
              title={newDiscussionTitle}
              onTitleChange={(e) => setNewDiscussionTitle(e.target.value)}
              text={newDiscussionText}
              onTextChange={(e) => setNewDiscussionText(e.target.value)}
              loading={creatingDiscussion}
              error={createError}
            />
          )}

          {/* Render the discussion list */}
          {renderDiscussionList()}
        </Col>
      </Row>
    </Container>
  );
};

export default GeneralDiscussions;
