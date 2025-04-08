import React, { createContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import walletApi from '../api/wallet';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallets, setWallets] = useState([]);
  const [currentWallet, setCurrentWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get all wallets
  const getWallets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.getWallets();
      setWallets(response.data.data.wallets);
      return response.data.data.wallets;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wallets');
      toast.error(err.response?.data?.message || 'Failed to fetch wallets');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get a single wallet
  const getWallet = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.getWallet(id);
      setCurrentWallet(response.data.data.wallet);
      return response.data.data.wallet;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wallet');
      toast.error(err.response?.data?.message || 'Failed to fetch wallet');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Create a new wallet
  const createWallet = useCallback(async (walletData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.createWallet(walletData);
      setWallets(prev => [...prev, response.data.data.wallet]);
      toast.success('Wallet created successfully');
      return response.data.data.wallet;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create wallet');
      toast.error(err.response?.data?.message || 'Failed to create wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update wallet
  const updateWallet = useCallback(async (id, walletData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.updateWallet(id, walletData);
      setWallets(prev => prev.map(wallet => 
        wallet._id === id ? response.data.data.wallet : wallet
      ));
      
      if (currentWallet?._id === id) {
        setCurrentWallet(response.data.data.wallet);
      }
      
      toast.success('Wallet updated successfully');
      return response.data.data.wallet;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update wallet');
      toast.error(err.response?.data?.message || 'Failed to update wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentWallet]);
  
  // Delete wallet
  const deleteWallet = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await walletApi.deleteWallet(id);
      setWallets(prev => prev.filter(wallet => wallet._id !== id));
      
      if (currentWallet?._id === id) {
        setCurrentWallet(null);
      }
      
      toast.success('Wallet deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete wallet');
      toast.error(err.response?.data?.message || 'Failed to delete wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentWallet]);
  
  // Get wallet balance
  const getWalletBalance = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.getWalletBalance(id);
      
      // Update wallet in state
      setWallets(prev => prev.map(wallet => 
        wallet._id === id 
          ? { ...wallet, balance: response.data.data.balance, tokens: response.data.data.tokens }
          : wallet
      ));
      
      if (currentWallet?._id === id) {
        setCurrentWallet(prev => ({
          ...prev,
          balance: response.data.data.balance,
          tokens: response.data.data.tokens
        }));
      }
      
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch wallet balance');
      toast.error(err.response?.data?.message || 'Failed to fetch wallet balance');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentWallet]);
  
  // Import wallet
  const importWallet = useCallback(async (walletData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.importWallet(walletData);
      setWallets(prev => [...prev, response.data.data.wallet]);
      toast.success('Wallet imported successfully');
      return response.data.data.wallet;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to import wallet');
      toast.error(err.response?.data?.message || 'Failed to import wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get wallet transactions
  const getWalletTransactions = useCallback(async (id, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.getWalletTransactions(id, page, limit);
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
  
  // Create tracked wallet (for copy trading)
  const createTrackedWallet = useCallback(async (walletData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await walletApi.createWallet({
        ...walletData,
        isTracked: true
      });
      
      setWallets(prev => [...prev, response.data.data.wallet]);
      toast.success('Tracked wallet added successfully');
      return response.data.data.wallet;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add tracked wallet');
      toast.error(err.response?.data?.message || 'Failed to add tracked wallet');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Value to provide
  const value = {
    wallets,
    currentWallet,
    transactions,
    loading,
    error,
    getWallets,
    getWallet,
    createWallet,
    updateWallet,
    deleteWallet,
    getWalletBalance,
    importWallet,
    getWalletTransactions,
    createTrackedWallet
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
