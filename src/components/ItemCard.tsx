
import React from 'react';
import { InventoryItem } from '../lib/types';

interface ItemCardProps {
  item: InventoryItem;
  onClick: (item: InventoryItem) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const getStatus = () => {
    if (item.stock === 0) return { label: 'Out', color: 'bg-red-900 text-white' };
    if (item.stock <= item.minStock * 0.5) return { label: 'Critical', color: 'bg-red-500 text-white' };
    if (item.stock <= item.minStock) return { label: 'Low', color: 'bg-amber-500 text-white' };
    return { label: 'OK', color: 'bg-green-500 text-white' };
  };

  const status = getStatus();
  const isOutOfStock = item.stock === 0;

  return (
    <button
      onClick={() => !isOutOfStock && onClick(item)}
      disabled={isOutOfStock}
      className={`bg-white border rounded-xl p-4 text-left transition-all hover:shadow-md active:scale-95 flex flex-col justify-between h-32 ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-gray-800 line-clamp-2">{item.name}</h3>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${status.color}`}>
            {status.label}
          </span>
        </div>
        <p className="text-xs text-gray-500 capitalize">{item.category} • {item.unit}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <span className="text-lg font-bold text-primary">₹{item.price}</span>
        <span className="text-xs font-medium text-gray-600">Stock: {item.stock}</span>
      </div>
    </button>
  );
};
