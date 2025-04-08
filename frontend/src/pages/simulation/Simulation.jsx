import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaSearch, FaFlask, FaPlay, FaPause, FaEye } from 'react-icons/fa';
import { useSimulation } from '../../hooks/useSimulation';
import SimulationCard from '../../components/simulation/SimulationCard';
import CreateSimulationModal from '../../components/simulation/CreateSimulationModal';
import { formatCurrency } from '../../utils/format';

const Simulation = () => {
  const { simulations, getSimulations, loading } = useSimulation();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    getSimulations();
  }, [getSimulations]);
  
  // Filter simulations based on filter and search
  const filteredSimulations = simulations.filter(simulation => {
    // Apply filter
    if (filter === 'active' && simulation.status !== 'active') {
      return false;
    }
    
    if (filter === 'paused' && simulation.status !== 'paused') {
      return false;
    }
    
    if (filter === 'completed' && simulation.status !== 'completed') {
      return false;
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      return simulation.name.toLowerCase().includes(searchLower);
    }
    
    return true;
  });
  
  // Calculate summary stats
  const activeSimulations = simulations.filter(s => s.status === 'active').length;
  const totalBalance = simulations.reduce((sum, s) => sum + s.currentBalance, 0);
  const avgROI = simulations.length > 0
    ? simulations.reduce((sum, s) => sum + (s.performance?.roi || 0), 0) / simulations.length
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Simulation Mode</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> New Simulation
          </button>
        </div>
      </div>
      
      {/* Info box */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FaFlask className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
              About Simulation Mode
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <p>
                Simulation mode allows you to test copy trading strategies without using real funds.
                You can set up tracked wallets, configure copy trading, and fast-forward time to see results.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Simulations</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {activeSimulations}
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaPlay />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Simulated Balance</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaFlask />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average ROI</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {avgROI.toFixed(2)}%
              </p>
            </div>
            <div className={`p-2 rounded-full ${
              avgROI >= 0 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              <FaFlask />
            </div>
          </div>
        </div>
      </div>
      
      {/* Filter and search row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search simulations..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center">
          <FaFilter className="text-gray-500 dark:text-gray-400 mr-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2"
          >
            <option value="all">All Simulations</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
            <option value="completed">Completed Only</option>
          </select>
        </div>
      </div>
      
      {/* Simulations grid */}
      {loading && simulations.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : filteredSimulations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulations.map(simulation => (
            <SimulationCard key={simulation._id} simulation={simulation} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <FaFlask className="text-4xl text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No simulations found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || filter !== 'all'
              ? 'Try changing your search or filter settings'
              : 'Create a simulation to test your copy trading strategies'}
          </p>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="inline mr-2" /> New Simulation
          </button>
        </div>
      )}
      
      {/* Create simulation modal */}
      <CreateSimulationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default Simulation;