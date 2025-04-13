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
import { Link } from "react-router-dom";
import { gql } from "@apollo/client";

import CreateNewDiscussionForm from "./CreateNewDiscussionForm";
import { Label, Message } from "../../shared/resources";

import {
  GET_ALL_DISCUSSIONS,
  CREATE_DISCUSSION,
  ADD_REPLY_TO_DISCUSSION,
} from "../../shared/gql/discussions.gql.js";

// AI Query
const GET_ASSISTANCE = gql`
    query RequestAssistance($prompt: String!) {
        requestAssistance(prompt: $prompt)
    }
`;

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
  const [summaryTexts, setSummaryTexts] = useState({});

  // State for Toast notifications
  const [message, setMessage] = useState("");
  const [header, setHeader] = useState("");
  const [bg, setBg] = useState("");
  const [showA, setShowA] = useState(false);

  const { loading, error, data, refetch } = useQuery(GET_ALL_DISCUSSIONS);

  const [
    createDiscussion,
    { loading: creatingDiscussion, error: createError },
  ] = useMutation(CREATE_DISCUSSION, { onCompleted: () => refetch() });

  const [addReply, { loading: addingReply }] = useMutation(
    ADD_REPLY_TO_DISCUSSION,
    { onCompleted: () => refetch() }
  );

  // --- REQUEST SERVER'S AI QUERY
  const { refetch: fetchAssistance } = useQuery(GET_ASSISTANCE, {
    variables: { prompt: "" },
    skip: true, // won't run automatically
  });

  // --- Toast Related ---
  const toggleShowA = () => setShowA(!showA);
  const displayToastMsg = (header, message, bg) => {
      toggleShowA();
      setHeader(header);
      setMessage(message);
      setBg(bg);
  }

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

  // --- AI Summarizer Handler ---
  const handleDiscussionSummary = async (e, discussion) => {
    e.preventDefault();

    const prompt = `
        Given the discussion post
            title: "${discussion?.title}",
            description: "${discussion?.description}",
        and its replies:
        ${discussion?.replies?.map((reply) => `   - ${reply.text}`).join('\n')}

        provide a summary of the entire discussion, and point out the major points made.
        Keep in mind rude or simple feedback should not be focused on, and the summary should be strictly professional.
        The summary should be less than 100 words.
    `;

    displayToastMsg(Label.INFO, "Summarized Feedback can take a moment to load...", "info");

    try{
        const { data } = await fetchAssistance({ prompt });

        if (!data || !data.requestAssistance) {
            throw new Error("No data returned from AI");
        }

        const summaryText = data.requestAssistance;

        if (!summaryText) {
          displayToastMsg(Label.ERROR, "AI response gave incorrect output", "danger");
          return;
        }

        setSummaryTexts((prev) => ({ ...prev, [discussion._id]: summaryText }));
        displayToastMsg(Label.SUCCESS, "AI response received", "success");
    } catch (err) {
        console.error("Error fetching assistance:", err);
        displayToastMsg(Label.ERROR, "Failed to get summary", "danger");
    }
  };

  const renderDiscussionList = () => {
    if (loading) return <LoadingState />;
    if (error) return <ErrorState />;

    return discussions.map((discussion) => (
      <Card
        key={discussion._id}
        className="bg-dark border-secondary mb-4 shadow-sm text-start"
      >
        <Card.Header className="border-secondary">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-1 text-light">{discussion.title}</h5>
              <small className="text-secondary p-2">
                Started by ID: {discussion.creatorId}
                {formatCreationDate(discussion.createdAt)}
              </small>
            </div>
            <small className="text-end">
              {/* Only render this if the discussion has a related news post*/}
              {discussion.newsId && (
                <>
                  <Link to={`/news/${discussion.newsId}`} className="p-2 ">
                    <Button variant="outline-info" size="sm">
                      View news post
                    </Button>
                  </Link>
                </>
              )}
            </small>
          </div>
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
          {/* AI Summarizer Section */}
          <div className="d-flex align-items-start flex-wrap mt-3">
              <Button variant="primary" className="ms-2 mb-2" style={{ whiteSpace: 'nowrap', height: 'fit-content' }} onClick={(e) => handleDiscussionSummary(e, discussion)}>Summarize Discussion</Button>
              <Form.Control as="textarea" className="form-control mb-2 bg-secondary text-light border-dark placeholder-light" style={{ flex: 1, minHeight: '50px', marginLeft: '8px' }} value={summaryTexts[discussion._id] || ''} readOnly placeholder="Click 'Summarize Discussion' to generate an AI summary..."/>
          </div>
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
