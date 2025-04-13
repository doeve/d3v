import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaSync,
  FaEdit,
  FaTrash,
  FaWallet,
  FaHistory,
  FaChartLine,
  FaExchangeAlt,
  FaQrcode,
  FaExternalLinkAlt,
  FaFlask
} from 'react-icons/fa';
import { useWallet } from '../../hooks/useWallet';
import { useAnalytics } from '../../hooks/useAnalytics';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Tabs from '../../components/common/Tabs';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import TransactionList from '../../components/wallet/TransactionList';
import { formatCurrency, shortenAddress, formatPercentage, formatDate } from '../../utils/format';

const WalletDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentWallet, getWallet, getWalletBalance, getWalletTransactions, transactions, deleteWallet, loading } = useWallet();
  const { getWalletPerformance, loading: analyticsLoading } = useAnalytics();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [performanceData, setPerformanceData] = useState(null);
  const [performancePeriod, setPerformancePeriod] = useState('month');
  
  useEffect(() => {
    if (id) {
      loadWalletData();
    }
  }, [id]);
  
  useEffect(() => {
    if (id && currentWallet) {
      loadPerformanceData(performancePeriod);
    }
  }, [id, currentWallet, performancePeriod]);
  
  const loadWalletData = async () => {
    await getWallet(id);
    await getWalletTransactions(id);
  };
  
  const loadPerformanceData = async (period) => {
    try {
      const response = await getWalletPerformance(id, period);
      setPerformanceData(response);
    } catch (error) {
      console.error('Error loading performance data:', error);
    }
  };
  
  const handleRefreshBalance = async () => {
    await getWalletBalance(id);
  };
  
  const handleDeleteWallet = async () => {
    try {
      await deleteWallet(id);
      navigate('/wallets');
    } catch (error) {
      console.error('Error deleting wallet:', error);
    }
  };
  
  if (loading && !currentWallet) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  
  if (!currentWallet) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Wallet not found</p>
        <Link to="/wallets" className="text-blue-600 dark:text-blue-400 hover:underline">
          Back to Wallets
        </Link>
      </div>
    );
  }
  
  // Set up tabs
  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FaWallet />,
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              title="Wallet Details"
              icon={<FaWallet className="text-blue-500" />}
              actions={
                <Button 
                  size="sm"
                  leftIcon={<FaSync />}
                  onClick={handleRefreshBalance}
                  isLoading={loading}
                >
                  Refresh
                </Button>
              }
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white">{currentWallet.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                  <div className="flex items-center">
                    <p className="font-medium text-gray-900 dark:text-white break-all">{currentWallet.address}</p>
                    <button
                      onClick={() => navigator.clipboard.writeText(currentWallet.address)}
                      className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                      title="Copy to clipboard"
                    >
                      <FaQrcode />
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Blockchain</p>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">{currentWallet.blockchain}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentWallet.isSimulated 
                      ? 'Simulation Wallet' 
                      : currentWallet.isTracked 
                        ? 'Tracked Wallet' 
                        : 'Standard Wallet'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Created</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(currentWallet.createdAt, 'long')}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Last Synced</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {currentWallet.lastSynced ? formatDate(currentWallet.lastSynced, 'datetime') : 'Never'}
                  </p>
                </div>
              </div>
            </Card>
            
            <Card
              title="Balance"
              icon={<FaChartLine className="text-green-500" />}
            >
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Balance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(currentWallet.balance)}
                  </p>
                </div>
                
                {currentWallet.tokens && currentWallet.tokens.length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tokens</p>
                    <div className="space-y-3">
                      {currentWallet.tokens.map((token, index) => (
                        <div key={token.symbol || index} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{token.symbol || shortenAddress(token.address)}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{token.name || 'Unknown Token'}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900 dark:text-white">{formatCurrency(token.balance * (token.price || 0))}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{token.balance.toFixed(4)} @ {formatCurrency(token.price || 0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No tokens found in this wallet</p>
                )}
                
                <div className="pt-2 flex justify-end">
                  <a 
                    href={`https://explorer.${currentWallet.blockchain}.com/address/${currentWallet.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
                  >
                    View on Blockchain Explorer <FaExternalLinkAlt className="ml-1" />
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: 'transactions',
      label: 'Transactions',
      icon: <FaHistory />,
      content: (
        <Card title="Transaction History">
          <TransactionList 
            transactions={transactions} 
            loading={loading} 
            id={id} 
            fetchTransactions={getWalletTransactions}
          />
        </Card>
      )
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <FaChartLine />,
      content: (
        <div className="space-y-6">
          <Card
            title="Performance Analysis"
            actions={
              <div className="flex">
                <select
                  className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-sm"
                  value={performancePeriod}
                  onChange={(e) => setPerformancePeriod(e.target.value)}
                >
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="year">Last Year</option>
                </select>
              </div>
            }
          >
            {analyticsLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-blue-500 border-solid"></div>
              </div>
            ) : performanceData ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Transaction Count</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{performanceData.overview.transactionCount}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Buy Volume</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(performanceData.overview.buyVolume)}</p>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sell Volume</p>
                    <p className="text-xl font-bold text-red-600 dark:text-red-400">{formatCurrency(performanceData.overview.sellVolume)}</p>
                  </div>
                </div>
                
                <div className="h-64">
                  {/* Chart would go here - using placeholder */}
                  <div className="h-full bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">Performance Chart (implementation requires chart.js)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                No performance data available
              </div>
            )}
          </Card>
        </div>
      )
    },
    {
      id: 'copyTrade',
      label: 'Copy Trade',
      icon: <FaExchangeAlt />,
      content: (
        <Card title="Copy Trade Settings">
          {currentWallet.isTracked ? (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                This is a tracked wallet that you can copy trade from. Set up copy trading to automatically replicate transactions from this wallet to one of your own wallets.
              </p>
              
              <div className="mt-4">
                <Button
                  variant="primary"
                  leftIcon={<FaExchangeAlt />}
                  onClick={() => navigate('/copy-trade', { state: { sourceWalletId: id } })}
                >
                  Set Up Copy Trading
                </Button>
              </div>
            </div>
          ) : currentWallet.isSimulated ? (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                This is a simulation wallet. You can use it in simulation mode to test copy trading strategies.
              </p>
              
              <div className="mt-4">
                <Button
                  variant="info"
                  leftIcon={<FaFlask />}
                  onClick={() => navigate('/simulation')}
                >
                  Go to Simulations
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                You can use this wallet as a target for copy trading. Set up copy trading to automatically replicate transactions from tracked wallets to this wallet.
              </p>
              
              <div className="mt-4">
                <Button
                  variant="primary"
                  leftIcon={<FaExchangeAlt />}
                  onClick={() => navigate('/copy-trade', { state: { targetWalletId: id } })}
                >
                  Set Up Copy Trading
                </Button>
              </div>
            </div>
          )}
        </Card>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <Link 
            to="/wallets"
            className="mr-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {currentWallet.name}
          </h1>
        </div>
        
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2">
          <Button
            variant="secondary"
            leftIcon={<FaSync />}
            onClick={handleRefreshBalance}
            isLoading={loading}
          >
            Refresh Balance
          </Button>
          
          <Button
            variant="primary"
            leftIcon={<FaEdit />}
            onClick={() => {/* Open edit modal */}}
          >
            Edit
          </Button>
          
          <Button
            variant="danger"
            leftIcon={<FaTrash />}
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      
      <Tabs tabs={tabs} />
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteWallet}
        title="Delete Wallet"
        message="Are you sure you want to delete this wallet? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default WalletDetail;