import React from 'react';
import { useUI } from '../../hooks/useUI';

const BlockchainSelector = () => {
  const { blockchainApi, setBlockchainApi } = useUI();
  
  const blockchainOptions = [
    { id: 'tatum', name: 'Tatum API (Solana)' },
    { id: 'tatum-eth', name: 'Tatum API (Ethereum)' },
    { id: 'tatum-bsc', name: 'Tatum API (Binance)' },
    { id: 'tatum-poly', name: 'Tatum API (Polygon)' },
    { id: 'web3', name: 'Web3.js (Ethereum)' },
    { id: 'solana-web3', name: 'Solana Web3.js' }
  ];
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Blockchain API
      </label>
      <select
        value={blockchainApi}
        onChange={(e) => setBlockchainApi(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      >
        {blockchainOptions.map(option => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BlockchainSelector;