import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaEdit,
  FaStop,
  FaPlay,
  FaPause,
  FaTrash,
  FaExchangeAlt,
  FaWallet,
  FaHistory,
  FaChartLine,
  FaCog,
  FaSync
} from 'react-icons/fa';
import { useCopyTrade } from '../../hooks/useCopyTrade';
import { useAnalytics } from '../../hooks/useAnalytics';
import CopyTradeSetupModal from '../../components/copyTrade/CopyTradeSetupModal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TransactionList from '../../components/wallet/TransactionList';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import { formatCurrency, formatPercentage, shortenAddress } from '../../utils/format';

const CopyTradeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentCopyTrade, 
    getCopyTrade, 
    getCopyTradeTransactions, 
    transactions, 
    updateCopyTrade, 
    deleteCopyTrade, 
    getCopyTradeStatistics,
    loading 
  } = useCopyTrade();
  const { getCopyTradePerformance, loading: analyticsLoading } = useAnalytics();
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [performance, setPerformance] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const fetchData = async () => {
      await getCopyTrade(id);
      await getCopyTradeTransactions(id);
      
      try {
        const perfData = await getCopyTradePerformance(id);
        setPerformance(perfData);
      } catch (error) {
        console.error('Failed to fetch performance data', error);
      }
    };
    
    fetchData();
  }, [id, getCopyTrade, getCopyTradeTransactions, getCopyTradePerformance]);
  
  const updateCopyTradeStatus = async (status) => {
    try {
      await updateCopyTrade(id, { status });
      await getCopyTrade(id);
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };
  
  const refreshStatistics = async () => {
    try {
      await getCopyTradeStatistics(id);
    } catch (error) {
      console.error('Failed to refresh statistics', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteCopyTrade(id);
      navigate('/copy-trade');
    } catch (error) {
      console.error('Failed to delete copy trade', error);
    }
  };
  
  if (loading && !currentCopyTrade) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  
  if (!currentCopyTrade) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 dark:text-gray-300">Copy trade not found</p>
        <Link 
          to="/copy-trade" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Copy Trades
        </Link>
      </div>
    );
  }
  
  const sourceWallet = currentCopyTrade.sourceWalletId;
  const targetWallet = currentCopyTrade.targetWalletId;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Link 
            to="/copy-trade"
            className="mr-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <span>Copy Trade Details</span>
            <span className={`ml-3 px-3 py-1 text-xs rounded-full ${
              currentCopyTrade.status === 'active' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                : currentCopyTrade.status === 'paused'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {currentCopyTrade.status.charAt(0).toUpperCase() + currentCopyTrade.status.slice(1)}
            </span>
            {currentCopyTrade.isSimulated && (
              <span className="ml-2 px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                Simulation
              </span>
            )}
          </h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {currentCopyTrade.status === 'active' ? (
            <button
              onClick={() => updateCopyTradeStatus('paused')}
              className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
            >
              <FaPause className="mr-1" /> Pause
            </button>
          ) : currentCopyTrade.status === 'paused' ? (
            <button
              onClick={() => updateCopyTradeStatus('active')}
              className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              <FaPlay className="mr-1" /> Resume
            </button>
          ) : null}
          
          {currentCopyTrade.status !== 'stopped' && (
            <button
              onClick={() => updateCopyTradeStatus('stopped')}
              className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <FaStop className="mr-1" /> Stop
            </button>
          )}
          
          <button
            onClick={() => setShowEditModal(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaEdit className="mr-1" /> Edit
          </button>
          
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaExchangeAlt className="inline mr-2" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaHistory className="inline mr-2" /> Transactions
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaChartLine className="inline mr-2" /> Performance
          </button>
        </nav>
      </div>
      
      {/* Active tab content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Wallets section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <FaWallet className="text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Source Wallet</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {sourceWallet?.name || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {shortenAddress(sourceWallet?.address || '', 8)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Blockchain</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {sourceWallet?.blockchain || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <Link 
                    to={`/wallets/${sourceWallet?._id}`} 
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    View Wallet
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <FaWallet className="text-green-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Target Wallet</h2>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {targetWallet?.name || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {shortenAddress(targetWallet?.address || '', 8)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Blockchain</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {targetWallet?.blockchain || 'Unknown'}
                  </p>
                </div>
                
                <div>
                  <Link 
                    to={`/wallets/${targetWallet?._id}`} 
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                  >
                    View Wallet
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Settings and statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaCog className="text-purple-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Copy Settings</h2>
                </div>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                >
                  Edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Ratio Type</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {currentCopyTrade.ratioType}
                  </p>
                </div>
                
                {currentCopyTrade.ratioType === 'fixed' && (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ratio Value</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {currentCopyTrade.ratioValue}×
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Min/Max Amount</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentCopyTrade.minAmount > 0 ? formatCurrency(currentCopyTrade.minAmount) : 'No min'} / 
                    {currentCopyTrade.maxAmount > 0 ? formatCurrency(currentCopyTrade.maxAmount) : 'No max'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tracked Tokens</p>
                  <div className="mt-1">
                    {currentCopyTrade.tokens && currentCopyTrade.tokens.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {currentCopyTrade.tokens.map(token => (
                          <span
                            key={token}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                          >
                            {token}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600 dark:text-gray-300">All tokens</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <FaChartLine className="text-indigo-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Statistics</h2>
                </div>
                <button
                  onClick={refreshStatistics}
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
                >
                  <FaSync className="mr-1" /> Refresh
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Trades</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentCopyTrade.statistics?.totalTrades || 0}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPercentage(currentCopyTrade.statistics?.successfulTrades / 
                      (currentCopyTrade.statistics?.totalTrades || 1) * 100)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Invested</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(currentCopyTrade.statistics?.totalInvested || 0)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatCurrency(currentCopyTrade.statistics?.currentValue || 0)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                  <p className={`font-medium ${
                    (currentCopyTrade.statistics?.roi || 0) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatPercentage(currentCopyTrade.statistics?.roi || 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'transactions' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Copy Trade Transactions
          </h2>
          
          <TransactionList 
            transactions={transactions} 
            loading={loading} 
            id={id}
            fetchTransactions={(page, limit) => getCopyTradeTransactions(id, page, limit)}
          />
        </div>
      )}
      
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Performance Comparison
            </h2>
            
            {analyticsLoading && !performance ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
              </div>
            ) : performance ? (
              <div className="h-64">
                <PerformanceChart data={performance.performanceHistory || []} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No performance data available
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Source Wallet Performance
              </h3>
              
              {performance ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trades</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {performance.sourceStats?.totalTrades || 0}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(performance.sourceStats?.volume || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                    <p className={`font-medium ${
                      (performance.sourceStats?.roi || 0) >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatPercentage(performance.sourceStats?.roi || 0)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No data available
                </div>
              )}
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">
                Target Wallet Performance
              </h3>
              
              {performance ? (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trades</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {performance.targetStats?.totalTrades || 0}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Volume</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(performance.targetStats?.volume || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                    <p className={`font-medium ${
                      (performance.targetStats?.roi || 0) >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatPercentage(performance.targetStats?.roi || 0)}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Performance vs. Source</p>
                    <p className={`font-medium ${
                      (performance.targetStats?.roi || 0) >= (performance.sourceStats?.roi || 0)
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {formatPercentage((performance.targetStats?.roi || 0) - (performance.sourceStats?.roi || 0))}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Modals */}
      <CopyTradeSetupModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        editMode={true}
        initialData={currentCopyTrade}
      />
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Copy Trade"
        message="Are you sure you want to delete this copy trade? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default CopyTradeDetail;