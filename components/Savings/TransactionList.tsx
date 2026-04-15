
import React from 'react';
import { Transaction, TransactionType } from '../../types';
import { formatDate, formatCurrency } from '../../utils/helpers';

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center py-4">No transactions yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((tx) => (
            <tr key={tx.id} className={tx.transactionType === TransactionType.DEPOSIT ? 'bg-green-50' : 'bg-red-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(tx.transactionDate, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  tx.transactionType === TransactionType.DEPOSIT 
                    ? 'bg-success/20 text-success' 
                    : 'bg-error/20 text-error'
                }`}>
                  {tx.transactionType}
                </span>
              </td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                tx.transactionType === TransactionType.DEPOSIT ? 'text-success' : 'text-error'
              }`}>
                {tx.transactionType === TransactionType.DEPOSIT ? '+' : '-'}
                {formatCurrency(tx.amount)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tx.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
