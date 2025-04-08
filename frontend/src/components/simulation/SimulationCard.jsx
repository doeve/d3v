import React from 'react';
import { Link } from 'react-router-dom';
import { FaFlask, FaPlay, FaPause, FaStop, FaExternalLinkAlt, FaWallet, FaExchangeAlt } from 'react-icons/fa';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/format';

const SimulationCard = ({ simulation }) => {
  const getStatusIcon = () => {
    switch (simulation.status) {
      case 'active':
        return <FaPlay className="text-green-500" />;
      case 'paused':
        return <FaPause className="text-yellow-500" />;
      case 'completed':
        return <FaStop className="text-red-500" />;
      default:
        return <FaFlask className="text-blue-500" />;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <FaFlask />
            </div>
            <h3 className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
              {simulation.name}
            </h3>
          </div>
          
          <div className="flex items-center">
            {getStatusIcon()}
            <span className="ml-1 text-sm text-gray-600 dark:text-gray-400 capitalize">
              {simulation.status}
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Initial Balance</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(simulation.initialBalance)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
            <p className="font-medium text-gray-900 dark:text-white">
              {formatCurrency(simulation.currentBalance)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Profit/Loss</p>
            <p className={`font-medium ${
              (simulation.currentBalance - simulation.initialBalance) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatCurrency(simulation.currentBalance - simulation.initialBalance)}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">ROI</p>
            <p className={`font-medium ${
              (simulation.performance?.roi || 0) >= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercentage(simulation.performance?.roi || 0)}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center text-xs text-blue-800 dark:text-blue-300">
            <FaWallet className="mr-1" />
            {simulation.wallets?.length || 0} Wallets
          </div>
          
          <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center text-xs text-purple-800 dark:text-purple-300">
            <FaExchangeAlt className="mr-1" />
            {simulation.copyTrades?.length || 0} Copy Trades
          </div>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          <p>Started: {formatDate(simulation.startDate, 'long')}</p>
          {simulation.endDate && (
            <p>Ended: {formatDate(simulation.endDate, 'long')}</p>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/simulation/${simulation._id}`}
            className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center"
          >
            View Simulation
            <FaExternalLinkAlt className="ml-1 text-xs" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimulationCard;