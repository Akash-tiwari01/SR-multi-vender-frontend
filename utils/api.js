// Default API base URL for environment flexibility
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URI; // Use relative path or set process.env.NEXT_PUBLIC_API_URL

/**
 * Custom error class for API responses that return a non-2xx status.
 * Supports Liskov Substitution Principle (LSP) by allowing consistent error handling 
 * (checking instanceof ApiError) across different API calls.
 */
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    // Ensures the prototype chain is correctly maintained
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

/**
 * Centralized function to make POST requests to the backend API.
 * * Supports Single Responsibility Principle (SRP) by being the sole handler for API communication.
 * Supports Dependency Inversion Principle (DIP) by providing a stable interface for the actions layer.
 *
 * @param {string} endpoint The API path (e.g., '/users/register-vendor').
 * @param {object} data The payload to send in the request body.
 * @returns {Promise<object>} The JSON response data from the server.
 * @throws {ApiError | Error} Throws custom error for bad response or generic error for fetch issues.
 */
const post = async (endpoint, data) => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Optimization: Use AbortController for future request cancellation/timeouts
  const controller = new AbortController();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    // Scalability: Efficiently parse response data once
    let responseData = null;
    try {
      responseData = await response.json();
    } catch (e) {
      // Handles cases where the response is not valid JSON
      if (response.status !== 204) {
        console.error('Failed to parse JSON response:', e);
      }
    }

    // Robust Error Handling: Check for non-OK status codes
    if (!response.ok) {
      const errorMessage = responseData?.message || response.statusText || `API request failed with status ${response.status}`;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    // Success
    return responseData;

  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      // Handle generic network errors (e.g., DNS failure, no connection)
      console.error('Network or unexpected error during API call:', error);
      throw new Error('A network error occurred. Please check your connection and try again.');
    }
  }
};


// ... API_BASE_URL and ApiError class ...

const put = async (endpoint, data, token) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    // Correct way to get token in Server Actions / Server Components
    

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Token pass ho raha hai server-to-server request mein
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    let responseData = null;
    try {
      responseData = await response.json();
    } catch (e) {
      if (response.status !== 204) {
        console.error('Failed to parse JSON response:', e);
      }
    }

    if (!response.ok) {
      const errorMessage = responseData?.message || response.statusText;
      throw new ApiError(errorMessage, response.status, responseData);
    }

    return responseData;

  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error('Server update failed. Please check network.');
  }
};

/**
 * API client module for external use.
 */
export const apiClient = {
  post,
  put
};