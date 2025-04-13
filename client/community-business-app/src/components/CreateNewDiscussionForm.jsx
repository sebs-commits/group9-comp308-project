import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';

const CreateNewDiscussionForm = ({ onSubmit, title, onTitleChange, text, onTextChange, loading}) => (
  <Card className="bg-dark border border-secondary mb-5 shadow-sm text-start">
    <Card.Header className="text-light bg-secondary border-bottom border-dark py-2 px-3">Start a New Discussion</Card.Header>
    <Card.Body className="p-3">
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="newDiscussionTitle">
           <Form.Label className="small text-light text-opacity-75">Title</Form.Label>
          <Form.Control
            type="text"
            className="bg-secondary text-light border-dark placeholder-light"
            placeholder="Enter discussion title"
            value={title}
            onChange={onTitleChange}
            required
           />
        </Form.Group>
        <Form.Group className="mb-3" controlId="newDiscussionText">
          <Form.Label className="small text-light text-opacity-75">Message</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            className="bg-secondary text-light border-dark placeholder-light"
            placeholder="What do you want to discuss?"
            value={text}
            onChange={onTextChange}
            required
           />
        </Form.Group>
        <div className="d-flex align-items-center">
          <Button variant="success" type="submit" disabled={loading}>
            Start Discussion
          </Button>

        </div>
      </Form>
    </Card.Body>
  </Card>
);

export default CreateNewDiscussionForm;