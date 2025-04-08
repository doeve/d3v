import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import simulationApi from '../api/simulation';

export const SimulationContext = createContext();

export const SimulationProvider = ({ children }) => {
  const [simulations, setSimulations] = useState([]);
  const [currentSimulation, setCurrentSimulation] = useState(null);
  const [simulationWallets, setSimulationWallets] = useState([]);
  const [simulationCopyTrades, setSimulationCopyTrades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Get all simulations
  const getSimulations = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.getSimulations();
      setSimulations(response.data.data.simulations);
      return response.data.data.simulations;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch simulations');
      toast.error(err.response?.data?.message || 'Failed to fetch simulations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get a simulation
  const getSimulation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.getSimulation(id);
      setCurrentSimulation(response.data.data.simulation);
      return response.data.data.simulation;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch simulation');
      toast.error(err.response?.data?.message || 'Failed to fetch simulation');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Create a simulation
  const createSimulation = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.createSimulation(data);
      setSimulations(prev => [...prev, response.data.data.simulation]);
      toast.success('Simulation created successfully');
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create simulation');
      toast.error(err.response?.data?.message || 'Failed to create simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Update a simulation
  const updateSimulation = useCallback(async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.updateSimulation(id, data);
      
      setSimulations(prev => 
        prev.map(simulation => 
          simulation._id === id ? response.data.data.simulation : simulation
        )
      );
      
      if (currentSimulation?._id === id) {
        setCurrentSimulation(response.data.data.simulation);
      }
      
      toast.success('Simulation updated successfully');
      return response.data.data.simulation;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update simulation');
      toast.error(err.response?.data?.message || 'Failed to update simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentSimulation]);
  
  // Delete a simulation
  const deleteSimulation = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await simulationApi.deleteSimulation(id);
      
      setSimulations(prev => 
        prev.filter(simulation => simulation._id !== id)
      );
      
      if (currentSimulation?._id === id) {
        setCurrentSimulation(null);
      }
      
      toast.success('Simulation deleted successfully');
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete simulation');
      toast.error(err.response?.data?.message || 'Failed to delete simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentSimulation]);
  
  // Add tracked wallet to simulation
  const addTrackedWallet = useCallback(async (simulationId, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.addTrackedWallet(simulationId, data);
      
      setSimulationWallets(prev => [...prev, response.data.data.wallet]);
      
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
  
  // Setup copy trade in simulation
  const setupCopyTrade = useCallback(async (simulationId, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.setupCopyTrade(simulationId, data);
      
      setSimulationCopyTrades(prev => [...prev, response.data.data.copyTrade]);
      
      toast.success('Copy trade setup created successfully');
      return response.data.data.copyTrade;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to setup copy trade');
      toast.error(err.response?.data?.message || 'Failed to setup copy trade');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Generate transaction
  const generateTransaction = useCallback(async (simulationId, walletId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.generateTransaction(simulationId, walletId);
      
      toast.success('Transaction generated successfully');
      return response.data.data.transaction;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate transaction');
      toast.error(err.response?.data?.message || 'Failed to generate transaction');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Fast forward simulation
  const fastForward = useCallback(async (simulationId, days) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.fastForward(simulationId, days);
      
      toast.success(`Fast-forwarded ${days} days with ${response.data.data.transactionsGenerated} transactions`);
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fast forward simulation');
      toast.error(err.response?.data?.message || 'Failed to fast forward simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Get simulation performance
  const getPerformance = useCallback(async (simulationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.getPerformance(simulationId);
      return response.data.data.performance;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get performance data');
      toast.error(err.response?.data?.message || 'Failed to get performance data');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Reset simulation
  const resetSimulation = useCallback(async (simulationId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await simulationApi.resetSimulation(simulationId);
      
      if (currentSimulation?._id === simulationId) {
        setCurrentSimulation(response.data.data.simulation);
      }
      
      setSimulations(prev => 
        prev.map(simulation => 
          simulation._id === simulationId ? response.data.data.simulation : simulation
        )
      );
      
      toast.success('Simulation reset successfully');
      return response.data.data.simulation;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset simulation');
      toast.error(err.response?.data?.message || 'Failed to reset simulation');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentSimulation]);
  
  // Get simulation wallets
  const getSimulationWallets = useCallback(async (simulationId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Assuming the simulation details includes wallets
      const simulation = await getSimulation(simulationId);
      
      if (simulation?.wallets) {
        setSimulationWallets(simulation.wallets);
        return simulation.wallets;
      }
      
      return [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get simulation wallets');
      toast.error(err.response?.data?.message || 'Failed to get simulation wallets');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getSimulation]);
  
  // Get simulation copy trades
  const getSimulationCopyTrades = useCallback(async (simulationId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Assuming the simulation details includes copy trades
      const simulation = await getSimulation(simulationId);
      
      if (simulation?.copyTrades) {
        setSimulationCopyTrades(simulation.copyTrades);
        return simulation.copyTrades;
      }
      
      return [];
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to get simulation copy trades');
      toast.error(err.response?.data?.message || 'Failed to get simulation copy trades');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getSimulation]);
  
  const value = {
    simulations,
    currentSimulation,
    simulationWallets,
    simulationCopyTrades,
    loading,
    error,
    getSimulations,
    getSimulation,
    createSimulation,
    updateSimulation,
    deleteSimulation,
    addTrackedWallet,
    setupCopyTrade,
    generateTransaction,
    fastForward,
    getPerformance,
    resetSimulation,
    getSimulationWallets,
    getSimulationCopyTrades
  };
  
  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};