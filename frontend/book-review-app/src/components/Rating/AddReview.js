import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { addReview } from "../../services/reviewService";

function AddReview({ book_id, setAlert, show, handleClose, onReviewAdded }) {
  const [rating, setRating] = useState(1);
  const [reviewText, setReviewText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addReview({ book_id, rating, review_text: reviewText });
      setAlert({
        show: true,
        message: "Review added successfully!",
        variant: "success",
      });
      onReviewAdded();
      handleClose();
    } catch (error) {
      console.log(error);
      handleClose();
      if (error.code === "ERR_BAD_REQUEST") {
        setAlert({
          show: true,
          message: "You have already reviewed this book",
          variant: "danger",
        });
      } else {
        setAlert({
          show: true,
          message: "Failed to add review. Please try again.",
          variant: "danger",
        });
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="reviewText" className="mt-3">
            <Form.Label>Review</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-4">
            <Button variant="secondary" onClick={handleClose} className="me-2">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddReview;
