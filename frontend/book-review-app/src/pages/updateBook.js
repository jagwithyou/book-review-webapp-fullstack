import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Col, Card } from 'react-bootstrap';
import { getBookDetails, updateBookDetails } from '../services/bookService';
import AlertMessage from '../components/AlertMessage';
import '../components/common.css';

function UpdateBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: '',
    author: '',
    genre: '',
    year_published: '',
    summary: '',
    book_url: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const bookData = await getBookDetails(id);
        setBook(bookData);
      } catch (error) {
        setAlert({ show: true, message: 'Failed to fetch book details.', variant: 'danger' });
      }
    };

    fetchBook();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateBookDetails(id, book);
      setAlert({ show: true, message: 'Book updated successfully!', variant: 'success' });
      navigate(`/books/${id}`);
    } catch (error) {
      console.log(error);
      setAlert({ show: true, message: 'Failed to update the book. Please try again.', variant: 'danger' });
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Col xs={12} sm={8} md={6} lg={5}>
        <Card className="shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Update Book</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter title"
                  name="title"
                  value={book.title}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formAuthor" className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter author"
                  name="author"
                  value={book.author}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formGenre" className="mb-3">
                <Form.Label>Genre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter genre"
                  name="genre"
                  value={book.genre}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formYearPublished" className="mb-3">
                <Form.Label>Year Published</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter year"
                  name="year_published"
                  value={book.year_published}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formSummary" className="mb-3">
                <Form.Label>Summary</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter summary"
                  name="summary"
                  value={book.summary}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBookURL" className="mb-3">
                <Form.Label>Book Image URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter image URL"
                  name="book_url"
                  value={book.book_url}
                  onChange={handleChange}
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-2">
                Update Book
              </Button>
              <Button variant="secondary" className="w-100" onClick={() => navigate(`/books/${id}`)}>
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>

        {alert.show && (
          <AlertMessage
            show={alert.show}
            message={alert.message}
            variant={alert.variant}
            onClose={() => setAlert({ show: false, message: '', variant: '' })}
          />
        )}
      </Col>
    </Container>
  );
}

export default UpdateBook;
