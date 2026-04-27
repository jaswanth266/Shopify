
export type Category = 'bar' | 'beverage' | 'snack';
export type PaymentMethod = 'cash' | 'card' | 'phonepay';

export interface InventoryItem {
  id: number;
  name: string;
  category: Category;
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
  paymentMethod: PaymentMethod;
}

export type Role = 'Owner' | 'Shopkeeper';

export interface User {
  username: string;
  password: string;
  role: Role;
}

export interface CartItem extends InventoryItem {
  quantity: number;
}
