import axios from 'axios';
import { getAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authApi = {
  login: async (key) => {
    return await axios.post(`${API_URL}/auth/login`, { key });
  },
  
  getProfile: async () => {
    return await axios.get(`${API_URL}/auth/profile`, {
      headers: getAuthHeader()
    });
  },
  
  createUser: async (data) => {
    return await axios.post(`${API_URL}/auth/users`, data, {
      headers: getAuthHeader()
    });
  }
};

export default authApi;