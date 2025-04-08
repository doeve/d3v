import React from 'react';
import { Link } from 'react-router-dom';
import { FaExchangeAlt, FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa';
import { shortenAddress } from '../../utils/format';

const CopyTradeCard = ({ copyTrade }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <FaExchangeAlt />
            </div>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              Copy Trade
            </span>
          </div>
          
          <div className={`px-2 py-1 text-xs rounded-full ${
            copyTrade.status === 'active' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
              : copyTrade.status === 'paused'
                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
          }`}>
            {copyTrade.status.charAt(0).toUpperCase() + copyTrade.status.slice(1)}
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">Source:</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {copyTrade.sourceWalletId.name || shortenAddress(copyTrade.sourceWalletId.address)}
            </div>
          </div>
          
          <div className="flex justify-center text-gray-400">
            <FaArrowRight />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">Target:</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {copyTrade.targetWalletId.name || shortenAddress(copyTrade.targetWalletId.address)}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">Ratio Type:</div>
            <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
              {copyTrade.ratioType}
              {copyTrade.ratioType === 'fixed' && ` (${copyTrade.ratioValue}x)`}
            </div>
          </div>
          
          {copyTrade.statistics && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate:</div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {copyTrade.statistics.totalTrades > 0 
                  ? `${(copyTrade.statistics.successfulTrades / copyTrade.statistics.totalTrades * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/copy-trade/${copyTrade._id}`}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
          >
            View Details
            <FaExternalLinkAlt className="ml-1 text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CopyTradeCard;