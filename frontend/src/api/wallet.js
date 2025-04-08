import axios from 'axios';
import { addAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const walletApi = {
  getWallets: async () => {
    return await axios.get(`${API_URL}/wallets`, addAuthHeader());
  },
  
  getWallet: async (id) => {
    return await axios.get(`${API_URL}/wallets/${id}`, addAuthHeader());
  },
  
  createWallet: async (data) => {
    return await axios.post(`${API_URL}/wallets`, data, addAuthHeader());
  },
  
  updateWallet: async (id, data) => {
    return await axios.patch(`${API_URL}/wallets/${id}`, data, addAuthHeader());
  },
  
  deleteWallet: async (id) => {
    return await axios.delete(`${API_URL}/wallets/${id}`, addAuthHeader());
  },
  
  getWalletBalance: async (id) => {
    return await axios.get(`${API_URL}/wallets/${id}/balance`, addAuthHeader());
  },
  
  importWallet: async (data) => {
    return await axios.post(`${API_URL}/wallets/import`, data, addAuthHeader());
  },
  
  getWalletTransactions: async (id, page = 1, limit = 10) => {
    return await axios.get(
      `${API_URL}/wallets/${id}/transactions?page=${page}&limit=${limit}`,
      addAuthHeader()
    );
  }
};

export default walletApi;