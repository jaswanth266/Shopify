import { InventoryItem } from "./types";

export const defaultInventory: InventoryItem[] = [
  { id: 1, name: "Kingfisher Beer", category: "bar", price: 190, stock: 24, minStock: 10, unit: "Bottle" },
  { id: 2, name: "Budweiser", category: "bar", price: 210, stock: 6, minStock: 10, unit: "Bottle" },
  { id: 3, name: "Old Monk Rum", category: "bar", price: 280, stock: 3, minStock: 5, unit: "Bottle" },
  { id: 4, name: "Royal Stag Whisky", category: "bar", price: 320, stock: 12, minStock: 8, unit: "Bottle" },
  { id: 5, name: "Coca-Cola", category: "beverage", price: 60, stock: 30, minStock: 15, unit: "Can" },
  { id: 6, name: "Soda Water", category: "beverage", price: 40, stock: 8, minStock: 12, unit: "Bottle" },
  { id: 7, name: "Masala Peanuts", category: "snack", price: 80, stock: 20, minStock: 10, unit: "Pack" },
  { id: 8, name: "Nachos", category: "snack", price: 120, stock: 2, minStock: 8, unit: "Pack" },
  { id: 9, name: "French Fries", category: "snack", price: 150, stock: 15, minStock: 8, unit: "Plate" },
  { id: 10, name: "Chicken Wings", category: "snack", price: 320, stock: 4, minStock: 5, unit: "Plate" },
];
