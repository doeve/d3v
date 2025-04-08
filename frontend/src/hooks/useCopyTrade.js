import { useContext } from 'react';
import { CopyTradeContext } from '../context/CopyTradeContext';

export const useCopyTrade = () => {
  const context = useContext(CopyTradeContext);
  
  if (!context) {
    throw new Error('useCopyTrade must be used within a CopyTradeProvider');
  }
  
  return context;
};