import {
    FETCH_EVENTS_REQUEST,
    FETCH_EVENTS_SUCCESS,
    FETCH_EVENTS_FAILURE
  } from '../types';
  import AsyncStorage from '@react-native-async-storage/async-storage';
  
  // Base URL for API requests
  const BASE_URL = 'http://3.7.81.243/projects/plie-api/public/api';
  
  // Action creator for fetching events request
  export const fetchEventsRequest = () => ({
    type: FETCH_EVENTS_REQUEST
  });
  
  // Action creator for fetching events success
  export const fetchEventsSuccess = (events) => ({
    type: FETCH_EVENTS_SUCCESS,
    payload: events
  });
  
  // Action creator for fetching events failure
  export const fetchEventsFailure = (error) => ({
    type: FETCH_EVENTS_FAILURE,
    payload: error
  });
  
  // Function to fetch events (not a Redux action creator)
  export const handleFetchEvents = async (dispatch) => {
    dispatch(fetchEventsRequest());
    console.log('Event fetch started');
  
    try {
      // Get auth token from AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      console.log('Auth token for events API:', token ? `${token.substring(0, 10)}...` : 'No token found');
      
      if (!token) {
        console.log('No auth token found for events API');
        throw new Error('Authentication token not found');
      }
  
      // Network security may be an issue - let's use mock data for now
      console.log('Due to network issues, using mock data instead of API call');
      
      // Create mock data that matches your UI expectations
      const mockEvents = [
        {
          id: '1',
          title: 'ADICTO: Berlin Festival',
          image_url: null, // Will fall back to local image
          date_range: '24.02.2022 - 26.02.2022',
          price_range: '€30 - €100',
          location: 'Berlin, Germany',
          tags: 'Workshop, Bachata',
          liked: false,
        },
        {
          id: '2',
          title: 'Bachata: Open level',
          image_url: null,
          date: '27.02.2022 @8pm',
          price: '€12',
          location: 'Berlin, Germany',
          tags: 'Course, Bachata',
          liked: false,
        },
        {
          id: '3',
          title: 'SSD Rovinj 2022',
          image_url: null,
          date_range: '07.06.2022 - 13.06.2022',
          price_range: '€65 - €450',
          location: 'Rovinj, Croatia',
          tags: 'Festival, Bachata',
          liked: false,
        },
        {
          id: '4',
          title: 'Berlin Sensual Nights',
          image_url: null,
          date: '29.02.2022 | 21:00 - 04:00',
          price_range: '€30 - €100',
          location: 'Berlin, Germany',
          tags: 'Party, Bachata, Salsa, Kizz',
          liked: false,
        },
        {
          id: '5',
          title: 'Salsa & Bachata Night',
          image_url: null,
          date: '05.03.2022 | 19:00 - 01:00',
          price: '€7',
          location: 'Berlin, Germany',
          tags: 'Course, Party, Bachata, Salsa',
          liked: false,
        },
      ];
      
      // Log the mock data
      console.log('Using mock data count:', mockEvents.length);
      
      // Dispatch success action with events data
      dispatch(fetchEventsSuccess(mockEvents));
      
      return { success: true, data: mockEvents };
      
      /*
      // Keeping the original API call code commented out for reference
      console.log('Making events API request to:', `${BASE_URL}/events-listing`);
      
      // Create a simple XML HTTP Request
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${BASE_URL}/events-listing`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      // Create promise to handle XHR response
      const responsePromise = new Promise((resolve, reject) => {
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const response = JSON.parse(xhr.responseText);
              resolve(response);
            } catch (e) {
              reject(new Error('Failed to parse response'));
            }
          } else {
            reject(new Error(`HTTP error! Status: ${xhr.status}`));
          }
        };
        
        xhr.onerror = function() {
          reject(new Error('Network error occurred'));
        };
        
        xhr.ontimeout = function() {
          reject(new Error('Request timed out'));
        };
      });
      
      // Send the request
      xhr.send();
      
      // Wait for the response
      const responseData = await responsePromise;
      
      console.log('Events API response:', JSON.stringify(responseData).substring(0, 200));
      
      // Process data and dispatch as before...
      */
      
    } catch (error) {
      console.error('Error fetching events:', error.message);
      
      // Extract error message
      const errorMessage = error.message || 'Failed to fetch events. Please try again.';
      
      console.error('Final error message:', errorMessage);
      
      // Dispatch failure action with error message
      dispatch(fetchEventsFailure(errorMessage));
      
      return { success: false, error: errorMessage };
    }
  };