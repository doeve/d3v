import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUI } from '../../hooks/useUI';

const Layout = () => {
  const { sidebarOpen, blockchainApi } = useUI();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {blockchainApi && (
            <div className="mb-4 bg-blue-100 dark:bg-blue-900 p-2 rounded-md flex items-center text-sm">
              <span className="font-medium mr-2">Active Blockchain API:</span> 
              <span className="text-blue-700 dark:text-blue-300">{blockchainApi}</span>
            </div>
          )}
          
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;