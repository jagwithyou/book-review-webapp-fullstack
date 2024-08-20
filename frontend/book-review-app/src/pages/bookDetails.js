import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { getBookDetails, deleteBook } from "../services/bookService";
import AlertMessage from "../components/AlertMessage";
import { isAdmin } from "../services/userService";
import RatingList from "../components/Rating/RatingList";
import "../components/common.css";

function BookDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [admin, setAdmin] = useState(false);

  const handleUpdate = () => {
    console.log("Update book functionality to be implemented.", book.id);
    navigate(`/books/update/${book.id}`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this book? This action cannot be undone."
      )
    ) {
      try {
        await deleteBook(book.id);
        setAlert({
          show: true,
          message: "Book deleted successfully!",
          variant: "success",
        });
        navigate("/");
      } catch (error) {
        setAlert({
          show: true,
          message: "Failed to delete the book. Please try again.",
          variant: "danger",
        });
      }
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookDetails(id);
        setBook(bookData);
      } catch (error) {
        setAlert({
          show: true,
          message: "Failed to fetch book details.",
          variant: "danger",
        });
      }
    };

    const checkAdmin = async () => {
      const isAdminUser = await isAdmin();
      setAdmin(isAdminUser);
    };

    fetchBook();
    checkAdmin();
  }, [id]);

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={8} md={8} lg={8}>
          {book ? (
            <Card>
              <div
                className="image-container"
                style={{ backgroundImage: `url(${book.book_url})` }}
              >
                <Card.Img
                  variant="top"
                  src={book.book_url}
                  className="img-overlay"
                />
              </div>
              <Card.Body>
                <Card.Title className="ms-2">{book.title}</Card.Title>
                <Card.Subtitle className="ms-2 mb-3 text-muted">
                  Author: {book.author}
                </Card.Subtitle>
                <Card.Text className="m-2">
                  <strong>Genre:</strong> {book.genre}
                  <br />
                  <strong>Year Published:</strong> {book.year_published}
                  <br />
                  <strong>Summary:</strong> {book.summary}
                </Card.Text>
                {admin && (
                  <Row>
                    <Col xs={6}>
                      <Button
                        variant="primary"
                        onClick={handleUpdate}
                        className="w-100"
                      >
                        Update
                      </Button>
                    </Col>
                    <Col xs={6}>
                      <Button
                        variant="danger"
                        onClick={handleDelete}
                        className="w-100"
                      >
                        Delete
                      </Button>
                    </Col>
                  </Row>
                )}
                <hr />
                <div>
                  <RatingList book_id={book.id} setAlert={setAlert} />
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card>
              <div className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            </Card>
          )}
        </Col>
      </Row>
      {alert.show && (
        <AlertMessage
          show={alert.show}
          message={alert.message}
          variant={alert.variant}
          onClose={() => setAlert({ show: false, message: "", variant: "" })}
        />
      )}
    </Container>
  );
}

export default BookDetails;
