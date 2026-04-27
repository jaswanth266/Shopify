
import React from 'react';
import { LogOut, Store, ShieldCheck, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role: 'Owner' | 'Shopkeeper';
  onLogout: () => void;
  lowStockCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ children, role, onLogout, lowStockCount }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white">
              <Store size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl text-gray-900 tracking-tight leading-none">SHOP<span className="text-primary">SYNC</span></h1>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Management System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full ${role === 'Owner' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
              {role === 'Owner' ? <ShieldCheck size={16} /> : <User size={16} />}
              <span className="text-xs font-bold uppercase">{role}</span>
            </div>
            
            {lowStockCount > 0 && (
              <div className="bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                {lowStockCount}
              </div>
            )}

            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold text-sm transition-colors ml-2"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        {children}
      </main>
      
      <footer className="bg-white border-t py-4 text-center">
        <p className="text-xs text-gray-400 font-medium">© 2024 ShopSync POS • Production Ready</p>
      </footer>
    </div>
  );
};
