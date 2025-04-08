export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    
    return {};
  };
  
  export const addAuthHeader = (config = {}) => {
    const headers = getAuthHeader();
    
    return {
      ...config,
      headers: {
        ...config.headers,
        ...headers
      }
    };
  };