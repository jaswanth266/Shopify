
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { storage } from '../lib/storage';
import { InventoryItem, Transaction, Category } from '../lib/types';
import { StockTable } from '../components/StockTable';
import { TransactionTable } from '../components/TransactionTable';
import { ToastNotification } from '../components/ToastNotification';
import { AlertBanner } from '../components/AlertBanner';
import { 
  Package, 
  BarChart3, 
  Settings, 
  Plus, 
  Trash2, 
  TrendingUp, 
  ReceiptText, 
  Box, 
  AlertCircle 
} from 'lucide-react';

export const OwnerDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'refill' | 'revenue' | 'manage'>('refill');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  // Form state for new item
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'bar' as Category,
    price: '',
    stock: '',
    minStock: '',
    unit: 'Bottle'
  });

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setInventory(storage.getInventory());
    setTransactions(storage.getTransactions());
    setRevenue(storage.getRevenue());
  };

  const lowStockItems = useMemo(() => 
    inventory.filter(item => item.stock <= item.minStock && item.stock > item.minStock * 0.5), 
    [inventory]
  );

  const criticalStockItems = useMemo(() => 
    inventory.filter(item => item.stock <= item.minStock * 0.5), 
    [inventory]
  );

  const handleRefill = (id: number, qty: number) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    const newInventory = inventory.map(i => i.id === id ? { ...i, stock: i.stock + qty } : i);
    storage.setInventory(newInventory);
    setInventory(newInventory);
    setToast({ message: `${item.name} restocked by ${qty}`, type: 'success' });
    setIsAlertDismissed(false);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) {
      setToast({ message: 'Name and Price are required', type: 'error' });
      return;
    }

    const item: InventoryItem = {
      id: Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: Number(newItem.price),
      stock: Number(newItem.stock) || 0,
      minStock: Number(newItem.minStock) || 5,
      unit: newItem.unit
    };

    const newInventory = [...inventory, item];
    storage.setInventory(newInventory);
    setInventory(newInventory);
    setNewItem({ name: '', category: 'bar', price: '', stock: '', minStock: '', unit: 'Bottle' });
    setToast({ message: `${item.name} added to inventory`, type: 'success' });
  };

  const handleRemoveItem = (id: number) => {
    const item = inventory.find(i => i.id === id);
    const newInventory = inventory.filter(i => i.id !== id);
    storage.setInventory(newInventory);
    setInventory(newInventory);
    setToast({ message: `${item?.name} removed from inventory`, type: 'success' });
  };

  const revenueStats = useMemo(() => {
    const byMethod = transactions.reduce((acc, t) => {
      acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.total;
      return acc;
    }, {} as Record<string, number>);

    const totalStockValue = inventory.reduce((sum, item) => sum + (item.price * item.stock), 0);
    const totalItems = inventory.reduce((sum, item) => sum + item.stock, 0);

    return {
      byMethod,
      totalStockValue,
      totalItems,
      avgBill: transactions.length > 0 ? revenue / transactions.length : 0
    };
  }, [transactions, inventory, revenue]);

  return (
    <Layout role="Owner" onLogout={onLogout} lowStockCount={lowStockItems.length + criticalStockItems.length}>
      {!isAlertDismissed && (
        <AlertBanner 
          lowStockItems={lowStockItems} 
          criticalStockItems={criticalStockItems} 
          onDismiss={() => setIsAlertDismissed(true)} 
        />
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-4 mb-8 border-b overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('refill')}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'refill' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Package size={18} /> Stock & Refill
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'revenue' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart3 size={18} /> Revenue
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'manage' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Settings size={18} /> Manage Items
          </button>
        </div>

        {activeTab === 'refill' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b font-bold text-gray-800 flex items-center gap-2">
                  <Box size={18} className="text-primary" /> Stock Overview
                </div>
                <StockTable items={inventory} onRefill={handleRefill} showActions />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" /> Stock Alerts
                </h3>
                {lowStockItems.length === 0 && criticalStockItems.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">All items well stocked.</p>
                ) : (
                  <div className="space-y-3">
                    {criticalStockItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-100">
                        <span className="text-sm font-bold text-red-700">{item.name}</span>
                        <span className="text-xs font-black bg-red-600 text-white px-1.5 py-0.5 rounded">{item.stock}</span>
                      </div>
                    ))}
                    {lowStockItems.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-amber-50 rounded border border-amber-100">
                        <span className="text-sm font-bold text-amber-700">{item.name}</span>
                        <span className="text-xs font-black bg-amber-500 text-white px-1.5 py-0.5 rounded">{item.stock}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Total Revenue</span>
                </div>
                <div className="text-2xl font-black text-gray-900">₹{revenue.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ReceiptText size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Bills Raised</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{transactions.length}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Package size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Stock Items</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{revenueStats.totalItems}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><TrendingUp size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Avg Bill</span>
                </div>
                <div className="text-2xl font-black text-gray-900">₹{Math.round(revenueStats.avgBill).toLocaleString('en-IN')}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Revenue by Payment Method</h3>
                <div className="space-y-6">
                  {['cash', 'card', 'phonepay'].map(method => {
                    const value = revenueStats.byMethod[method] || 0;
                    const percentage = revenue > 0 ? (value / revenue) * 100 : 0;
                    const colors = { cash: 'bg-green-500', card: 'bg-blue-500', phonepay: 'bg-purple-500' };
                    return (
                      <div key={method}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-bold capitalize text-gray-600">{method}</span>
                          <span className="font-black text-gray-900">₹{value.toLocaleString('en-IN')} ({Math.round(percentage)}%)</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${colors[method as keyof typeof colors]} transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b font-bold text-gray-800">Full Transaction Log</div>
                <TransactionTable transactions={transactions} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-xl border shadow-sm sticky top-24">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Plus size={18} className="text-primary" /> Add New Item
                </h3>
                <form onSubmit={handleAddItem} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Item Name</label>
                    <input
                      type="text"
                      required
                      className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                      value={newItem.name}
                      onChange={e => setNewItem({...newItem, name: e.target.value})}
                      placeholder="e.g. Corona Extra"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                      <select 
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none bg-white"
                        value={newItem.category}
                        onChange={e => setNewItem({...newItem, category: e.target.value as Category})}
                      >
                        <option value="bar">Bar</option>
                        <option value="beverage">Beverage</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={newItem.unit}
                        onChange={e => setNewItem({...newItem, unit: e.target.value})}
                        placeholder="Bottle/Can"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (₹)</label>
                      <input
                        type="number"
                        required
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={newItem.price}
                        onChange={e => setNewItem({...newItem, price: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock</label>
                      <input
                        type="number"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={newItem.stock}
                        onChange={e => setNewItem({...newItem, stock: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Stock</label>
                      <input
                        type="number"
                        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none"
                        value={newItem.minStock}
                        onChange={e => setNewItem({...newItem, minStock: e.target.value})}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-colors mt-2 shadow-sm"
                  >
                    Add to Inventory
                  </button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b font-bold text-gray-800">Current Inventory</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <th className="px-4 py-3 font-bold">Item</th>
                        <th className="px-4 py-3 font-bold">Category</th>
                        <th className="px-4 py-3 font-bold">Price</th>
                        <th className="px-4 py-3 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {inventory.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-800">{item.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 capitalize">{item.category}</td>
                          <td className="px-4 py-3 text-sm font-bold">₹{item.price}</td>
                          <td className="px-4 py-3 text-right">
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-gray-400 hover:text-red-500 p-2 transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
};
