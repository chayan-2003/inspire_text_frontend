import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Create the AuthContext
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Authentication state
  const [loading, setLoading] = useState(true); // Loading state for auth check
  const API_URL = import.meta.env.PROD ? import.meta.env.VITE_API_URL_PROD : import.meta.env.VITE_API_URL_DEV;
  // Check authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get( `${API_URL}/api/users/auth/check`, {
          withCredentials: true, // Include cookies in the request
        });
        if (response.status === 200) {
          setIsAuthenticated(true); // Set authentication to true
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error.response?.data || error.message);
        setIsAuthenticated(false); // On error, assume not authenticated
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};