
import React from 'react';
import { AlertTriangle, AlertCircle, X } from 'lucide-react';
import { InventoryItem } from '../lib/types';

interface AlertBannerProps {
  lowStockItems: InventoryItem[];
  criticalStockItems: InventoryItem[];
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ lowStockItems, criticalStockItems, onDismiss }) => {
  if (lowStockItems.length === 0 && criticalStockItems.length === 0) return null;

  const isCritical = criticalStockItems.length > 0;
  
  return (
    <div className={`${isCritical ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'} border-b px-4 py-3 relative`}>
      <div className="container mx-auto flex items-start gap-3">
        {isCritical ? (
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
        ) : (
          <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
        )}
        <div className="flex-1">
          {criticalStockItems.length > 0 && (
            <p className="text-sm font-medium text-red-800">
              <span className="font-bold">CRITICAL STOCK:</span> {criticalStockItems.map(i => i.name).join(', ')}
            </p>
          )}
          {lowStockItems.length > 0 && (
            <p className={`text-sm font-medium ${isCritical ? 'text-red-700 mt-1' : 'text-amber-800'}`}>
              <span className="font-bold">LOW STOCK:</span> {lowStockItems.map(i => i.name).join(', ')}
            </p>
          )}
        </div>
        <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
