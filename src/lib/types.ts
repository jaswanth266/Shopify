export interface InventoryItem {
  id: number;
  name: string;
  category: "bar" | "beverage" | "snack";
  price: number;
  stock: number;
  minStock: number;
  unit: string;
}

export interface Transaction {
  id: string;
  timestamp: string;
  items: string;
  total: number;
  paymentMethod: "cash" | "card" | "phonepay";
}

export interface CartItem {
  item: InventoryItem;
  quantity: number;
}

export type StockStatus = "ok" | "low" | "critical" | "out";
export type UserRole = "owner" | "keeper";
export type Category = "all" | "bar" | "beverage" | "snack";
export type PaymentMethod = "cash" | "card" | "phonepay";
