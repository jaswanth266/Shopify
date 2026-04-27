
import React, { useState, useMemo, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { storage } from '../lib/storage';
import { InventoryItem, CartItem, PaymentMethod, Transaction, Category } from '../lib/types';
import { ItemCard } from '../components/ItemCard';
import { CartPanel } from '../components/CartPanel';
import { StockTable } from '../components/StockTable';
import { TransactionTable } from '../components/TransactionTable';
import { ToastNotification } from '../components/ToastNotification';
import { AlertBanner } from '../components/AlertBanner';
import { Search, Filter, ShoppingBag, List, Clock, TrendingUp, ReceiptText, Users } from 'lucide-react';

export const KeeperDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'billing' | 'stock' | 'transactions'>('billing');
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAlertDismissed, setIsAlertDismissed] = useState(false);

  useEffect(() => {
    setInventory(storage.getInventory());
    setTransactions(storage.getTransactions());
  }, []);

  const lowStockItems = useMemo(() => 
    inventory.filter(item => item.stock <= item.minStock && item.stock > item.minStock * 0.5), 
    [inventory]
  );

  const criticalStockItems = useMemo(() => 
    inventory.filter(item => item.stock <= item.minStock * 0.5), 
    [inventory]
  );

  const filteredItems = useMemo(() => {
    return inventory.filter(item => {
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [inventory, categoryFilter, searchQuery]);

  const addToCart = (item: InventoryItem) => {
    if (item.stock <= 0) return;
    
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        if (existing.quantity >= item.stock) {
          setToast({ message: `Only ${item.stock} in stock`, type: 'error' });
          return prev;
        }
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (id: number, delta: number) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      const inventoryItem = inventory.find(i => i.id === id);
      if (!item || !inventoryItem) return prev;
      
      const newQty = item.quantity + delta;
      if (newQty <= 0) return prev.filter(i => i.id !== id);
      if (newQty > inventoryItem.stock) {
        setToast({ message: `Only ${inventoryItem.stock} in stock`, type: 'error' });
        return prev;
      }
      
      return prev.map(i => i.id === id ? { ...i, quantity: newQty } : i);
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleCheckout = (method: PaymentMethod) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const transaction: Transaction = {
      id: `T${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      items: cart.map(i => `${i.name} x${i.quantity}`).join(', '),
      total,
      paymentMethod: method
    };

    // Update inventory
    const newInventory = inventory.map(item => {
      const cartItem = cart.find(ci => ci.id === item.id);
      if (cartItem) {
        return { ...item, stock: item.stock - cartItem.quantity };
      }
      return item;
    });

    storage.setInventory(newInventory);
    storage.addTransaction(transaction);
    
    setInventory(newInventory);
    setTransactions(storage.getTransactions());
    setCart([]);
    setToast({ message: `Bill collected via ${method}`, type: 'success' });
    setIsAlertDismissed(false); // Reset alert dismissal on new transaction
  };

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayBills = transactions.filter(t => new Date(t.timestamp).toDateString() === today);
    const totalRev = todayBills.reduce((sum, t) => sum + t.total, 0);
    return {
      revenue: totalRev,
      count: todayBills.length,
      avg: todayBills.length > 0 ? totalRev / todayBills.length : 0
    };
  }, [transactions]);

  return (
    <Layout role="Shopkeeper" onLogout={onLogout} lowStockCount={lowStockItems.length + criticalStockItems.length}>
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
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'billing' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <ShoppingBag size={18} /> Billing
          </button>
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'stock' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <List size={18} /> Stock View
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-4 py-3 font-bold transition-all border-b-2 whitespace-nowrap ${activeTab === 'transactions' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
          >
            <Clock size={18} /> Transactions
          </button>
        </div>

        {activeTab === 'billing' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border shadow-sm">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:ring-1 focus:ring-primary outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
                  {(['all', 'bar', 'beverage', 'snack'] as const).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border ${
                        categoryFilter === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map(item => (
                  <ItemCard key={item.id} item={item} onClick={addToCart} />
                ))}
              </div>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24">
                <CartPanel 
                  cart={cart}
                  onUpdateQty={updateCartQty}
                  onRemove={removeFromCart}
                  onCheckout={handleCheckout}
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stock' && (
          <div className="space-y-6">
            {(lowStockItems.length > 0 || criticalStockItems.length > 0) && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                <Filter className="text-amber-600 mt-1" size={20} />
                <div>
                  <h3 className="font-bold text-amber-800">Stock Attention Needed</h3>
                  <p className="text-sm text-amber-700">{lowStockItems.length + criticalStockItems.length} items are running low. Please inform the owner.</p>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <StockTable items={inventory} />
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Today's Revenue</span>
                </div>
                <div className="text-2xl font-black text-gray-900">₹{stats.revenue.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ReceiptText size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Bills Today</span>
                </div>
                <div className="text-2xl font-black text-gray-900">{stats.count}</div>
              </div>
              <div className="bg-white p-6 rounded-xl border shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Users size={20} /></div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Avg. Bill Value</span>
                </div>
                <div className="text-2xl font-black text-gray-900">₹{Math.round(stats.avg).toLocaleString('en-IN')}</div>
              </div>
            </div>
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 border-b font-bold text-gray-800">Recent Transactions</div>
              <TransactionTable transactions={transactions} />
            </div>
          </div>
        )}
      </div>

      {toast && <ToastNotification message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </Layout>
  );
};
