/**
 * Backend Configuration
 *
 * This file defines the backend type and configuration for the application.
 * The backend can be switched between Firebase and REST API by setting the
 * VITE_REACT_APP_BACKEND environment variable.
 *
 * Environment Variables:
 * - VITE_REACT_APP_BACKEND: 'firebase' | 'rest' (default: 'firebase')
 * - REACT_APP_API_URL: Base URL for REST API (default: 'http://localhost:3000/api')
 *
 * Usage:
 * Set VITE_REACT_APP_BACKEND=rest in your .env file to use the REST API backend.
 * Set VITE_REACT_APP_BACKEND=firebase (or leave unset) to use Firebase backend.
 */

// Backend type selection
export const BACKEND_TYPE =
  import.meta.env.VITE_BACKEND || "firebase"; // 'firebase' | 'rest'

// Backend-specific configuration
export const BACKEND_CONFIG = {
  firebase: {
    // Firebase configuration will be added here
  },
  rest: {
    baseUrl:
      import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  },
};
