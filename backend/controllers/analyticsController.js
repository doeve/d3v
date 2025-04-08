const Wallet = require('../models/wallet');
const Transaction = require('../models/transaction');
const CopyTrade = require('../models/copyTrade');
const { AsyncError } = require('../utils/errorHandler');

// Get wallet performance
exports.getWalletPerformance = AsyncError(async (req, res, next) => {
  const { id } = req.params;
  const { period = 'month' } = req.query;
  
  // Validate wallet ownership
  const wallet = await Wallet.findOne({
    _id: id,
    userId: req.user._id
  });
  
  if (!wallet) {
    return res.status(404).json({
      status: 'error',
      message: 'Wallet not found'
    });
  }
  
  // Calculate date range based on period
  let startDate;
  const now = new Date();
  
  switch (period) {
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
  
  // Get transactions for the period
  const transactions = await Transaction.find({
    walletId: id,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: 1 });
  
  // Calculate daily performance
  const dailyPerformance = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= now) {
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayTransactions = transactions.filter(tx => 
      tx.timestamp >= dayStart && tx.timestamp <= dayEnd
    );
    
    const buyVolume = dayTransactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const sellVolume = dayTransactions
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    dailyPerformance.push({
      date: currentDate.toISOString().split('T')[0],
      buyVolume,
      sellVolume,
      netVolume: buyVolume - sellVolume,
      transactionCount: dayTransactions.length
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate overall performance
  const totalBuyVolume = transactions
    .filter(tx => tx.type === 'buy')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalSellVolume = transactions
    .filter(tx => tx.type === 'sell')
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const performance = {
    walletId: id,
    period,
    overview: {
      transactionCount: transactions.length,
      buyVolume: totalBuyVolume,
      sellVolume: totalSellVolume,
      netVolume: totalBuyVolume - totalSellVolume
    },
    dailyPerformance
  };
  
  res.status(200).json({
    status: 'success',
    data: {
      performance
    }
  });
});

// Get copy trade performance
exports.getCopyTradePerformance = AsyncError(async (req, res, next) => {
  const { id } = req.params;
  
  // Validate copy trade ownership
  const copyTrade = await CopyTrade.findOne({
    _id: id,
    userId: req.user._id
  }).populate('sourceWalletId targetWalletId');
  
  if (!copyTrade) {
    return res.status(404).json({
      status: 'error',
      message: 'Copy trade not found'
    });
  }
  
  // Get source and target transactions
  const [sourceTransactions, targetTransactions] = await Promise.all([
    Transaction.find({ walletId: copyTrade.sourceWalletId._id }).sort({ timestamp: 1 }),
    Transaction.find({ walletId: copyTrade.targetWalletId._id, copyTradeId: id }).sort({ timestamp: 1 })
  ]);
  
  // Calculate source stats
  const sourceStats = {
    totalTrades: sourceTransactions.length,
    volume: sourceTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    successRate: 0,
    roi: 0
  };
  
  // Calculate target stats
  const targetStats = {
    totalTrades: targetTransactions.length,
    volume: targetTransactions.reduce((sum, tx) => sum + tx.amount, 0),
    successRate: 0,
    roi: copyTrade.statistics?.roi || 0
  };
  
  // Calculate performance history
  const performanceHistory = [];
  
  // Get the earliest date between source and target transactions
  let startDate = new Date();
  if (sourceTransactions.length > 0) {
    startDate = new Date(sourceTransactions[0].timestamp);
  }
  if (targetTransactions.length > 0 && new Date(targetTransactions[0].timestamp) < startDate) {
    startDate = new Date(targetTransactions[0].timestamp);
  }
  
  // Get the latest date
  let endDate = new Date();
  
  // Generate daily performance
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const sourceDayTx = sourceTransactions.filter(tx => 
      tx.timestamp >= dayStart && tx.timestamp <= dayEnd
    );
    
    const targetDayTx = targetTransactions.filter(tx => 
      tx.timestamp >= dayStart && tx.timestamp <= dayEnd
    );
    
    const sourceBuyVolume = sourceDayTx
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const sourceSellVolume = sourceDayTx
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const targetBuyVolume = targetDayTx
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const targetSellVolume = targetDayTx
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    performanceHistory.push({
      date: currentDate.toISOString().split('T')[0],
      sourceVolume: sourceBuyVolume - sourceSellVolume,
      targetVolume: targetBuyVolume - targetSellVolume,
      sourceCount: sourceDayTx.length,
      targetCount: targetDayTx.length
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  res.status(200).json({
    status: 'success',
    data: {
      performance: {
        copyTradeId: id,
        sourceStats,
        targetStats,
        performanceHistory
      }
    }
  });
});

// Get portfolio overview
exports.getPortfolioOverview = AsyncError(async (req, res, next) => {
  // Get all wallets for the user (excluding simulated ones)
  const wallets = await Wallet.find({
    userId: req.user._id,
    isSimulated: false
  });
  
  // Calculate total balance
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  
  // Calculate token distribution
  const tokens = [];
  wallets.forEach(wallet => {
    if (wallet.tokens && wallet.tokens.length > 0) {
      wallet.tokens.forEach(token => {
        const tokenValue = token.balance * (token.price || 0);
        if (tokenValue > 0) {
          const existingToken = tokens.find(t => t.symbol === token.symbol);
          if (existingToken) {
            existingToken.value += tokenValue;
            existingToken.balance += token.balance;
          } else {
            tokens.push({
              symbol: token.symbol,
              name: token.name,
              value: tokenValue,
              balance: token.balance,
              price: token.price
            });
          }
        }
      });
    }
  });
  
  // Sort tokens by value (descending)
  tokens.sort((a, b) => b.value - a.value);
  
  // Get copy trades
  const copyTrades = await CopyTrade.find({
    userId: req.user._id,
    isSimulated: false,
    status: 'active'
  });
  
  // Get recent transactions
  const recentTransactions = await Transaction.find({
    userId: req.user._id,
    isSimulated: false
  })
    .sort({ timestamp: -1 })
    .limit(10);
    
  // Calculate portfolio metrics
  const portfolioMetrics = {
    totalBalance,
    walletCount: wallets.length,
    activeCopyTrades: copyTrades.length,
    tokenCount: tokens.length,
    // More metrics can be added here
  };
  
  res.status(200).json({
    status: 'success',
    data: {
      portfolio: {
        metrics: portfolioMetrics,
        tokens,
        recentTransactions
      }
    }
  });
});

// Get token distribution
exports.getTokenDistribution = AsyncError(async (req, res, next) => {
  // Get all wallets for the user
  const wallets = await Wallet.find({
    userId: req.user._id,
    isSimulated: false
  });
  
  // Calculate token distribution
  const tokens = [];
  wallets.forEach(wallet => {
    if (wallet.tokens && wallet.tokens.length > 0) {
      wallet.tokens.forEach(token => {
        const tokenValue = token.balance * (token.price || 0);
        if (tokenValue > 0) {
          const existingToken = tokens.find(t => t.symbol === token.symbol);
          if (existingToken) {
            existingToken.value += tokenValue;
            existingToken.balance += token.balance;
          } else {
            tokens.push({
              symbol: token.symbol,
              name: token.name,
              value: tokenValue,
              balance: token.balance,
              price: token.price,
              address: token.address
            });
          }
        }
      });
    }
  });
  
  // Sort tokens by value (descending)
  tokens.sort((a, b) => b.value - a.value);
  
  res.status(200).json({
    status: 'success',
    data: {
      distribution: tokens
    }
  });
});

// Get trading history
exports.getTradingHistory = AsyncError(async (req, res, next) => {
  const { days = 30 } = req.query;
  
  // Calculate start date
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(days));
  
  // Get all transactions for the period
  const transactions = await Transaction.find({
    userId: req.user._id,
    isSimulated: false,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: 1 });
  
  // Calculate daily volumes
  const history = [];
  let currentDate = new Date(startDate);
  const endDate = new Date();
  
  while (currentDate <= endDate) {
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);
    
    const dayTransactions = transactions.filter(tx => 
      tx.timestamp >= dayStart && tx.timestamp <= dayEnd
    );
    
    const buyVolume = dayTransactions
      .filter(tx => tx.type === 'buy')
      .reduce((sum, tx) => sum + tx.amount, 0);
      
    const sellVolume = dayTransactions
      .filter(tx => tx.type === 'sell')
      .reduce((sum, tx) => sum + tx.amount, 0);
    
    history.push({
      date: currentDate.toISOString().split('T')[0],
      buyVolume,
      sellVolume,
      netVolume: buyVolume - sellVolume,
      transactionCount: dayTransactions.length
    });
    
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Calculate overall statistics
  const totalBuyVolume = transactions
    .filter(tx => tx.type === 'buy')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalSellVolume = transactions
    .filter(tx => tx.type === 'sell')
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalVolume = totalBuyVolume + totalSellVolume;
  const netVolume = totalBuyVolume - totalSellVolume;
  
  res.status(200).json({
    status: 'success',
    data: {
      history: {
        period: days,
        volume: totalVolume,
        buyVolume: totalBuyVolume,
        sellVolume: totalSellVolume,
        netVolume,
        transactionCount: transactions.length,
        history
      }
    }
  });
});

// Get copy trading summary
exports.getCopyTradingSummary = AsyncError(async (req, res, next) => {
  // Get all copy trades for the user
  const copyTrades = await CopyTrade.find({
    userId: req.user._id,
    isSimulated: false
  }).populate('sourceWalletId targetWalletId');
  
  // Calculate summary statistics
  const activeCopyTrades = copyTrades.filter(ct => ct.status === 'active').length;
  const pausedCopyTrades = copyTrades.filter(ct => ct.status === 'paused').length;
  const stoppedCopyTrades = copyTrades.filter(ct => ct.status === 'stopped').length;
  
  // Calculate performance metrics
  let totalTrades = 0;
  let successfulTrades = 0;
  let totalInvested = 0;
  let currentValue = 0;
  
  copyTrades.forEach(ct => {
    totalTrades += ct.statistics?.totalTrades || 0;
    successfulTrades += ct.statistics?.successfulTrades || 0;
    totalInvested += ct.statistics?.totalInvested || 0;
    currentValue += ct.statistics?.currentValue || 0;
  });
  
  const roi = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0;
  const successRate = totalTrades > 0 ? (successfulTrades / totalTrades) * 100 : 0;
  
  // Get recent copy trade transactions
  const transactions = await Transaction.find({
    userId: req.user._id,
    isSimulated: false,
    copyTradeId: { $exists: true, $ne: null }
  })
    .sort({ timestamp: -1 })
    .limit(10)
    .populate('copyTradeId');
  
  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        total: copyTrades.length,
        active: activeCopyTrades,
        paused: pausedCopyTrades,
        stopped: stoppedCopyTrades,
        performance: {
          totalTrades,
          successfulTrades,
          successRate,
          totalInvested,
          currentValue,
          roi
        },
        recentTransactions: transactions
      }
    }
  });
});