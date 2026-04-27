
import React from 'react';
import { CreditCard, Banknote, Smartphone } from 'lucide-react';
import { PaymentMethod } from '../lib/types';

interface PaymentSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selected, onChange }) => {
  const options: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { id: 'cash', label: 'Cash', icon: <Banknote size={18} /> },
    { id: 'card', label: 'Card', icon: <CreditCard size={18} /> },
    { id: 'phonepay', label: 'PhonePe', icon: <Smartphone size={18} /> },
  ];

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onChange(option.id)}
          className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-lg border-2 transition-all ${
            selected === option.id
              ? 'border-primary bg-blue-50 text-primary'
              : 'border-gray-100 bg-white text-gray-500 hover:border-gray-300'
          }`}
        >
          {option.icon}
          <span className="text-[10px] font-bold uppercase">{option.label}</span>
        </button>
      ))}
    </div>
  );
};
