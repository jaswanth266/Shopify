
import React from 'react';
import { Transaction } from '../lib/types';
import { format } from 'date-fns';
import { Banknote, CreditCard, Smartphone } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'cash': return <Banknote size={14} className="text-green-600" />;
      case 'card': return <CreditCard size={14} className="text-blue-600" />;
      case 'phonepay': return <Smartphone size={14} className="text-purple-600" />;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 font-bold">ID</th>
            <th className="px-4 py-3 font-bold">Time</th>
            <th className="px-4 py-3 font-bold">Items</th>
            <th className="px-4 py-3 font-bold">Payment</th>
            <th className="px-4 py-3 font-bold text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-10 text-center text-gray-400">No transactions found</td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs font-mono text-gray-400">{t.id}</td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {format(new Date(t.timestamp), 'MMM dd, HH:mm')}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium max-w-xs truncate">
                  {t.items}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5 capitalize text-xs font-medium text-gray-600">
                    {getPaymentIcon(t.paymentMethod)}
                    {t.paymentMethod}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                  ₹{t.total.toLocaleString('en-IN')}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
