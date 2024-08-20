import React, { useEffect, useState } from "react";
import { ListGroup, Row, Col, Button } from "react-bootstrap";
import { FaStar, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import AddReview from "./AddReview";
import UpdateReview from "./UpdateReview";
import { isAdmin } from "../../services/userService";
import "../common.css";
import {
  getReviews,
  getUserReview,
  deleteReview,
} from "../../services/reviewService";

const RatingList = ({ book_id, setAlert }) => {
  const [reviews, setReviews] = useState([]);
  const loggedInUserId = localStorage.getItem("user_id");
  const [userReviewed, setUserReviewed] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [showUpdateReview, setShowUpdateReview] = useState(false);
  const [selectedReview, setSelectedReview] = useState({
    text: "",
    rating: 0,
    review_id: 0,
  });
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const reviewsData = await getReviews(book_id);
        setReviews(reviewsData);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      }
    };

    const checkUserReview = async () => {
      try {
        const review = await getUserReview(book_id);
        if (review) setUserReviewed(true);
      } catch (error) {
        console.error("Failed to check if user reviewed:", error);
      }
    };

    const checkAdmin = async () => {
      const isAdminUser = await isAdmin();
      setAdmin(isAdminUser);
    };

    fetchReviews();
    checkUserReview();
    checkAdmin();
  }, [book_id]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FaStar key={index} className={index < rating ? "star filled" : "star"} />
    ));
  };

  const handleReviewUpdate = (review) => {
    console.log(review);
    setSelectedReview({
      text: review.review_text,
      rating: review.rating,
      review_id: review.id,
    });
    setShowUpdateReview(true);
  };

  const handleReviewDelete = async (review_id) => {
    try {
      await deleteReview(review_id);
      setAlert({ message: "Review deleted successfully", type: "success" });
      setReviews(reviews.filter((review) => review.id !== review_id));
    } catch (error) {
      setAlert({ message: "Failed to delete review", type: "danger" });
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <ListGroup>
      <Row className="d-flex justify-content-between">
        <Col xs={12} md={4}>
          <p>Reviews:</p>
        </Col>
        {!userReviewed && (
          <Col xs={12} md={4} className="text-end">
            <Button
              variant="link"
              className="pencil-icon pencil-icon-dark"
              onClick={() => setShowAddReview(true)}
            >
              <p className="pencil-icon-dark">Write a review</p>
            </Button>
          </Col>
        )}
      </Row>

      <AddReview
        book_id={book_id}
        setAlert={setAlert}
        show={showAddReview}
        handleClose={() => setShowAddReview(false)}
        onReviewAdded={() => setUserReviewed(true)}
      />

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ListGroup.Item key={review.id}>
            <Row>
              <Col xs={12} md={8}>
                <p className="mb-1 text-start">{review.review_text}</p>
                <small className="text-muted">
                  <strong>Reviewed by:</strong> {review.display_name}
                  {String(review.user_id) === loggedInUserId && (
                    <Button
                      variant="link"
                      className="pencil-icon pencil-icon-dark"
                      onClick={() => handleReviewUpdate(review)}
                    >
                      <p className="pencil-icon-dark">
                        <FaPencilAlt /> Edit Review{" "}
                      </p>
                    </Button>
                  )}
                  {admin && (
                    <Button
                      variant="link"
                      className="pencil-icon pencil-icon-dark"
                      onClick={() => handleReviewDelete(review.id)}
                    >
                      <p className="pencil-icon-dark">
                        <FaTrashAlt /> Delete Review{" "}
                      </p>
                    </Button>
                  )}
                </small>
              </Col>
              <Col xs={12} md={4} className="text-md-end text-start">
                {renderStars(review.rating)}
              </Col>
            </Row>
          </ListGroup.Item>
        ))
      ) : (
        <p>No reviews yet. Be the first to add a review!</p>
      )}

      <UpdateReview
        book_id={book_id}
        review_id={selectedReview.review_id}
        setAlert={setAlert}
        show={showUpdateReview}
        handleClose={() => setShowUpdateReview(false)}
        reviewText={selectedReview.text}
        reviewRating={selectedReview.rating}
        onReviewUpdated={() => setUserReviewed(true)}
      />
    </ListGroup>
  );
};

export default RatingList;
