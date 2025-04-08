import React, { useState } from 'react';
import { FaForward, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useSimulation } from '../../hooks/useSimulation';

const FastForwardModal = ({ isOpen, onClose, simulationId, onComplete }) => {
  const { fastForward, loading } = useSimulation();
  
  const [days, setDays] = useState(1);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await fastForward(simulationId, days);
      
      // Reset form
      setDays(1);
      
      // Execute callback if provided
      if (onComplete) {
        onComplete();
      }
      
      // Close modal
      onClose();
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
            <FaForward className="mr-2" /> Fast Forward Simulation
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4 flex items-start">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-md text-blue-800 dark:text-blue-300 mr-3 flex-shrink-0">
              <FaInfoCircle className="text-lg" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Fast forwarding will automatically generate transactions for tracked wallets and execute copy trades according to your settings. This simulates the passage of time in your simulation.
            </p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Number of Days to Fast Forward
            </label>
            <input
              type="number"
              id="days"
              name="days"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value))}
              min="1"
              max="30"
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Choose between 1-30 days (more days will generate more transactions)
            </p>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading || days < 1 || days > 30}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fast Forwarding...
                </>
              ) : (
                `Fast Forward ${days} ${days === 1 ? 'Day' : 'Days'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FastForwardModal;