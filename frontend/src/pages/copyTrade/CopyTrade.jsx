import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaFilter, FaSearch, FaExchangeAlt, FaSyncAlt } from 'react-icons/fa';
import { useCopyTrade } from '../../hooks/useCopyTrade';
import CopyTradeCard from '../../components/copyTrade/CopyTradeCard';
import CopyTradeSetupModal from '../../components/copyTrade/CopyTradeSetupModal';
import { formatCurrency, formatPercentage } from '../../utils/format';

const CopyTrade = () => {
  const { copyTrades, getCopyTrades, loading } = useCopyTrade();
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  useEffect(() => {
    getCopyTrades();
  }, [getCopyTrades]);
  
  // Filter copy trades based on filter and search
  const filteredCopyTrades = copyTrades.filter(copyTrade => {
    // Apply filter
    if (filter === 'active' && copyTrade.status !== 'active') {
      return false;
    }
    
    if (filter === 'paused' && copyTrade.status !== 'paused') {
      return false;
    }
    
    if (filter === 'stopped' && copyTrade.status !== 'stopped') {
      return false;
    }
    
    if (filter === 'real' && copyTrade.isSimulated) {
      return false;
    }
    
    if (filter === 'simulated' && !copyTrade.isSimulated) {
      return false;
    }
    
    // Apply search (would need sourceWallet and targetWallet data to be populated)
    if (search && copyTrade.sourceWalletId && copyTrade.targetWalletId) {
      const searchLower = search.toLowerCase();
      return (
        (copyTrade.sourceWalletId.name && copyTrade.sourceWalletId.name.toLowerCase().includes(searchLower)) ||
        (copyTrade.sourceWalletId.address && copyTrade.sourceWalletId.address.toLowerCase().includes(searchLower)) ||
        (copyTrade.targetWalletId.name && copyTrade.targetWalletId.name.toLowerCase().includes(searchLower)) ||
        (copyTrade.targetWalletId.address && copyTrade.targetWalletId.address.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });
  
  // Calculate summary stats
  const activeCopyTrades = copyTrades.filter(ct => ct.status === 'active').length;
  const realCopyTrades = copyTrades.filter(ct => !ct.isSimulated).length;
  const simulatedCopyTrades = copyTrades.filter(ct => ct.isSimulated).length;
  
  // Calculate average ROI for active copy trades
  const activeTradesWithStats = copyTrades.filter(
    ct => ct.status === 'active' && ct.statistics && typeof ct.statistics.roi === 'number'
  );
  
  const avgRoi = activeTradesWithStats.length > 0
    ? activeTradesWithStats.reduce((sum, ct) => sum + ct.statistics.roi, 0) / activeTradesWithStats.length
    : 0;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Copy Trading</h1>
        
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowSetupModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> New Copy Trade
          </button>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Copy Trades</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {copyTrades.length}
              </p>
            </div>
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaExchangeAlt />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active Copy Trades</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {activeCopyTrades}
              </p>
            </div>
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <FaSyncAlt />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real / Simulated</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {realCopyTrades} / {simulatedCopyTrades}
              </p>
            </div>
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FaExchangeAlt />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Average ROI</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                {formatPercentage(avgRoi)}
              </p>
            </div>
            <div className={`p-2 rounded-full ${
              avgRoi > 0 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            }`}>
              <FaExchangeAlt />
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
            placeholder="Search copy trades..."
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
            <option value="all">All Copy Trades</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
            <option value="stopped">Stopped Only</option>
            <option value="real">Real Only</option>
            <option value="simulated">Simulation Only</option>
          </select>
        </div>
      </div>
      
      {/* Copy trades grid */}
      {loading && copyTrades.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : filteredCopyTrades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCopyTrades.map(copyTrade => (
            <CopyTradeCard key={copyTrade._id} copyTrade={copyTrade} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <FaExchangeAlt className="text-4xl text-gray-400 mb-4" />
          <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">No copy trades found</p>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {search || filter !== 'all'
              ? 'Try changing your search or filter settings'
              : 'Set up a copy trade to start automated trading'}
          </p>
          
          <button
            onClick={() => setShowSetupModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            <FaPlus className="inline mr-2" /> New Copy Trade
          </button>
        </div>
      )}
      
      {/* Setup modal */}
      <CopyTradeSetupModal
        isOpen={showSetupModal}
        onClose={() => setShowSetupModal(false)}
      />
    </div>
  );
};

export default CopyTrade;