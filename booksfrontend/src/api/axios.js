import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true, // Enable sending cookies with requests
});

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorData = {
      message: "Something went wrong. Please try again later.",
      errors: [],
    };

    if (error.response?.data) {
      // Handle validation errors
      if (error.response.data.errors) {
        errorData.errors = error.response.data.errors;
        errorData.message = "Validation failed";
      }
      // Handle custom error message
      else if (error.response.data.msg) {
        errorData.message = error.response.data.msg;
      }
    }

    // Handle authentication errors
    if (error.response?.status === 401) {
      errorData.message = "Please login to continue";
    }
    // Handle authorization errors
    else if (error.response?.status === 403) {
      errorData.message = "You do not have permission to perform this action";
    }

    return Promise.reject(errorData);
  }
);

export default instance;
