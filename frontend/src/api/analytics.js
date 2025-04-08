import axios from 'axios';
import { addAuthHeader } from '../utils/auth';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const analyticsApi = {
  getWalletPerformance: async (id, period = 'month') => {
    return await axios.get(
      `${API_URL}/analytics/wallet/${id}/performance?period=${period}`,
      addAuthHeader()
    );
  },
  
  getCopyTradePerformance: async (id) => {
    return await axios.get(
      `${API_URL}/analytics/copy-trade/${id}/performance`,
      addAuthHeader()
    );
  },
  
  getPortfolioOverview: async () => {
    return await axios.get(
      `${API_URL}/analytics/portfolio`,
      addAuthHeader()
    );
  },
  
  getTokenDistribution: async () => {
    return await axios.get(
      `${API_URL}/analytics/tokens`,
      addAuthHeader()
    );
  },
  
  getTradingHistory: async (days = 30) => {
    return await axios.get(
      `${API_URL}/analytics/trading-history?days=${days}`,
      addAuthHeader()
    );
  },
  
  getCopyTradingSummary: async () => {
    return await axios.get(
      `${API_URL}/analytics/copy-trading`,
      addAuthHeader()
    );
  }
};

export default analyticsApi;