import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT
  } from '../types';
  import axios from 'axios';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  // Base URL for API requests
  const BASE_URL = 'http://3.7.81.243/projects/plie-api/public/api';
  
  // Action creator for login request
  export const loginRequest = () => ({
    type: LOGIN_REQUEST
  });
  
  // Action creator for login success
  export const loginSuccess = (user) => ({
    type: LOGIN_SUCCESS,
    payload: user
  });
  
  // Action creator for login failure
  export const loginFailure = (error) => ({
    type: LOGIN_FAILURE,
    payload: error
  });
  
  // Action creator for logout
  export const logout = () => ({
    type: LOGOUT
  });
  
  // Function to handle login (not a Redux action creator)
  export const handleLogin = async (email, password, dispatch) => {
    dispatch(loginRequest());
  
    try {
      console.log('Attempting login with:', email);
      
      // Create form data for the request
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
  
      // Make API request - using the exact format from Postman
      const response = await axios.post(`${BASE_URL}/login`, formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);
      
      // Log the full response for debugging
      console.log('Login response data:', JSON.stringify(response.data));
      
      // Extract user data and token from response
      let userData = {};
      let token = '';
      
      // Handle different response formats
      if (response.data && response.data.data) {
        userData = response.data.data;
        token = userData.token || '';
      } else if (response.data && response.data.token) {
        token = response.data.token;
        userData = { ...response.data, token };
      }
      
      console.log('Token extracted:', token);
      
      if (!token) {
        throw new Error('No token received from server');
      }
      
      // Store token in AsyncStorage for persistent login
      console.log('Storing token in AsyncStorage');
      await AsyncStorage.setItem('authToken', token);
      
      // Dispatch success action
      dispatch(loginSuccess(userData));
      
      return { success: true, data: userData };
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      }
      
      // Extract error message from response
      const errorMessage = 
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : 'Login failed. Please check your credentials.';
      
      // Dispatch failure action
      dispatch(loginFailure(errorMessage));
      
      return { success: false, error: errorMessage };
    }
  };
  
  // Function to handle logout (not a Redux action creator)
  export const handleLogout = async (dispatch) => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('authToken');
      
      // Dispatch logout action
      dispatch(logout());
      
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };
  
  // Function to check if user is already logged in (not a Redux action creator)
  export const checkAuth = async (dispatch) => {
    try {
      // Retrieve token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      
      if (token) {
        console.log('Found stored token:', token.substring(0, 10) + '...');
        
        // If token exists, set user as logged in
        dispatch(loginSuccess({ token }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };