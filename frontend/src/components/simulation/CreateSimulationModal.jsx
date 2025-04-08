import React, { useState } from 'react';
import { FaFlask, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useSimulation } from '../../hooks/useSimulation';
import { useNavigate } from 'react-router-dom';

const CreateSimulationModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { createSimulation, loading } = useSimulation();
  
  const [formData, setFormData] = useState({
    name: '',
    initialBalance: 10000,
    blockchain: 'solana',
    settings: {
      speed: 1,
      marketVolatility: 1,
      fees: 0.1
    }
  });
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (settings)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'number' ? parseFloat(value) : value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) : value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await createSimulation(formData);
      
      // Reset form
      setFormData({
        name: '',
        initialBalance: 10000,
        blockchain: 'solana',
        settings: {
          speed: 1,
          marketVolatility: 1,
          fees: 0.1
        }
      });
      
      // Close modal
      onClose();
      
      // Navigate to the new simulation
      navigate(`/simulation/${result.simulation._id}`);
    } catch (error) {
      // Error handled in context
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FaFlask className="mr-2" /> Create New Simulation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Simulation Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Simulation"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Balance
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 dark:text-gray-400">
                $
              </span>
              <input
                type="number"
                id="initialBalance"
                name="initialBalance"
                value={formData.initialBalance}
                onChange={handleChange}
                min="100"
                step="100"
                required
                className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              This is the amount of simulated money you'll start with
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="blockchain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blockchain
            </label>
            <select
              id="blockchain"
              name="blockchain"
              value={formData.blockchain}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="solana">Solana</option>
              <option value="ethereum">Ethereum</option>
              <option value="binance">Binance Smart Chain</option>
              <option value="polygon">Polygon</option>
              <option value="avalanche">Avalanche</option>
            </select>
          </div>
          
          <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850">
            <div className="flex items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Advanced Settings
              </h3>
              <div className="ml-2 text-gray-500 dark:text-gray-400 text-xs">
                <FaInfoCircle />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="settings.speed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Simulation Speed
                </label>
                <input
                  type="number"
                  id="settings.speed"
                  name="settings.speed"
                  value={formData.settings.speed}
                  onChange={handleChange}
                  min="0.1"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Higher values make trading events occur more frequently (default: 1)
                </p>
              </div>
              
              <div>
                <label htmlFor="settings.marketVolatility" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Market Volatility
                </label>
                <input
                  type="number"
                  id="settings.marketVolatility"
                  name="settings.marketVolatility"
                  value={formData.settings.marketVolatility}
                  onChange={handleChange}
                  min="0.1"
                  max="10"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Higher values create more price movement (default: 1)
                </p>
              </div>
              
              <div>
                <label htmlFor="settings.fees" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Transaction Fees (%)
                </label>
                <input
                  type="number"
                  id="settings.fees"
                  name="settings.fees"
                  value={formData.settings.fees}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Percentage fee applied to each transaction (default: 0.1%)
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                'Create Simulation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSimulationModal;