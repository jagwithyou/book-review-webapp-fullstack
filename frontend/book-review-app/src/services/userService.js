import axios from "axios";

/**
 * Base URL for API requests
 */
const API_URL = process.env.REACT_APP_API_URL;

/**
 * Utility function to handle API requests
 *
 * @param {string} endpoint - The endpoint to make the request to
 * @param {string} [method="GET"] - The HTTP method to use
 * @param {object} [body=null] - The request body
 * @returns {Promise} - A promise that resolves with the response data
 */
const fetchData = async (endpoint, method = "GET", body = null) => {
  const headers = {
    "Content-Type": "application/json",
    "x-access-token": localStorage.getItem("token"),
  };

  console.log("API_URL", API_URL);
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

/**
 * Logs a user in
 *
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - A promise that resolves with the response data
 */
export const userLogin = async (email, password) => {
  try {
    console.log(`${API_URL}/users/login`);
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};

/**
 * Retrieves the current user's details
 *
 * @returns {Promise} - A promise that resolves with the user's details
 */
export const getUser = async () => {
  const userDetails = await fetchData("/users/me/");
  return userDetails;
};

/**
 * Retrieves a user's details by ID
 *
 * @returns {Promise} - A promise that resolves with the user's details
 */
export const getUserDetails = async () => {
  const current_user_id = localStorage.getItem("user_id");
  const userDetails = await fetchData(`/users/${current_user_id}`);
  return userDetails;
};

/**
 * Updates a user's details
 *
 * @param {string} fullName - The user's full name
 * @param {string} displayName - The user's display name
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - A promise that resolves with the response data
 */
export const updateUser = async (fullName, displayName, email, password) => {
  const current_user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const userData = {
    full_name: fullName,
    display_name: displayName,
    email: email,
    password: password,
  };
  const config = {
    headers: { "x-access-token": token },
  };
  return axios.put(`${API_URL}/users/${current_user_id}`, userData, config);
};

/**
 * Creates a new user
 *
 * @param {string} fullName - The user's full name
 * @param {string} displayName - The user's display name
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise} - A promise that resolves with the response data
 */
export const createUser = async (fullName, displayName, email, password) => {
  const userData = {
    full_name: fullName,
    display_name: displayName,
    email: email,
    password: password,
  };
  return axios.post(`${API_URL}/users/`, userData);
};

/**
 * Checks if the current user is an admin
 *
 * @returns {Promise} - A promise that resolves with a boolean indicating whether the user is an admin
 */
export const isAdmin = async () => {
  try {
    const response = await fetchData("/users/me/");
    console.log(response);
    return response.role === "admin";
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
};
