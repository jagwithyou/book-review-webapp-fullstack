import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

function RatingForm({}) {
  const [text, setText] = useState("");
  const [score, setScore] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Form onSubmit={handleSubmit} className="mt-4">
      <Form.Group>
        <Form.Label>Rating</Form.Label>
        <Form.Control
          as="select"
          value={score}
          onChange={(e) => setScore(e.target.value)}
        >
          <option value={0}>Select...</option>
          {[1, 2, 3, 4, 5].map((score) => (
            <option key={score} value={score}>
              {score}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group>
        <Form.Label>Review</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </Form.Group>
      <Button type="submit" variant="primary">
        Submit
      </Button>
    </Form>
  );
}

export default RatingForm;
