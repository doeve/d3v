import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt, FaCopy, FaEllipsisV } from 'react-icons/fa';
import { formatCurrency, shortenAddress } from '../../utils/format';

const WalletCard = ({ wallet }) => {
  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    // Could add toast notification here
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {wallet.name}
            </h3>
            <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400 text-sm">
              <span>{shortenAddress(wallet.address)}</span>
              <button 
                onClick={copyAddress} 
                className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <FaCopy />
              </button>
            </div>
          </div>
          
          <div className="relative group">
            <button className="p-1 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700">
              <FaEllipsisV />
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
              <Link
                to={`/wallets/${wallet._id}`}
                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View Details
              </Link>
              <a
                href={`https://explorer.solana.com/address/${wallet.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                View on Explorer <FaExternalLinkAlt className="ml-1 text-xs" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-600 dark:text-gray-400 text-sm">Balance</span>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">
              {formatCurrency(wallet.balance)}
            </span>
          </div>
          
          {wallet.tokens && wallet.tokens.length > 0 && (
            <div className="mt-2">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Tokens</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {wallet.tokens.slice(0, 3).map((token) => (
                  <span
                    key={token.symbol || token.address}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded"
                  >
                    {token.symbol || shortenAddress(token.address)}: {token.balance?.toFixed(4)}
                  </span>
                ))}
                {wallet.tokens.length > 3 && (
                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded">
                    +{wallet.tokens.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/wallets/${wallet._id}`}
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

export default WalletCard;