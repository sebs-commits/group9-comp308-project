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
  const [image, setImage] = useState(null);

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
          image,
        },
      });

      setSuccess("News created successfully!");

      setHeadline("");
      setTextBody("");
      setImage(null);
    } catch (error) {
      console.error("Error creating news:", error);
      setError("Failed to create news. Please try again.");
    }
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        console.warn("Please select an image file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.onerror = () => {
        console.error("Error reading file");
        setImage(null);
        setError("Failed to read image file.");
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
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

        <Form.Group controlId="newsImageInput" className="mt-3">
          <Form.Label>Upload Image (Optional)</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {image && (
            <img
              src={image}
              alt="Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                marginTop: "10px",
              }}
            />
          )}
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
