import React, { useState, useEffect } from 'react';
import { FaExchangeAlt, FaTimes, FaWallet, FaCog, FaInfoCircle } from 'react-icons/fa';
import { useCopyTrade } from '../../hooks/useCopyTrade';
import { useWallet } from '../../hooks/useWallet';
import { shortenAddress } from '../../utils/format';

const CopyTradeSetupModal = ({ isOpen, onClose, editMode = false, initialData = null }) => {
  const { createCopyTrade, updateCopyTrade, loading } = useCopyTrade();
  const { wallets, getWallets, loading: walletsLoading } = useWallet();
  
  const [formData, setFormData] = useState({
    sourceWalletId: '',
    targetWalletId: '',
    ratioType: 'dynamic',
    ratioValue: 1,
    minAmount: 0,
    maxAmount: 0,
    tokens: [],
    isSimulated: false
  });
  
  const [customToken, setCustomToken] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Fetch wallets when modal opens
  useEffect(() => {
    if (isOpen) {
      getWallets();
    }
  }, [isOpen, getWallets]);
  
  // Set initial data for edit mode
  useEffect(() => {
    if (editMode && initialData) {
      setFormData({
        sourceWalletId: initialData.sourceWalletId._id || initialData.sourceWalletId,
        targetWalletId: initialData.targetWalletId._id || initialData.targetWalletId,
        ratioType: initialData.ratioType,
        ratioValue: initialData.ratioValue,
        minAmount: initialData.minAmount,
        maxAmount: initialData.maxAmount,
        tokens: initialData.tokens || [],
        isSimulated: initialData.isSimulated
      });
      
      if (initialData.minAmount > 0 || initialData.maxAmount > 0 || (initialData.tokens && initialData.tokens.length > 0)) {
        setShowAdvanced(true);
      }
    }
  }, [editMode, initialData]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleTokenAdd = () => {
    if (customToken && !formData.tokens.includes(customToken)) {
      setFormData(prev => ({
        ...prev,
        tokens: [...prev.tokens, customToken]
      }));
      setCustomToken('');
    }
  };
  
  const handleTokenRemove = (token) => {
    setFormData(prev => ({
      ...prev,
      tokens: prev.tokens.filter(t => t !== token)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editMode) {
        await updateCopyTrade(initialData._id, formData);
      } else {
        await createCopyTrade(formData);
      }
      
      // Reset form and close modal
      setFormData({
        sourceWalletId: '',
        targetWalletId: '',
        ratioType: 'dynamic',
        ratioValue: 1,
        minAmount: 0,
        maxAmount: 0,
        tokens: [],
        isSimulated: false
      });
      
      setShowAdvanced(false);
      onClose();
    } catch (error) {
      // Error is handled in context
    }
  };
  
  // Filter wallet options
  const sourceWalletOptions = wallets.filter(w => w.isTracked || !w.isSimulated);
  const targetWalletOptions = wallets.filter(w => !w.isTracked && (w.isSimulated === formData.isSimulated));
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <FaExchangeAlt className="mr-2" /> 
            {editMode ? 'Edit Copy Trade' : 'Set Up Copy Trading'}
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
              disabled={walletsLoading}
            >
              <option value="">Select source wallet</option>
              {sourceWalletOptions.map(wallet => (
                <option key={wallet._id} value={wallet._id}>
                  {wallet.name} {wallet.isTracked ? '(Tracked)' : ''} - {shortenAddress(wallet.address)}
                </option>
              ))}
            </select>
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
              disabled={walletsLoading}
            >
              <option value="">Select target wallet</option>
              {targetWalletOptions.map(wallet => (
                <option key={wallet._id} value={wallet._id}>
                  {wallet.name} {wallet.isSimulated ? '(Simulation)' : ''} - {shortenAddress(wallet.address)}
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
            
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex items-start">
              <FaInfoCircle className="mr-1 mt-0.5 flex-shrink-0" />
              <span>
                {formData.ratioType === 'dynamic' 
                  ? 'Automatically adjusts based on the ratio of your wealth to the source wallet.'
                  : formData.ratioType === 'fixed'
                    ? 'Use a fixed multiplier for every trade.'
                    : 'Custom settings for specialized trading strategies.'}
              </span>
            </div>
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
          
          <div className="mb-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSimulated"
                name="isSimulated"
                checked={formData.isSimulated}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isSimulated" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Simulation Mode
              </label>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 pl-6">
              Test copy trading without using real funds
            </p>
          </div>
          
          <div className="mb-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              <FaCog className="mr-1" />
              {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
            </button>
          </div>
          
          {showAdvanced && (
            <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-850">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Advanced Settings
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minimum Amount
                  </label>
                  <input
                    type="number"
                    id="minAmount"
                    name="minAmount"
                    value={formData.minAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Maximum Amount
                  </label>
                  <input
                    type="number"
                    id="maxAmount"
                    name="maxAmount"
                    value={formData.maxAmount}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Track Specific Tokens (Leave empty to track all)
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={customToken}
                    onChange={(e) => setCustomToken(e.target.value)}
                    placeholder="Enter token symbol (e.g., SOL, BTC)"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    type="button"
                    onClick={handleTokenAdd}
                    disabled={!customToken}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tokens.map(token => (
                  <div 
                    key={token}
                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded flex items-center"
                  >
                    {token}
                    <button
                      type="button"
                      onClick={() => handleTokenRemove(token)}
                      className="ml-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
                {formData.tokens.length === 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    All tokens will be tracked
                  </span>
                )}
              </div>
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
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Update Copy Trade' : 'Create Copy Trade'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CopyTradeSetupModal;