import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { updateReview } from "../../services/reviewService";

const UpdateReview = ({
  review_id,
  setAlert,
  show,
  handleClose,
  reviewText,
  reviewRating,
  onReviewUpdated,
}) => {
  const [text, setText] = useState(reviewText);
  const [rating, setRating] = useState(reviewRating);

  useEffect(() => {
    if (reviewText !== undefined) {
      setText(reviewText);
    }
    if (reviewRating !== undefined) {
      setRating(reviewRating);
    }
  }, [reviewText, reviewRating]);

  const handleSubmit = async () => {
    try {
      await updateReview(review_id, text, rating);
      setAlert({
        show: true,
        message: "Review updated successfully!",
        variant: "success",
      });
      onReviewUpdated();
      handleClose();
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to update review. Please try again.",
        variant: "danger",
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Your Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reviewText">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="reviewRating" className="mt-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={5}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateReview;
