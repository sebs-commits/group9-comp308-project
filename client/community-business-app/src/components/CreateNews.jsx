import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import ResidentNewsList from "./ResidentNewsList";

import {
  CREATE_NEWS,
  UPDATE_NEWS,
  GET_USER_NEWS,
} from "../../shared/gql/news.gql";

const CreateNews = () => {
  const navigate = useNavigate();

  const [creatorId] = useState(sessionStorage.getItem("uid") || "id");
  const [headline, setHeadline] = useState("");
  const [textBody, setTextBody] = useState("");
  const [image, setImage] = useState(null);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [createNews, { loading: creating }] = useMutation(CREATE_NEWS, {
    refetchQueries: [{ query: GET_USER_NEWS, variables: { creatorId } }],
  });

  const [updateNews, { loading: updating }] = useMutation(UPDATE_NEWS, {
    refetchQueries: [{ query: GET_USER_NEWS, variables: { creatorId } }],
  });

  const handleEdit = (newsItem) => {
    setHeadline(newsItem.headline);
    setTextBody(newsItem.textBody);
    setImage(newsItem.image);
    setEditingNewsId(newsItem._id);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingNewsId) {
        // Update news logic
        await updateNews({
          variables: {
            _id: editingNewsId,
            creatorId,
            headline,
            textBody,
            image,
          },
        });
        setSuccess("News updated successfully!");
      } else {
        // Create news logic
        await createNews({
          variables: {
            creatorId,
            headline,
            textBody,
            image,
          },
        });
        setSuccess("News created successfully!");
      }

      // Reset form fields
      setHeadline("");
      setTextBody("");
      setImage(null);
      setEditingNewsId(null);
    } catch (error) {
      console.error("Error creating/updating news:", error);
      setError("Failed to create/update news. Please try again.");
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
      <h2>{editingNewsId ? "Update News" : "Create News"}</h2>

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
          <Button
            variant="primary"
            type="submit"
            disabled={creating || updating}
          >
            {creating || updating
              ? "Submitting..."
              : editingNewsId
              ? "Update News"
              : "Create News"}
          </Button>
        </div>
      </Form>

      <ResidentNewsList onEdit={handleEdit} />
    </Container>
  );
};

export default CreateNews;
