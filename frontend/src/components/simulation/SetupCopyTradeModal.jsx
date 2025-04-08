import React, { useState } from 'react';
import { FaExchangeAlt, FaTimes } from 'react-icons/fa';
import { useSimulation } from '../../hooks/useSimulation';
import { shortenAddress } from '../../utils/format';

const SetupCopyTradeModal = ({ isOpen, onClose, simulationId, wallets = [] }) => {
  const { setupCopyTrade, loading } = useSimulation();
  
  const [formData, setFormData] = useState({
    sourceWalletId: '',
    targetWalletId: '',
    ratioType: 'dynamic',
    ratioValue: 1
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await setupCopyTrade(simulationId, formData);
      
      // Reset form
      setFormData({
        sourceWalletId: '',
        targetWalletId: '',
        ratioType: 'dynamic',
        ratioValue: 1
      });
      
      // Close modal
      onClose();
    } catch (error) {
      // Error handled in context
    }
  };

  // Filter wallets
  const sourceOptions = wallets.filter(w => w.isTracked);
  const targetOptions = wallets.filter(w => !w.isTracked);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FaExchangeAlt className="mr-2" /> Setup Copy Trade
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
            <label htmlFor="sourceWalletId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source Wallet (To Copy From)
            </label>
            <select
              id="sourceWalletId"
              name="sourceWalletId"
              value={formData.sourceWalletId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select source wallet</option>
              {sourceOptions.map(wallet => (
                <option key={wallet._id} value={wallet._id}>
                  {wallet.name} - {shortenAddress(wallet.address)}
                </option>
              ))}
            </select>
            {sourceOptions.length === 0 && (
              <p className="mt-1 text-xs text-red-500">
                No tracked wallets available. Please add a tracked wallet first.
              </p>
            )}
          </div>
          
          <div className="mb-4">
            <label htmlFor="targetWalletId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Wallet (Your Wallet)
            </label>
            <select
              id="targetWalletId"
              name="targetWalletId"
              value={formData.targetWalletId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select target wallet</option>
              {targetOptions.map(wallet => (
                <option key={wallet._id} value={wallet._id}>
                  {wallet.name} - {shortenAddress(wallet.address)}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="ratioType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Copy Ratio Type
            </label>
            <select
              id="ratioType"
              name="ratioType"
              value={formData.ratioType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="dynamic">Dynamic (Based on Wallet Balance)</option>
              <option value="fixed">Fixed Ratio</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          
          {formData.ratioType === 'fixed' && (
            <div className="mb-4">
              <label htmlFor="ratioValue" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Fixed Ratio Value
              </label>
              <div className="flex items-center">
                <input
                  type="number"
                  id="ratioValue"
                  name="ratioValue"
                  value={formData.ratioValue}
                  onChange={handleChange}
                  step="0.01"
                  min="0.01"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">×</span>
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Example: If set to 0.5 and source invests $100, you'll invest $50
              </p>
            </div>
          )}
          
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
              disabled={loading || sourceOptions.length === 0}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up...
                </>
              ) : (
                'Setup Copy Trade'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetupCopyTradeModal;