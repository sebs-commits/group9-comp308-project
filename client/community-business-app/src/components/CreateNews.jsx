import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import NewsList from "./NewsList";

import { CREATE_NEWS, GET_ALL_NEWS } from "../../shared/gql/news.gql";

const CreateNews = () => {
  const navigate = useNavigate();

  const [creatorId] = useState(sessionStorage.getItem("uid") || "id"); // this will set it to id for now
  const [headline, setHeadline] = useState("");
  const [textBody, setTextBody] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createNews, { loading }] = useMutation(CREATE_NEWS, {
    refetchQueries: [{ query: GET_ALL_NEWS }],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await createNews({
        variables: {
          creatorId,
          headline,
          textBody,
        },
      });

      setSuccess("News created successfully!");

      setHeadline("");
      setTextBody("");
    } catch (error) {
      console.error("Error creating news:", error);
      setError("Failed to create news. Please try again.");
    }
  };

  return (
    <Container>
      <h2>Create News</h2>

      {error && <div>{error}</div>}
      {success && <div>{success}</div>}

      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Headline</Form.Label>
          <Form.Control
            type="text"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            placeholder="Enter headline"
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={textBody}
            onChange={(e) => setTextBody(e.target.value)}
            placeholder="Enter news content"
            required
          />
        </Form.Group>

        <div>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Create News"}
          </Button>
        </div>
      </Form>

      <NewsList />
    </Container>
  );
};

export default CreateNews;
