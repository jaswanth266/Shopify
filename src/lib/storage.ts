import { InventoryItem, Transaction } from "./types";
import { defaultInventory } from "./data";

const KEYS = {
  ROLE: "shop_role",
  INVENTORY: "shop_inventory",
  TRANSACTIONS: "shop_transactions",
  REVENUE: "shop_revenue",
} as const;

export const storage = {
  getRole: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(KEYS.ROLE);
  },

  setRole: (role: string): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.ROLE, role);
  },

  clearRole: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEYS.ROLE);
  },

  getInventory: (): InventoryItem[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(KEYS.INVENTORY);
    if (!data) {
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(defaultInventory));
      return defaultInventory;
    }
    try {
      return JSON.parse(data) as InventoryItem[];
    } catch {
      return defaultInventory;
    }
  },

  setInventory: (items: InventoryItem[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.INVENTORY, JSON.stringify(items));
  },

  getTransactions: (): Transaction[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    if (!data) return [];
    try {
      return JSON.parse(data) as Transaction[];
    } catch {
      return [];
    }
  },

  setTransactions: (transactions: Transaction[]): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
  },

  getRevenue: (): number => {
    if (typeof window === "undefined") return 0;
    const data = localStorage.getItem(KEYS.REVENUE);
    if (!data) return 0;
    return parseFloat(data) || 0;
  },

  setRevenue: (amount: number): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.REVENUE, amount.toString());
  },

  addTransaction: (transaction: Transaction): void => {
    if (typeof window === "undefined") return;
    const transactions = storage.getTransactions();
    transactions.unshift(transaction);
    storage.setTransactions(transactions);
    const revenue = storage.getRevenue();
    storage.setRevenue(revenue + transaction.total);
  },

  initializeIfEmpty: (): void => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEYS.INVENTORY)) {
      localStorage.setItem(KEYS.INVENTORY, JSON.stringify(defaultInventory));
    }
    if (!localStorage.getItem(KEYS.TRANSACTIONS)) {
      localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(KEYS.REVENUE)) {
      localStorage.setItem(KEYS.REVENUE, "0");
    }
  },
};

export const getStockStatus = (item: InventoryItem): "ok" | "low" | "critical" | "out" => {
  if (item.stock === 0) return "out";
  if (item.stock <= item.minStock * 0.5) return "critical";
  if (item.stock <= item.minStock) return "low";
  return "ok";
};

export const generateTransactionId = (transactions: Transaction[]): string => {
  const num = transactions.length + 1;
  return `T${String(num).padStart(3, "0")}`;
};

export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString("en-IN")}`;
};

export const formatTime = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
