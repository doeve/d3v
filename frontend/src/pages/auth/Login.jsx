import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import { useUI } from '../../hooks/useUI';
import { FaEye, FaEyeSlash, FaMoon, FaSun } from 'react-icons/fa';

const Login = () => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useUI();
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (key.length !== 16) {
      toast.error('Key must be exactly 16 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await login(key);
      
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="m-auto w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <img src="/assets/images/logo.svg" alt="D3V" className="h-10 w-10" />
                <h1 className="ml-2 text-2xl font-bold text-blue-600 dark:text-blue-400">D3V</h1>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Blockchain Wallet Management
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label 
                  htmlFor="key" 
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  16-Character Access Key
                </label>
                
                <div className="relative">
                  <input
                    id="key"
                    type={showKey ? 'text' : 'password'}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder="Enter your 16-character key"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={16}
                    required
                  />
                  
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                    onClick={() => setShowKey(!showKey)}
                  >
                    {showKey ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {key.length} / 16 characters
                  </span>
                  
                  {key.length > 0 && key.length !== 16 && (
                    <span className="text-xs text-red-500">
                      Must be exactly 16 characters
                    </span>
                  )}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || key.length !== 16}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  loading || key.length !== 16
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                } transition duration-200`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Accessing...
                  </span>
                ) : (
                  'Access Platform'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>This platform requires a 16-character key.</p>
              <p className="mt-1">No registration is required.</p>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                Simulation Mode Available
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Try copy trading strategies with dummy money before using real funds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;