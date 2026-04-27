
import React from 'react';
import { InventoryItem } from '../lib/types';

interface StockTableProps {
  items: InventoryItem[];
  onRefill?: (id: number, qty: number) => void;
  showActions?: boolean;
}

export const StockTable: React.FC<StockTableProps> = ({ items, onRefill, showActions = false }) => {
  const [refillQtys, setRefillQtys] = React.useState<Record<number, number>>({});

  const getStatusBadge = (item: InventoryItem) => {
    if (item.stock === 0) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-900 text-white">Out</span>;
    if (item.stock <= item.minStock * 0.5) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white">Critical</span>;
    if (item.stock <= item.minStock) return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-white">Low</span>;
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500 text-white">OK</span>;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-3 font-bold">Item Name</th>
            <th className="px-4 py-3 font-bold">Category</th>
            <th className="px-4 py-3 font-bold">Price</th>
            <th className="px-4 py-3 font-bold">Stock</th>
            <th className="px-4 py-3 font-bold">Min</th>
            <th className="px-4 py-3 font-bold">Status</th>
            {showActions && <th className="px-4 py-3 font-bold">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{item.name}</div>
                <div className="text-[10px] text-gray-400">{item.unit}</div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{item.category}</td>
              <td className="px-4 py-3 text-sm font-bold text-gray-700">₹{item.price}</td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{item.stock}</td>
              <td className="px-4 py-3 text-sm text-gray-500">{item.minStock}</td>
              <td className="px-4 py-3">{getStatusBadge(item)}</td>
              {showActions && onRefill && (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      className="w-16 border rounded px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Qty"
                      value={refillQtys[item.id] || ''}
                      onChange={(e) => setRefillQtys(prev => ({ ...prev, [item.id]: parseInt(e.target.value) }))}
                    />
                    <button
                      onClick={() => {
                        const qty = refillQtys[item.id];
                        if (qty > 0) {
                          onRefill(item.id, qty);
                          setRefillQtys(prev => ({ ...prev, [item.id]: 0 }));
                        }
                      }}
                      className="bg-primary text-white text-xs font-bold px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
