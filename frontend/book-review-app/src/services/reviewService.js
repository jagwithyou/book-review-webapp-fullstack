import axios from "axios";

/**
 * Base URL for API requests
 */
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Adds a new review to the database
 *
 * @param {object} reviewData - The data for the new review
 * @returns {Promise} - A promise that resolves with the response from the API
 */
export const addReview = async (reviewData) => {
  console.log(reviewData);
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  return axios.post(`${API_URL}/reviews`, reviewData, config);
};

/**
 * Retrieves a list of reviews for a specific book
 *
 * @param {string} bookId - The ID of the book to retrieve reviews for
 * @returns {Promise} - A promise that resolves with the list of reviews
 */
export const getReviews = async (bookId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  const response = await axios.get(`${API_URL}/reviews/book/${bookId}`, config);
  return response.data;
};

/**
 * Checks if the current user has already reviewed a specific book
 *
 * @param {string} bookId - The ID of the book to check
 * @returns {Promise} - A promise that resolves with a boolean indicating whether the user has reviewed the book
 */
export const getUserReview = async (bookId) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };

  try {
    const response = await axios.get(
      `${API_URL}/reviews/book/${bookId}`,
      config
    );
    const reviews = response.data;
    const userId = localStorage.getItem("user_id");
    console.log(userId);
    // Check if the user has already reviewed this book
    const userReviewExists = reviews.some(
      (review) => review.user_id === parseInt(userId, 10)
    );
    return userReviewExists;
  } catch (error) {
    console.error("Failed to fetch user review:", error);
    return false;
  }
};

/**
 * Updates an existing review
 *
 * @param {string} reviewId - The ID of the review to update
 * @param {string} text - The updated review text
 * @param {number} rating - The updated rating
 * @returns {Promise} - A promise that resolves with the response from the API
 */
export const updateReview = async (reviewId, text, rating) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  const reviewData = {
    review_text: text,
    rating: rating,
  };
  return axios.put(`${API_URL}/reviews/${reviewId}`, reviewData, config);
};

/**
 * Deletes a review
 *
 * @param {string} reviewId - The ID of the review to delete
 * @returns {Promise} - A promise that resolves with the response from the API
 */
export const deleteReview = async (reviewId) => {
  console.log(reviewId);
  const token = localStorage.getItem("token");
  const config = {
    headers: { "x-access-token": token },
  };
  return axios.delete(`${API_URL}/reviews/${reviewId}`, config);
};
