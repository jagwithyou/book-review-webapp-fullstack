import axios from "axios";

/**
 * Base URL for API requests
 */
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Adds a new book to the database
 *
 * @param {object} bookData - The data for the new book
 * @returns {Promise} - A promise that resolves with the response from the Add book API
 */
export const addBook = async (bookDetails) => {
  const token = localStorage.getItem("token");

  // Upload the file and get the URL
  const formData = new FormData();
  formData.append("file", bookDetails.file);

  try {
    const uploadResponse = await axios.post(
      `${API_URL}/users/upload_file?upload_reason=books`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "x-access-token": token,
        },
      }
    );
    if (uploadResponse.status !== 200) {
      throw new Error("File upload failed. Please try again.");
    }
    const fileUrl = uploadResponse.data.file_url;

    // Create the book with the details and file URL
    const bookData = {
      title: bookDetails.title,
      author: bookDetails.author,
      genre: bookDetails.genre,
      year_published: bookDetails.year_published,
      summary: bookDetails.summary,
      book_url: fileUrl,
    };

    const config = {
      headers: { "x-access-token": token },
    };

    const response = await axios.post(`${API_URL}/books`, bookData, config);

    return response.data;
  } catch (error) {
    console.error("Error adding book:", error);
    throw new Error(
      error.response?.data?.detail || "Failed to add book. Please try again."
    );
  }
};

/**
 * Retrieves the details of a book by its ID
 *
 * @param {string} bookId - The ID of the book to retrieve
 * @returns {Promise} - A promise that resolves with the response from the book details API
 */
export const getBookDetails = async (bookId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  const response = await axios.get(`${API_URL}/books/${bookId}`, config);
  return response.data;
};

/**
 * Retrieves a list of all books
 *
 * @returns {Promise} - A promise that resolves with the list of books
 */
export const getBooks = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  const response = await axios.get(`${API_URL}/books`, config);
  return response.data;
};

/**
 * Deletes a book by its ID
 *
 * @param {string} bookId - The ID of the book to delete
 * @returns {Promise} - A promise that resolves with the response from the API
 */
export const deleteBook = async (bookId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  return await axios.delete(`${API_URL}/books/${bookId}`, config);
};

/**
 * Updates the details of a book
 *
 * @param {string} bookId - The ID of the book to update
 * @param {object} bookData - The updated data for the book
 * @returns {Promise} - A promise that resolves with the response from the API
 */
export const updateBookDetails = async (bookId, bookData) => {
  console.log("Book Data to update", bookData);
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  return axios.put(`${API_URL}/books/${bookId}`, bookData, config);
};
