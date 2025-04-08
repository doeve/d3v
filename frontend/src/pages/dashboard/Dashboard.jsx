import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaWallet, FaExchangeAlt, FaFlask, FaChartLine, FaPlus } from 'react-icons/fa';
import { useWallet } from '../../hooks/useWallet';
import { useCopyTrade } from '../../hooks/useCopyTrade';
import { useAnalytics } from '../../hooks/useAnalytics';
import MetricCard from '../../components/analytics/MetricCard';
import WalletCard from '../../components/wallet/WalletCard';
import CopyTradeCard from '../../components/copyTrade/CopyTradeCard';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import TokenDistribution from '../../components/analytics/TokenDistribution';
import { formatCurrency } from '../../utils/format';

const Dashboard = () => {
  const { wallets, getWallets, loading: walletsLoading } = useWallet();
  const { copyTrades, getCopyTrades, loading: copyTradesLoading } = useCopyTrade();
  const { getPortfolioOverview, getTradingHistory, getTokenDistribution, loading: analyticsLoading } = useAnalytics();
  
  const [portfolio, setPortfolio] = useState(null);
  const [tradingHistory, setTradingHistory] = useState(null);
  const [tokenDistribution, setTokenDistribution] = useState([]);
  
  useEffect(() => {
    getWallets();
    getCopyTrades();
    
    const fetchAnalytics = async () => {
      try {
        const portfolioData = await getPortfolioOverview();
        const historyData = await getTradingHistory(7); // Last 7 days
        const tokenData = await getTokenDistribution();
        
        setPortfolio(portfolioData);
        setTradingHistory(historyData);
        setTokenDistribution(tokenData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };
    
    fetchAnalytics();
  }, [getWallets, getCopyTrades, getPortfolioOverview, getTradingHistory, getTokenDistribution]);
  
  const loading = walletsLoading || copyTradesLoading || analyticsLoading;
  
  if (loading && !portfolio) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Balance"
          value={formatCurrency(portfolio?.totalBalance || 0)}
          icon={<FaWallet className="text-blue-500" />}
          trend={tradingHistory?.netVolume > 0 ? 'up' : 'down'}
          trendValue={`${Math.abs((tradingHistory?.netVolume || 0) / (portfolio?.totalBalance || 1) * 100).toFixed(2)}%`}
        />
        
        <MetricCard
          title="Wallets"
          value={portfolio?.walletCount || 0}
          icon={<FaWallet className="text-green-500" />}
        />
        
        <MetricCard
          title="Active Copy Trades"
          value={copyTrades?.filter(ct => ct.status === 'active').length || 0}
          icon={<FaExchangeAlt className="text-purple-500" />}
        />
        
        <MetricCard
          title="Trading Volume (7d)"
          value={formatCurrency(tradingHistory?.volume || 0)}
          icon={<FaChartLine className="text-indigo-500" />}
        />
      </div>
      
      {/* Performance chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Performance</h2>
        <div className="h-64">
          {tradingHistory ? (
            <PerformanceChart data={tradingHistory.history} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
              No performance data available
            </div>
          )}
        </div>
      </div>
      
      {/* Main content columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Wallets column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Wallets</h2>
            <Link 
              to="/wallets"
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {wallets.length > 0 ? (
              wallets.filter(w => !w.isSimulated).slice(0, 3).map(wallet => (
                <WalletCard key={wallet._id} wallet={wallet} />
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400 mb-4">No wallets added yet</p>
                <Link
                  to="/wallets"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <FaPlus className="mr-2" /> Add Wallet
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Token distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Distribution</h2>
            <div className="h-64">
              {tokenDistribution.length > 0 ? (
                <TokenDistribution data={tokenDistribution} />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                  No token data available
                </div>
              )}
            </div>
          </div>
          
          {/* Active copy trades */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Copy Trades</h2>
              <Link 
                to="/copy-trade"
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
            
            <div className="space-y-4">
              {copyTrades.length > 0 ? (
                copyTrades.filter(ct => ct.status === 'active' && !ct.isSimulated).slice(0, 2).map(copyTrade => (
                  <CopyTradeCard key={copyTrade._id} copyTrade={copyTrade} />
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No copy trades set up</p>
                  <Link
                    to="/copy-trade"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaPlus className="mr-2" /> Set Up Copy Trading
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          {/* Simulation link */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <h2 className="text-lg font-semibold mb-2">Try Simulation Mode</h2>
            <p className="mb-4 opacity-90">Test your copy trading strategies with dummy money before using real funds.</p>
            <Link
              to="/simulation"
              className="inline-flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100"
            >
              <FaFlask className="mr-2" /> Start Simulation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;