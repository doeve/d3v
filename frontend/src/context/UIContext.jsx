import React, { createContext, useState, useCallback, useEffect } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [blockchainApi, setBlockchainApi] = useState(localStorage.getItem('blockchainApi') || 'tatum');
  
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', newValue);
      return newValue;
    });
  }, []);
  
  // Update blockchain API and save to localStorage
  const updateBlockchainApi = useCallback((api) => {
    setBlockchainApi(api);
    localStorage.setItem('blockchainApi', api);
  }, []);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  const value = {
    sidebarOpen,
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    blockchainApi,
    setBlockchainApi: updateBlockchainApi
  };
  
  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};