import React, { useState, useEffect } from 'react';
import { FaCog, FaPalette, FaDollarSign, FaBell, FaWallet, FaExchangeAlt, FaUser, FaSave } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import BlockchainSelector from '../../components/common/BlockchainSelector';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  
  const [settings, setSettings] = useState({
    theme: darkMode ? 'dark' : 'light',
    currency: 'USD',
    notifications: true
  });
  
  const [loading, setLoading] = useState(false);
  
  // Initialize settings from user data
  useEffect(() => {
    if (user && user.settings) {
      setSettings({
        theme: user.settings.theme || darkMode ? 'dark' : 'light',
        currency: user.settings.currency || 'USD',
        notifications: user.settings.notifications !== undefined ? user.settings.notifications : true
      });
    }
  }, [user, darkMode]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Handle theme toggle
    if (name === 'theme') {
      if ((value === 'dark' && !darkMode) || (value === 'light' && darkMode)) {
        toggleDarkMode();
      }
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // In a real app, you'd update the user settings in the backend here
      // await userApi.updateSettings(settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Settings Panel */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaCog className="mr-2" /> General Settings
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Theme Setting */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <FaPalette className="mr-2" /> Theme
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={settings.theme === 'light'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Light</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={settings.theme === 'dark'}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">Dark</span>
                  </label>
                </div>
              </div>
              
              {/* Currency Setting */}
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <FaDollarSign className="mr-2" /> Currency
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
              
              {/* Notifications Setting */}
              <div>
                <label className="flex items-center cursor-pointer">
                  <div className="mr-3">
                    <input
                      type="checkbox"
                      name="notifications"
                      checked={settings.notifications}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
                    <FaBell className="mr-2" /> Enable Notifications
                  </div>
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 ml-7">
                  Receive notifications about transactions and copy trades
                </p>
              </div>
              
              {/* Blockchain API */}
              <div>
                <BlockchainSelector />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Select which blockchain API to use for wallet interactions
                </p>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
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
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" /> Save Settings
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaWallet className="mr-2" /> Wallet Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Blockchain
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="solana">Solana</option>
                  <option value="ethereum">Ethereum</option>
                  <option value="binance">Binance Smart Chain</option>
                  <option value="polygon">Polygon</option>
                </select>
              </div>
              
              <div className="pt-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Save Wallet Settings
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaUser className="mr-2" /> Account
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Account ID:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?._id || user?.id || 'Unknown'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Created:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Role:</p>
                <p className="font-medium text-gray-900 dark:text-white">
                  {user?.isAdmin ? 'Administrator' : 'User'}
                </p>
              </div>
              
              <div className="pt-2">
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaExchangeAlt className="mr-2" /> Copy Trade Settings
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Ratio Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="dynamic">Dynamic</option>
                  <option value="fixed">Fixed</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center cursor-pointer">
                  <div className="mr-3">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      defaultChecked
                    />
                  </div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Auto-confirm trades
                  </div>
                </label>
              </div>
              
              <div className="pt-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 w-full">
                  Save Copy Trade Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;