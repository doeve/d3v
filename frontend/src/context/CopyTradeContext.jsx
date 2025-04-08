import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import copyTradeApi from '../api/copyTrade';

export const CopyTradeContext = createContext();

export const CopyTradeProvider = ({ children }) => {
  const [copyTrades, setCopyTrades] = useState([]);
  const [currentCopyTrade, setCurrentCopyTrade] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get all copy trades
  const getCopyTrades = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await copyTradeApi.getCopyTrades();
      setCopyTrades(response.data.data.copyTrades);
      return response.data.data.copyTrades;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch copy trades');
      toast.error(err.response?.data?.message || 'Failed to fetch copy trades');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get a single copy trade
  const getCopyTrade = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await copyTradeApi.getCopyTrade(id);
      setCurrentCopyTrade(response.data.data.copyTrade);
      return response.data.data.copyTrade;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch copy trade');
      toast.error(err.response?.data?.message || 'Failed to fetch copy trade');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Create a new copy trade
  const createCopyTrade = useCallback(async (copyTradeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await copyTradeApi.createCopyTrade(copyTradeData);
      setCopyTrades(prev => [...prev, response.data.data.copyTrade]);
      toast.success('Copy trade setup created successfully');
      return response.data.data.copyTrade;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create copy trade setup');
      toast.error(err.response?.data?.message || 'Failed to create copy trade setup');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update copy trade
  const updateCopyTrade = useCallback(async (id, copyTradeData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await copyTradeApi.updateCopyTrade(id, copyTradeData);
      setCopyTrades(prev => 
        prev.map(copyTrade => 
          copyTrade._id === id ? response.data.data.copyTrade : copyTrade
        )
      );
      
      if (currentCopyTrade?._id === id) {
        setCurrentCopyTrade(response.data.data.copyTrade);
      }
      
      toast.success('Copy trade updated successfully');
      return response.data.data.copyTrade;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update copy trade');
      toast.error(err.response?.data?.message || 'Failed to update copy trade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCopyTrade]);
  
  // Delete copy trade
  const deleteCopyTrade = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await copyTradeApi.deleteCopyTrade(id);
      setCopyTrades(prev => prev.filter(copyTrade => copyTrade._id !== id));
      
      if (currentCopyTrade?._id === id) {
        setCurrentCopyTrade(null);
      }
      
      toast.success('Copy trade deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete copy trade');
      toast.error(err.response?.data?.message || 'Failed to delete copy trade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCopyTrade]);
  
  // Get copy trade statistics
  const getCopyTradeStatistics = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await copyTradeApi.getCopyTradeStatistics(id);
      
      // Update copy trade in state with new statistics
      setCopyTrades(prev => 
        prev.map(copyTrade => 
          copyTrade._id === id 
            ? { ...copyTrade, statistics: response.data.data.statistics }
            : copyTrade
        )
      );
      
      if (currentCopyTrade?._id === id) {
        setCurrentCopyTrade(prev => ({
          ...prev,
          statistics: response.data.data.statistics
        }));
      }
      
      return response.data.data.statistics;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
      toast.error(err.response?.data?.message || 'Failed to fetch statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentCopyTrade]);
  
  // Get copy trade transactions
  const getCopyTradeTransactions = useCallback(async (id, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await copyTradeApi.getCopyTradeTransactions(id, page, limit);
      setTransactions(response.data.data.transactions);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
      toast.error(err.response?.data?.message || 'Failed to fetch transactions');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Value to provide
  const value = {
    copyTrades,
    currentCopyTrade,
    transactions,
    loading,
    error,
    getCopyTrades,
    getCopyTrade,
    createCopyTrade,
    updateCopyTrade,
    deleteCopyTrade,
    getCopyTradeStatistics,
    getCopyTradeTransactions
  };
  
  return (
    <CopyTradeContext.Provider value={value}>
      {children}
    </CopyTradeContext.Provider>
  );
};