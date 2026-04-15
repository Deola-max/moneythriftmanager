
import { useContext } from 'react';
import { SavingsContext } from '../contexts/SavingsContext';

export const useSavings = () => {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error('useSavings must be used within a SavingsProvider');
  }
  return context;
};
