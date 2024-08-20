import React, { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../../services/bookService";
import "../common.css";

function BookGrid() {
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksData = await getBooks();
        setBooks(booksData);
      } catch (error) {
        console.error("Failed to fetch books:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleViewBook = (id) => {
    navigate(`/books/${id}`);
  };

  return (
    <Row>
      {books.map((book) => (
        <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
          <Card>
            <div
              className="image-container-1"
              style={{ backgroundImage: `url(${book.book_url})` }}
            >
              <div className="image-background-1">
                <Card.Img
                  variant="top"
                  src={book.book_url}
                  className="img-overlay-1"
                />
              </div>
            </div>
            <Card.Body className="d-flex flex-column">
              <Card.Title>{book.title}</Card.Title>
              <Card.Text className="flex-grow-1">
                {book.summary.substring(0, 100)}...
              </Card.Text>
              <Button variant="dark" onClick={() => handleViewBook(book.id)}>
                View Book
              </Button>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default BookGrid;
