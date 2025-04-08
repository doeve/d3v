import axios from 'axios';
import { addAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const adminApi = {
  getAllUsers: async () => {
    return await axios.get(`${API_URL}/admin/users`, addAuthHeader());
  },
  
  getUser: async (id) => {
    return await axios.get(`${API_URL}/admin/users/${id}`, addAuthHeader());
  },
  
  updateUser: async (id, data) => {
    return await axios.patch(`${API_URL}/admin/users/${id}`, data, addAuthHeader());
  },
  
  deleteUser: async (id) => {
    return await axios.delete(`${API_URL}/admin/users/${id}`, addAuthHeader());
  },
  
  getSystemStats: async () => {
    return await axios.get(`${API_URL}/admin/stats`, addAuthHeader());
  }
};

export default adminApi;