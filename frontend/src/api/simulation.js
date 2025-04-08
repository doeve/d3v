import axios from 'axios';
import { addAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const simulationApi = {
  getSimulations: async () => {
    return await axios.get(`${API_URL}/simulation`, addAuthHeader());
  },
  
  getSimulation: async (id) => {
    return await axios.get(`${API_URL}/simulation/${id}`, addAuthHeader());
  },
  
  createSimulation: async (data) => {
    return await axios.post(`${API_URL}/simulation`, data, addAuthHeader());
  },
  
  updateSimulation: async (id, data) => {
    return await axios.patch(`${API_URL}/simulation/${id}`, data, addAuthHeader());
  },
  
  deleteSimulation: async (id) => {
    return await axios.delete(`${API_URL}/simulation/${id}`, addAuthHeader());
  },
  
  addTrackedWallet: async (id, data) => {
    return await axios.post(`${API_URL}/simulation/${id}/wallets`, data, addAuthHeader());
  },
  
  setupCopyTrade: async (id, data) => {
    return await axios.post(`${API_URL}/simulation/${id}/copy-trades`, data, addAuthHeader());
  },
  
  generateTransaction: async (id, walletId) => {
    return await axios.post(`${API_URL}/simulation/${id}/transactions`, { walletId }, addAuthHeader());
  },
  
  fastForward: async (id, days) => {
    return await axios.post(`${API_URL}/simulation/${id}/fast-forward`, { days }, addAuthHeader());
  },
  
  getPerformance: async (id) => {
    return await axios.get(`${API_URL}/simulation/${id}/performance`, addAuthHeader());
  },
  
  resetSimulation: async (id) => {
    return await axios.post(`${API_URL}/simulation/${id}/reset`, {}, addAuthHeader());
  }
};

export default simulationApi;