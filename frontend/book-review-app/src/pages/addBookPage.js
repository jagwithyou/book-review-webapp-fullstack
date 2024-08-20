import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import AlertMessage from "../components/AlertMessage";
import { isAdmin } from "../services/userService";
import { addBook } from "../services/bookService";

function AddBook() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year_published, setYearPublished] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(await isAdmin())) {
      setAlert({
        show: true,
        message: "You are not authorized to add a book.",
        variant: "danger",
      });
      return;
    }

    setLoading(true);

    try {
      await addBook({
        title,
        author,
        genre,
        year_published,
        summary,
        file,
      });
      setAlert({
        show: true,
        message: "Book added successfully!",
        variant: "success",
      });

      // Clear the input fields
      setTitle("");
      setAuthor("");
      setGenre("");
      setYearPublished("");
      setSummary("");
      setFile(null);
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to add book. Please try again.",
        variant: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
          <Card className="shadow p-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Add New Book</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group controlId="formAuthor">
                  <Form.Label>Author</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter author name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group controlId="formGenre">
                  <Form.Label>Genre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter genre"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group controlId="formYearPublished">
                  <Form.Label>Year Published</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter year published"
                    value={year_published}
                    onChange={(e) => setYearPublished(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group controlId="formSummary">
                  <Form.Label>Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter book summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group controlId="formFile">
                  <Form.Label>Book Image</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Adding Book...
                    </>
                  ) : (
                    "Add Book"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
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

export default AddBook;
