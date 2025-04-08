import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaSearch, FaWallet, FaEye } from 'react-icons/fa';
import { useWallet } from '../../hooks/useWallet';
import WalletCard from '../../components/wallet/WalletCard';
import AddWalletModal from '../../components/wallet/AddWalletModal';
import ImportWalletModal from '../../components/wallet/ImportWalletModal';
import { formatCurrency } from '../../utils/format';

const Wallets = () => {
  const { wallets, getWallets, loading } = useWallet();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    getWallets();
  }, [getWallets]);
  
  // Filter wallets based on filter and search
  const filteredWallets = wallets.filter(wallet => {
    // Apply filter
    if (filter === 'real' && (wallet.isSimulated || wallet.isTracked)) {
      return false;
    }
    
    if (filter === 'simulated' && !wallet.isSimulated) {
      return false;
    }
    
    if (filter === 'tracked' && !wallet.isTracked) {
      return false;
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        wallet.name.toLowerCase().includes(searchLower) ||
        wallet.address.toLowerCase().includes(searchLower) ||
        wallet.blockchain.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  const totalBalance = wallets
    .filter(wallet => !wallet.isSimulated && !wallet.isTracked)
    .reduce((sum, wallet) => sum + wallet.balance, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wallets</h1>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> New Wallet
          </button>
          
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center justify-center"
          >
            <FaWallet className="mr-2" /> Import Wallet
          </button>
        </div>
      </div>
      
      {/* Summary card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Balance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {formatCurrency(totalBalance)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Wallets</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {wallets.filter(w => !w.isSimulated && !w.isTracked).length}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Tracked Wallets</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {wallets.filter(w => w.isTracked).length}
            </p>
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
            placeholder="Search wallets..."
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
            <option value="all">All Wallets</option>
            <option value="real">Real Wallets</option>
            <option value="simulated">Simulation</option>
            <option value="tracked">Tracked</option>
          </select>
        </div>
      </div>
      
      {/* Wallets grid */}
      {loading && wallets.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : filteredWallets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWallets.map(wallet => (
            <WalletCard key={wallet._id} wallet={wallet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <FaEye className="text-4xl text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No wallets found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || filter !== 'all'
              ? 'Try changing your search or filter settings'
              : 'Add a wallet to get started with your crypto journey'}
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <FaPlus className="inline mr-2" /> New Wallet
            </button>
            
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              <FaWallet className="inline mr-2" /> Import Wallet
            </button>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <AddWalletModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
      
      <ImportWalletModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default Wallets;