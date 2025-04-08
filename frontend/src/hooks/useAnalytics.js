import { useContext, useCallback, useState } from 'react';
import analyticsApi from '../api/analytics';

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get wallet performance
  const getWalletPerformance = useCallback(async (walletId, period = 'month') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getWalletPerformance(walletId, period);
      return response.data.data.performance;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wallet performance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get copy trade performance
  const getCopyTradePerformance = useCallback(async (copyTradeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getCopyTradePerformance(copyTradeId);
      return response.data.data.performance;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch copy trade performance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get portfolio overview
  const getPortfolioOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getPortfolioOverview();
      return response.data.data.portfolio;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch portfolio overview');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get token distribution
  const getTokenDistribution = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getTokenDistribution();
      return response.data.data.distribution;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch token distribution');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get trading history
  const getTradingHistory = useCallback(async (days = 30) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getTradingHistory(days);
      return response.data.data.history;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch trading history');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get copy trading summary
  const getCopyTradingSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await analyticsApi.getCopyTradingSummary();
      return response.data.data.summary;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch copy trading summary');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    loading,
    error,
    getWalletPerformance,
    getCopyTradePerformance,
    getPortfolioOverview,
    getTokenDistribution,
    getTradingHistory,
    getCopyTradingSummary
  };
};