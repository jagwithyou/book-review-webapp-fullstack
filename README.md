# Book Review System using FastAPI

### Project Summary

This project is a **Book Review System** built using FastAPI, featuring a well-structured and modularized codebase that handles user management, book management, and book review functionalities. The application is designed to manage roles and permissions, ensuring that only authorized users can perform certain actions. Here's a breakdown of the main functionalities:

### Important Documentation Links
- **[Database Schema](./DB_Details.md)**: Detailed schema of the database used in the project, including tables, relationships, and constraints.
- **[API Guide](./API_Guide.md)**: Comprehensive guide to all API endpoints, including request and response payloads, status codes, and example usage.
- **[AWS Deployment Guide](./AWS_deployment_guide.md)**: Step by step guide to deploy the backend services in AWS Cloud.

#### **User Module**
- **Create User**: Allows the creation of new users with necessary details such as full name, display name, password, and email. Passwords are securely hashed before being stored.
- **Update User**: Users can update their information, such as full name or display name. 
- **User Authentication**: Users can log in using their credentials. Successful login returns a JWT token used for accessing protected endpoints.
- **User Roles**: Admin users can assign roles to other users, such as making them an admin.
- **Activate/Deactivate User**: Admins can activate or deactivate user accounts. Deactivated users cannot log in, and their display name is replaced with "Unknown user" in the UI.
- **Delete User**: Admin users can delete user accounts from the system.

#### **Books Module**
- **Create Book**: Admin users can add new books to the system with details like title, author, genre, year published, summary, and book URL.
- **Update Book**: Admin users can update book details. Regular users are not allowed to modify book information.
- **Delete Book**: Admin users can delete books. When a book is deleted, all associated reviews are also removed from the system.
- **Get Books**: Any user can retrieve a list of all books or details of a specific book.

#### **Book Review Module**
- **Create Review**: Users can write reviews for books. Each user is allowed to write only one review per book. The system checks if the book review is already exists for the same user before accepting the review.
- **Update Review**: Users can update their own reviews. Admins do not have the ability to modify reviews, only to delete them if necessary.
- **Delete Review**: Users can delete their own reviews. Admins can also delete reviews if required.
- **Get Reviews**: Users can retrieve all reviews for a specific book or all reviews written by a specific user. The system ensures that when a user is deactivated, their display name is replaced with "Unknown user" in the review section.

### How to Clone and Run the Project

Follow these steps to clone and run the project on your local machine:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jagwithyou/book-review-webapp-fullstack.git
   cd book-review-webapp-fullstack
   ```

2. **Create and Activate a Virtual Environment**:
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows, use `venv\Scripts\activate`
   ```

3. **Install Dependencies**:
   ```bash
   cd backend/app/
   pip install -r requirements.txt
   ```

4. **Run the FastAPI Server**:
   ```bash
   uvicorn app.main:app --reload --host localhost --port 8001
   ```

5. **Run Tests**:
   - To run the tests, use: another window with same folder path
     ```bash
     pytest
     ```
6. **Populate pytest report**:
   - To run the tests, and populate report:
     ```bash
     pytest --html=test_report/report.html --self-contained-html
     ```
7. **Run Frontend**:
   - open a new window and run below commands
     ```bash
     cd book-review-webapp-fullstack/frontend/book-review-app
     npm install
     npm start
     ```
