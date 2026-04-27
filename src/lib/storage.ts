
import { InventoryItem, Transaction, Role, User } from './types';
import { INITIAL_INVENTORY } from './data';

const KEYS = {
  INVENTORY: 'shop_inventory',
  TRANSACTIONS: 'shop_transactions',
  REVENUE: 'shop_revenue',
  ROLE: 'shop_role',
  USERS: 'shop_users'
};

const DEFAULT_USERS: User[] = [
  { username: 'owner', password: 'owner123', role: 'Owner' },
  { username: 'keeper', password: 'shop123', role: 'Shopkeeper' }
];

export const storage = {
  getUsers: (): User[] => {
    if (typeof window === 'undefined') return DEFAULT_USERS;
    const stored = localStorage.getItem(KEYS.USERS);
    if (!stored) {
      localStorage.setItem(KEYS.USERS, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(stored);
  },

  addUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  getInventory: (): InventoryItem[] => {
    if (typeof window === 'undefined') return INITIAL_INVENTORY;
    const stored = localStorage.getItem(KEYS.INVENTORY);
    if (!stored) {
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
      return INITIAL_INVENTORY;
    }
    return JSON.parse(stored);
  },

  setInventory: (items: InventoryItem[]) => {
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
  },

  getTransactions: (): Transaction[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(KEYS.TRANSACTIONS);
    return stored ? JSON.parse(stored) : [];
  },

  addTransaction: (transaction: Transaction) => {
    const transactions = storage.getTransactions();
    transactions.unshift(transaction); // Most recent first
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
    
    // Update revenue
    const currentRevenue = storage.getRevenue();
    storage.setRevenue(currentRevenue + transaction.total);
  },

  getRevenue: (): number => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem(KEYS.REVENUE);
    return stored ? Number(stored) : 0;
  },

  setRevenue: (amount: number) => {
    localStorage.setItem(KEYS.REVENUE, amount.toString());
  },

  getRole: (): Role | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(KEYS.ROLE) as Role | null;
  },

  setRole: (role: Role | null) => {
    if (role) {
      localStorage.setItem(KEYS.ROLE, role);
    } else {
      localStorage.removeItem(KEYS.ROLE);
    }
  }
};
