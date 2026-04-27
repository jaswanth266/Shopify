
import React from 'react';
import { ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem, PaymentMethod } from '../lib/types';
import { PaymentSelector } from './PaymentSelector';

interface CartPanelProps {
  cart: CartItem[];
  onUpdateQty: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: (method: PaymentMethod) => void;
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({
  cart,
  onUpdateQty,
  onRemove,
  onCheckout,
  paymentMethod,
  setPaymentMethod
}) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="bg-white border rounded-xl flex flex-col h-full overflow-hidden shadow-sm">
      <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
        <ShoppingCart size={20} className="text-primary" />
        <h2 className="font-bold text-gray-800">Current Cart</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2 opacity-60">
            <ShoppingCart size={48} />
            <p>Cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="flex flex-col gap-2 border-b pb-3 last:border-0">
              <div className="flex justify-between items-start">
                <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 border rounded-lg p-1">
                  <button 
                    onClick={() => onUpdateQty(item.id, -1)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQty(item.id, 1)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-600"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="font-bold text-gray-700">₹{item.price * item.quantity}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t space-y-4 bg-gray-50">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Payment Method</label>
            <PaymentSelector selected={paymentMethod} onChange={setPaymentMethod} />
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <span className="text-gray-600 font-medium">Grand Total</span>
            <span className="text-2xl font-black text-primary">₹{total.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => onCheckout(paymentMethod)}
            className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Collect ₹{total.toLocaleString('en-IN')}
          </button>
        </div>
      )}
    </div>
  );
};
