import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaPlay, FaPause, FaStop, FaTrash, FaFlask, 
  FaWallet, FaExchangeAlt, FaHistory, FaChartLine, FaPlus,
  FaForward, FaSyncAlt, FaRedo, FaCalendarAlt
} from 'react-icons/fa';
import { useSimulation } from '../../hooks/useSimulation';
import { useWallet } from '../../hooks/useWallet';
import { useCopyTrade } from '../../hooks/useCopyTrade';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AddTrackedWalletModal from '../../components/simulation/AddTrackedWalletModal';
import SetupCopyTradeModal from '../../components/simulation/SetupCopyTradeModal';
import FastForwardModal from '../../components/simulation/FastForwardModal';
import WalletCard from '../../components/wallet/WalletCard';
import CopyTradeCard from '../../components/copyTrade/CopyTradeCard';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/format';

const SimulationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentSimulation, 
    getSimulation, 
    updateSimulation, 
    deleteSimulation,
    resetSimulation,
    getPerformance,
    getSimulationWallets,
    getSimulationCopyTrades,
    loading 
  } = useSimulation();
  const { wallets, getWallets } = useWallet();
  const { copyTrades, getCopyTrades } = useCopyTrade();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showAddWalletModal, setShowAddWalletModal] = useState(false);
  const [showCopyTradeModal, setShowCopyTradeModal] = useState(false);
  const [showFastForwardModal, setShowFastForwardModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [performance, setPerformance] = useState(null);
  const [simulationWallets, setSimulationWallets] = useState([]);
  const [simulationCopyTrades, setSimulationCopyTrades] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      await getSimulation(id);
      await getWallets();
      await getCopyTrades();
      
      try {
        const perfData = await getPerformance(id);
        setPerformance(perfData);
      } catch (error) {
        console.error('Failed to fetch performance data', error);
      }
    };
    
    fetchData();
  }, [id, getSimulation, getWallets, getCopyTrades, getPerformance]);
  
  // Get simulation wallets and copy trades when simulation changes
  useEffect(() => {
    if (currentSimulation) {
      const fetchWalletsAndTrades = async () => {
        try {
          // Filter wallets and copy trades belonging to this simulation
          const simWallets = wallets.filter(wallet => 
            currentSimulation.wallets.includes(wallet._id)
          );
          setSimulationWallets(simWallets);
          
          const simCopyTrades = copyTrades.filter(copyTrade => 
            currentSimulation.copyTrades.includes(copyTrade._id)
          );
          setSimulationCopyTrades(simCopyTrades);
        } catch (error) {
          console.error('Failed to fetch simulation details', error);
        }
      };
      
      fetchWalletsAndTrades();
    }
  }, [currentSimulation, wallets, copyTrades]);
  
  const updateSimulationStatus = async (status) => {
    try {
      await updateSimulation(id, { status });
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };
  
  const handleDelete = async () => {
    try {
      await deleteSimulation(id);
      navigate('/simulation');
    } catch (error) {
      console.error('Failed to delete simulation', error);
    }
  };
  
  const handleReset = async () => {
    try {
      await resetSimulation(id);
    } catch (error) {
      console.error('Failed to reset simulation', error);
    }
  };
  
  const refreshSimulation = async () => {
    try {
      await getSimulation(id);
      const perfData = await getPerformance(id);
      setPerformance(perfData);
    } catch (error) {
      console.error('Failed to refresh simulation', error);
    }
  };
  
  if (loading && !currentSimulation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  
  if (!currentSimulation) {
    return (
      <div className="text-center py-10">
        <p className="text-lg text-gray-600 dark:text-gray-300">Simulation not found</p>
        <Link 
          to="/simulation" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Simulations
        </Link>
      </div>
    );
  }
  
  const mainWallet = simulationWallets.find(w => !w.isTracked);
  const trackedWallets = simulationWallets.filter(w => w.isTracked);
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center">
          <Link 
            to="/simulation"
            className="mr-3 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            <FaArrowLeft />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <span>Simulation: {currentSimulation.name}</span>
            <span className={`ml-3 px-3 py-1 text-xs rounded-full ${
              currentSimulation.status === 'active' 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                : currentSimulation.status === 'paused'
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
            }`}>
              {currentSimulation.status.charAt(0).toUpperCase() + currentSimulation.status.slice(1)}
            </span>
          </h1>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          {currentSimulation.status === 'active' ? (
            <button
              onClick={() => updateSimulationStatus('paused')}
              className="px-3 py-1.5 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 flex items-center"
            >
              <FaPause className="mr-1" /> Pause
            </button>
          ) : currentSimulation.status === 'paused' ? (
            <button
              onClick={() => updateSimulationStatus('active')}
              className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
            >
              <FaPlay className="mr-1" /> Resume
            </button>
          ) : null}
          
          {currentSimulation.status !== 'completed' && (
            <button
              onClick={() => updateSimulationStatus('completed')}
              className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
            >
              <FaStop className="mr-1" /> Complete
            </button>
          )}
          
          <button
            onClick={() => setShowFastForwardModal(true)}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <FaForward className="mr-1" /> Fast Forward
          </button>
          
          <button
            onClick={() => setShowResetDialog(true)}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
          >
            <FaRedo className="mr-1" /> Reset
          </button>
          
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <FaFlask className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Balance</h2>
          </div>
          
          <div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(currentSimulation.currentBalance)}
            </p>
            <div className="flex items-center mt-1">
              <span className={`text-sm ${
                (currentSimulation.currentBalance - currentSimulation.initialBalance) >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(currentSimulation.currentBalance - currentSimulation.initialBalance)}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                from initial {formatCurrency(currentSimulation.initialBalance)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <FaChartLine className="text-green-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h2>
          </div>
          
          <div>
            <p className={`text-2xl font-bold ${
              (currentSimulation.performance?.roi || 0) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercentage(currentSimulation.performance?.roi || 0)}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {currentSimulation.performance?.transactions || 0} transactions
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                {formatPercentage(currentSimulation.performance?.successRate || 0)} success rate
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-purple-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Timeline</h2>
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {formatDate(currentSimulation.startDate, 'long')}
            </p>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.floor((Date.now() - new Date(currentSimulation.startDate).getTime()) / (1000 * 60 * 60 * 24))} days running
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaFlask className="inline mr-2" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('wallets')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'wallets'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaWallet className="inline mr-2" /> Wallets
          </button>
          <button
            onClick={() => setActiveTab('copyTrades')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'copyTrades'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaExchangeAlt className="inline mr-2" /> Copy Trades
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            <FaChartLine className="inline mr-2" /> Performance
          </button>
        </nav>
      </div>
      
      {/* Tab content */}
      <div className="pb-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Simulation Overview
                </h2>
                <button
                  onClick={refreshSimulation}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <FaSyncAlt className="mr-1" /> Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Settings
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Blockchain:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {currentSimulation.blockchain}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Simulation Speed:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.settings?.speed}×
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Market Volatility:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.settings?.marketVolatility}×
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transaction Fees:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.settings?.fees}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Assets
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Wallets:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {simulationWallets.length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Tracked Wallets:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {trackedWallets.length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Copy Trades:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {simulationCopyTrades.length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Copy Trades:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {simulationCopyTrades.filter(ct => ct.status === 'active').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between mb-3">
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
                    Performance Chart
                  </h3>
                </div>
                
                <div className="h-64">
                  {performance ? (
                    <PerformanceChart data={performance.dailyPerformance || []} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No performance data available yet
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Wallets
                  </h2>
                  <Link to="/wallets" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    View All
                  </Link>
                </div>
                
                {simulationWallets.length > 0 ? (
                  <div className="space-y-4">
                    {simulationWallets.slice(0, 2).map(wallet => (
                      <WalletCard key={wallet._id} wallet={wallet} />
                    ))}
                    {simulationWallets.length > 2 && (
                      <div className="text-center">
                        <button
                          onClick={() => setActiveTab('wallets')}
                          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                          View {simulationWallets.length - 2} more wallet(s)
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No wallets added to this simulation
                    </p>
                    <button
                      onClick={() => setShowAddWalletModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <FaPlus className="mr-2" /> Add Wallet
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Copy Trades
                  </h2>
                  <Link to="/copy-trade" className="text-blue-600 dark:text-blue-400 text-sm hover:underline">
                    View All
                  </Link>
                </div>
                
                {simulationCopyTrades.length > 0 ? (
                  <div className="space-y-4">
                    {simulationCopyTrades.slice(0, 2).map(copyTrade => (
                      <CopyTradeCard key={copyTrade._id} copyTrade={copyTrade} />
                    ))}
                    {simulationCopyTrades.length > 2 && (
                      <div className="text-center">
                        <button
                          onClick={() => setActiveTab('copyTrades')}
                          className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
                        >
                          View {simulationCopyTrades.length - 2} more copy trade(s)
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      No copy trades set up in this simulation
                    </p>
                    <button
                      onClick={() => setShowCopyTradeModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <FaPlus className="mr-2" /> Set Up Copy Trade
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'wallets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Simulation Wallets
              </h2>
              <button
                onClick={() => setShowAddWalletModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" /> Add Tracked Wallet
              </button>
            </div>
            
            {/* Main wallet */}
            {mainWallet && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <FaWallet className="mr-2 text-green-500" /> Main Simulation Wallet
                </h3>
                <WalletCard wallet={mainWallet} />
              </div>
            )}
            
            {/* Tracked wallets */}
            {trackedWallets.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                  <FaWallet className="mr-2 text-blue-500" /> Tracked Wallets
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {trackedWallets.map(wallet => (
                    <WalletCard key={wallet._id} wallet={wallet} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No tracked wallets added to this simulation
                </p>
                <button
                  onClick={() => setShowAddWalletModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" /> Add Tracked Wallet
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'copyTrades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Simulation Copy Trades
              </h2>
              <button
                onClick={() => setShowCopyTradeModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
              >
                <FaPlus className="mr-2" /> Set Up Copy Trade
              </button>
            </div>
            
            {simulationCopyTrades.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simulationCopyTrades.map(copyTrade => (
                  <CopyTradeCard key={copyTrade._id} copyTrade={copyTrade} />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  No copy trades set up in this simulation
                </p>
                <button
                  onClick={() => setShowCopyTradeModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" /> Set Up Copy Trade
                </button>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Performance Overview
                </h2>
                <button
                  onClick={refreshSimulation}
                  className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <FaSyncAlt className="mr-1" /> Refresh
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Initial Balance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(currentSimulation.initialBalance)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(currentSimulation.currentBalance)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Profit/Loss</p>
                  <p className={`text-xl font-bold ${
                    (currentSimulation.currentBalance - currentSimulation.initialBalance) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(currentSimulation.currentBalance - currentSimulation.initialBalance)}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
                  <p className={`text-xl font-bold ${
                    (currentSimulation.performance?.roi || 0) >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatPercentage(currentSimulation.performance?.roi || 0)}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Balance History
                </h3>
                <div className="h-64">
                  {performance ? (
                    <PerformanceChart data={performance.dailyPerformance || []} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
                      No performance data available yet
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Transaction Statistics
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Transactions:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.performance?.transactions || 0}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Success Rate:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatPercentage(currentSimulation.performance?.successRate || 0)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Copy Trades:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {simulationCopyTrades.length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Copy Trades:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {simulationCopyTrades.filter(ct => ct.status === 'active').length}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                    Simulation Settings Impact
                  </h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Speed Multiplier:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.settings?.speed}×
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Market Volatility:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.settings?.marketVolatility}×
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transaction Fees:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {currentSimulation.settings?.fees}%
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Total Fees Paid:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(
                          (currentSimulation.performance?.transactions || 0) * 
                          (currentSimulation.initialBalance / 100) * 
                          (currentSimulation.settings?.fees || 0.1)
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-3">
                  Trading Suggestions
                </h3>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    Based on simulation performance, here are some suggestions:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-sm text-blue-700 dark:text-blue-400">
                    {(currentSimulation.performance?.roi || 0) < 0 ? (
                      <>
                        <li>Consider adjusting your copy trading strategy as current ROI is negative</li>
                        <li>Try different source wallets or ratio types</li>
                        <li>Review your tracked wallets for better performance</li>
                      </>
                    ) : (
                      <>
                        <li>Your current strategy is showing positive results</li>
                        <li>Consider increasing investment if the trend continues</li>
                        <li>Monitor high-performing copy trades for potential real-world application</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Simulation"
        message="Are you sure you want to delete this simulation? This action cannot be undone and all simulation data will be lost."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
      
      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleReset}
        title="Reset Simulation"
        message="Are you sure you want to reset this simulation? This will reset all balances and delete all transactions, but keep your wallets and copy trade setups."
        confirmText="Reset"
        cancelText="Cancel"
        confirmButtonClass="bg-yellow-600 hover:bg-yellow-700"
      />
      
      <AddTrackedWalletModal
        isOpen={showAddWalletModal}
        onClose={() => setShowAddWalletModal(false)}
        simulationId={id}
      />
      
      <SetupCopyTradeModal
        isOpen={showCopyTradeModal}
        onClose={() => setShowCopyTradeModal(false)}
        simulationId={id}
        wallets={simulationWallets}
      />
      
      <FastForwardModal
        isOpen={showFastForwardModal}
        onClose={() => setShowFastForwardModal(false)}
        simulationId={id}
        onComplete={refreshSimulation}
      />
    </div>
  );
};

export default SimulationDetail;