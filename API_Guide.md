# API Guide

Below is the API Guide document for all the modules of Book Review System project. Each API endpoint is described with its purpose, required payloads, and key details.

---

## **User API Endpoints**

### 1. **Create User**
   - **Endpoint**: `POST /users/`
   - **Description**: This API is used to create a new user in the system.
   - **Payload**:
     ```json
     {
       "full_name": "string",
       "display_name": "string",
       "password": "string",
       "email": "string"
     }
     ```
   - **Responses**:
     - **200**: User created successfully.
     - **422**: Validation error in the provided input.

### 2. **Update User**
   - **Endpoint**: `PUT /users/{user_id}`
   - **Description**: This API is used to update an existing user's details.
   - **Parameters**:
     - **Path**: `user_id` (integer) - The ID of the user to be updated.
   - **Payload**:
     ```json
     {
       "full_name": "string",
       "display_name": "string",
       "email": "string"
     }
     ```
   - **Responses**:
     - **200**: User updated successfully.
     - **422**: Validation error in the provided input.

### 3. **Get User**
   - **Endpoint**: `GET /users/{user_id}`
   - **Description**: This API is used to retrieve the details of a specific user.
   - **Parameters**:
     - **Path**: `user_id` (integer) - The ID of the user to be retrieved.
   - **Responses**:
     - **200**: User details retrieved successfully.
     - **422**: Validation error in the provided input.

### 4. **Delete User**
   - **Endpoint**: `DELETE /users/{user_id}`
   - **Description**: This API is used to delete a specific user.
   - **Parameters**:
     - **Path**: `user_id` (integer) - The ID of the user to be deleted.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Responses**:
     - **200**: User deleted successfully.
     - **422**: Validation error in the provided input.

### 5. **Add User Role**
   - **Endpoint**: `POST /users/{user_id}/role/{role}`
   - **Description**: This API is used to assign a role to a user.
   - **Parameters**:
     - **Path**: 
       - `user_id` (integer) - The ID of the user.
       - `role` (string) - The role to be assigned to the user.
   - **Responses**:
     - **200**: Role added successfully.
     - **422**: Validation error in the provided input.

### 6. **Login**
   - **Endpoint**: `POST /users/login`
   - **Description**: This API is used to authenticate a user and generate a token.
   - **Payload**:
     ```json
     {
       "username": "string",
       "password": "string"
     }
     ```
   - **Responses**:
     - **200**: Login successful, token generated.
     - **422**: Validation error in the provided input.

### 7. **Activate User**
   - **Endpoint**: `POST /users/{user_id}/activate`
   - **Description**: This API is used to activate a user's account.
   - **Parameters**:
     - **Path**: `user_id` (integer) - The ID of the user to be activated.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Responses**:
     - **200**: User activated successfully.
     - **422**: Validation error in the provided input.

### 8. **Deactivate User**
   - **Endpoint**: `POST /users/{user_id}/deactivate`
   - **Description**: This API is used to deactivate a user's account.
   - **Parameters**:
     - **Path**: `user_id` (integer) - The ID of the user to be deactivated.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Responses**:
     - **200**: User deactivated successfully.
     - **422**: Validation error in the provided input.

---

## **Book API Endpoints**

### 1. **Create Book**
   - **Endpoint**: `POST /books/`
   - **Description**: This API is used to add a new book to the system.
   - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Payload**:
     ```json
     {
       "title": "string",
       "author": "string",
       "genre": "string",
       "year_published": 2024,
       "summary": "string",
       "book_url": "string"
     }
     ```
   - **Responses**:
     - **200**: Book created successfully.
     - **422**: Validation error in the provided input.

### 2. **Get Books**
   - **Endpoint**: `GET /books/`
   - **Description**: This API is used to retrieve a list of all books.
   - **Parameters**:
     - **Query**: 
       - `skip` (integer) - Number of records to skip (default: 0).
       - `limit` (integer) - Maximum number of records to retrieve (default: 10).
   - **Responses**:
     - **200**: List of books retrieved successfully.
     - **422**: Validation error in the provided input.

### 3. **Update Book**
   - **Endpoint**: `PUT /books/{book_id}`
   - **Description**: This API is used to update an existing book's details.
   - **Parameters**:
     - **Path**: `book_id` (integer) - The ID of the book to be updated.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Payload**:
     ```json
     {
       "title": "string",
       "author": "string",
       "genre": "string",
       "year_published": 2024,
       "summary": "string",
       "book_url": "string"
     }
     ```
   - **Responses**:
     - **200**: Book updated successfully.
     - **422**: Validation error in the provided input.

### 4. **Delete Book**
   - **Endpoint**: `DELETE /books/{book_id}`
   - **Description**: This API is used to delete a specific book.
   - **Parameters**:
     - **Path**: `book_id` (integer) - The ID of the book to be deleted.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Responses**:
     - **200**: Book deleted successfully.
     - **422**: Validation error in the provided input.

### 5. **Get Book**
   - **Endpoint**: `GET /books/{book_id}`
   - **Description**: This API is used to retrieve the details of a specific book.
   - **Parameters**:
     - **Path**: `book_id` (integer) - The ID of the book to be retrieved.
   - **Responses**:
     - **200**: Book details retrieved successfully.
     - **422**: Validation error in the provided input.

---

## **Review API Endpoints**

### 1. **Create Review**
   - **Endpoint**: `POST /reviews/`
   - **Description**: This API is used to create a new review for a book.
   - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Payload**:
     ```json
     {
       "book_id": 1,
       "review_text": "string",
       "rating": 5
     }
     ```
   - **Responses**:
     - **200**: Review created successfully.
     - **422**: Validation error in the provided input.

### 2. **Update Review**
   - **Endpoint**: `PUT /reviews/{review_id}`
   - **Description**: This API is used to update an existing review.
   - **Parameters**:
     - **Path**: `review_id` (integer) - The ID of the review to be updated.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Payload**:
     ```json
     {
       "review_text": "string",
       "rating": 5
     }
     ```
   - **Responses**:
     - **200**: Review updated successfully.
     - **422**: Validation error in the provided input.

### 3. **Delete Review**
   - **Endpoint**: `DELETE /reviews/{review_id}`
   - **Description**: This API is used to delete a specific review.
   - **Parameters**:
     - **Path**: `review_id` (integer) - The ID of the review to be deleted.
     - **Header**: `x-access-token` (string) - The token obtained from the login API.
   - **Responses**

:
     - **200**: Review deleted successfully.
     - **422**: Validation error in the provided input.

### 4. **Get Review given by user**
   - **Endpoint**: `GET /reviews/user/{user_id}`
   - **Description**: This API is used to retrieve all the reviews given by a particular user.
   - **Parameters**:
     - **Path**: `user_id` (integer) - The ID of the user whose reviews to be retrieved.
   - **Responses**:
     - **200**: Review details retrieved successfully.
     - **422**: Validation error in the provided input.

### 5. **Get Reviews for a Book**
   - **Endpoint**: `GET /reviews/book/{book_id}`
   - **Description**: This API is used to retrieve a list of all reviews for a specific book.
   - **Parameters**:
     - **Path**: `book_id` (integer) - The ID of the book.
   - **Responses**:
     - **200**: List of reviews retrieved successfully.
     - **422**: Validation error in the provided input.

---

This guide provides a complete overview of the API functionalities, including the required inputs and responses, to help developers and users interact with the system effectively.