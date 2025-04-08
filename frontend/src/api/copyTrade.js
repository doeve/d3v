import axios from 'axios';
import { addAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const copyTradeApi = {
  getCopyTrades: async () => {
    return await axios.get(`${API_URL}/copy-trade`, addAuthHeader());
  },
  
  getCopyTrade: async (id) => {
    return await axios.get(`${API_URL}/copy-trade/${id}`, addAuthHeader());
  },
  
  createCopyTrade: async (data) => {
    return await axios.post(`${API_URL}/copy-trade`, data, addAuthHeader());
  },
  
  updateCopyTrade: async (id, data) => {
    return await axios.patch(`${API_URL}/copy-trade/${id}`, data, addAuthHeader());
  },
  
  deleteCopyTrade: async (id) => {
    return await axios.delete(`${API_URL}/copy-trade/${id}`, addAuthHeader());
  },
  
  getCopyTradeStatistics: async (id) => {
    return await axios.get(`${API_URL}/copy-trade/${id}/statistics`, addAuthHeader());
  },
  
  getCopyTradeTransactions: async (id, page = 1, limit = 10) => {
    return await axios.get(
      `${API_URL}/copy-trade/${id}/transactions?page=${page}&limit=${limit}`,
      addAuthHeader()
    );
  }
};

export default copyTradeApi;