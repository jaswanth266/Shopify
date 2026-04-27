
import React, { useState } from 'react';
import { Store, Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';
import { storage } from '../lib/storage';
import { Role } from '../lib/types';
import { useNavigate, Link } from 'react-router-dom';

export const SignupPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('Shopkeeper');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = storage.getUsers();
    if (users.find(u => u.username === username)) {
      setError('Username already exists');
      return;
    }

    storage.addUser({ username, password, role });
    navigate('/login', { state: { message: 'Account created! Please sign in.' } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary text-white rounded-2xl shadow-lg mb-4">
            <Store size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">SHOP<span className="text-primary">SYNC</span></h1>
          <p className="text-gray-500 font-medium mt-1">Join our management network</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Create Account</h2>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Choose Role</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('Shopkeeper')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${role === 'Shopkeeper' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}
                >
                  <UserIcon size={16} /> Shopkeeper
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Owner')}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 transition-all font-bold text-sm ${role === 'Owner' ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-400'}`}
                >
                  <ShieldCheck size={16} /> Owner
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm font-medium p-3 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Sign Up <ArrowRight size={18} />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 font-medium">
            Already have an account? <Link to="/" className="text-primary font-bold hover:underline">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
