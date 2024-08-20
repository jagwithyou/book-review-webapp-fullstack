Great, let's move on to creating the book entry page! Here's how we can achieve each step:

### 5.1 Design the Book Entry Page
We'll create a form to allow admins to enter book details like title, author, genre, year published, summary, and an image URL for the book cover. We'll also style the form using Bootstrap to ensure it looks professional and is responsive.

#### BookEntry.js
```javascript
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // Assuming this service has the isAdmin function
import bookService from '../services/bookService'; // Service to handle API calls related to books

function BookEntry() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [yearPublished, setYearPublished] = useState('');
  const [summary, setSummary] = useState('');
  const [bookUrl, setBookUrl] = useState('');
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if user is admin
    if (!authService.isAdmin()) {
      setAlert('You are not authorized to add a book.');
      return;
    }

    try {
      await bookService.addBook({ title, author, genre, yearPublished, summary, bookUrl });
      setAlert('Book added successfully!');
      navigate('/books'); // Redirect to book list or any desired page
    } catch (error) {
      setAlert('Failed to add book. Please try again.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row className="w-100">
        <Col xs={12} sm={10} md={8} lg={6} xl={4} className="mx-auto">
          <Card className="shadow p-4">
            <Card.Body>
              <Card.Title className="text-center mb-4">Add New Book</Card.Title>
              {alert && <Alert variant="danger">{alert}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
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
                  />
                </Form.Group>

                <Form.Group controlId="formYearPublished">
                  <Form.Label>Year Published</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter year published"
                    value={yearPublished}
                    onChange={(e) => setYearPublished(e.target.value)}
                    required
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
                  />
                </Form.Group>

                <Form.Group controlId="formBookUrl">
                  <Form.Label>Book Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter book image URL"
                    value={bookUrl}
                    onChange={(e) => setBookUrl(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                  Add Book
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default BookEntry;
```

### 5.2 Update the Service Layer to Call the Book Insert API
We'll add a function in the `bookService` to handle the API call for inserting a new book.

#### bookService.js
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8001'; // Update this with your actual API URL

const addBook = async (bookData) => {
  const token = localStorage.getItem('token');
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  return axios.post(`${API_URL}/books`, bookData, config);
};

export default {
  addBook,
};
```

### 5.3 Show "Not Authorized" Alert for Non-Admin Users
In the `BookEntry` component, we've already handled this by checking if the user is an admin in the `handleSubmit` function. If the user is not an admin, an alert message will be displayed.

---

You can now proceed to implement this page, and let me know if you need any further assistance!


To include an admin check in your `authService`, you can update your service layer to fetch user details, including the role, and then check if the user is an admin. Here's how you can modify your service:

### Updated `authService.js`

```javascript
// src/services/authService.js

const API_URL = 'http://localhost:8001'; // Adjust this if your API URL is different

// Utility function to handle API requests
const fetchData = async (endpoint, method = 'GET', body = null) => {
    const headers = {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token'), // Use token from local storage
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null,
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

// Fetch user details, including role
export const getUser = async () => {
    const userDetails = await fetchData('/users/me/');
    return userDetails;
};

// Check if user is admin
export const isAdmin = async () => {
    const user = await getUser();
    return user.role === 'admin';
};
```

### Steps:

1. **Design the Page**:
   - Create a form that will allow an admin to enter details like book title, author, genre, year published, summary, and book URL.

2. **Update the Service Layer**:
   - The `authService.js` will handle user role verification to ensure only admins can access the book entry functionality.

3. **Handle Admin Authorization**:
   - Use the `isAdmin` function to check if the user is an admin before displaying the book entry form.

### Example Implementation:

```javascript
// src/pages/AddBookPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { isAdmin } from '../services/authService';

function AddBookPage() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [yearPublished, setYearPublished] = useState('');
    const [summary, setSummary] = useState('');
    const [bookUrl, setBookUrl] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            const admin = await isAdmin();
            if (!admin) {
                setError('Not authorized');
            }
        };
        checkAdmin();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (error) return;

        try {
            // Call your API to add the book
            await fetchData('/books/', 'POST', {
                title,
                author,
                genre,
                yearPublished,
                summary,
                bookUrl,
            });
            navigate('/books'); // Redirect to the book list page after successful entry
        } catch (err) {
            setError('Failed to add book');
        }
    };

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    return (
        <Container>
            <h1>Add New Book</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Group>
                {/* Repeat similar groups for author, genre, yearPublished, summary, and bookUrl */}
                <Button type="submit">Add Book</Button>
            </Form>
        </Container>
    );
}

export default AddBookPage;
```

This code checks if the user is an admin before allowing them to add a book. If they are not, it displays an error message.




