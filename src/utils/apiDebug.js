// API Debugging Utility

// Set to true to enable detailed API logging
const DEBUG_ENABLED = true;

/**
 * Log API request details
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Request options
 */
export const logRequest = (endpoint, options) => {
  if (!DEBUG_ENABLED) return;
  
  console.log(`🚀 API Request: ${endpoint}`);
  console.log('📤 Method:', options.method || 'GET');
  console.log('📤 Headers:', JSON.stringify(options.headers || {}));
  
  if (options.body) {
    try {
      console.log('📤 Body:', typeof options.body === 'string' 
        ? options.body.substring(0, 500) 
        : JSON.stringify(options.body).substring(0, 500));
    } catch (e) {
      console.log('📤 Body: [Could not stringify body]');
    }
  }
};

/**
 * Log API response details
 * @param {string} endpoint - API endpoint
 * @param {Object} response - API response
 */
export const logResponse = (endpoint, response) => {
  if (!DEBUG_ENABLED) return;
  
  console.log(`📥 API Response from: ${endpoint}`);
  console.log('📥 Status:', response.status);
  
  try {
    console.log('📥 Headers:', JSON.stringify(response.headers || {}));
  } catch (e) {
    console.log('📥 Headers: [Could not stringify headers]');
  }
  
  try {
    console.log('📥 Body:', JSON.stringify(response.data).substring(0, 500) + 
      (JSON.stringify(response.data).length > 500 ? '...' : ''));
  } catch (e) {
    console.log('📥 Body: [Could not stringify response data]');
  }
};

/**
 * Log API error details
 * @param {string} endpoint - API endpoint
 * @param {Error} error - Error object
 */
export const logError = (endpoint, error) => {
  if (!DEBUG_ENABLED) return;
  
  console.error(`❌ API Error on: ${endpoint}`);
  console.error('❌ Message:', error.message);
  
  if (error.response) {
    console.error('❌ Response Status:', error.response.status);
    try {
      console.error('❌ Response Data:', JSON.stringify(error.response.data));
    } catch (e) {
      console.error('❌ Response Data: [Could not stringify response data]');
    }
  } else if (error.request) {
    console.error('❌ Request Sent But No Response Received');
  } else {
    console.error('❌ Error Setting Up Request:', error.message);
  }
  
  if (error.stack) {
    console.error('❌ Stack:', error.stack);
  }
};

/**
 * Create a formatted debug message for display
 * @param {string} title - Debug message title
 * @param {any} data - Data to include in debug message
 * @returns {string} Formatted debug message
 */
export const formatDebugMessage = (title, data) => {
  try {
    return `${title}:\n${typeof data === 'string' ? data : JSON.stringify(data, null, 2)}`;
  } catch (e) {
    return `${title}: [Could not format data]`;
  }
};

export default {
  logRequest,
  logResponse,
  logError,
  formatDebugMessage
};