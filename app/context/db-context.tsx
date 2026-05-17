"use client";

import React, { createContext, useContext, useState } from "react";
import { menuSections as initialMenuSections } from "@/app/menu/data";

// Type definitions
export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
};

export type OrderItem = {
  name: string;
  price: string;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "Preparing" | "On Route" | "Completed" | "Cancelled";
  time: string;
};

export type Review = {
  id: string;
  userId: string;
  rating: number;
  comment: string;
  date: string;
  itemName?: string;
};

// Initial Mock Data
const MOCK_USERS: User[] = [
  { id: "u1", name: "Chomi Adeyemi", email: "chomi@example.com", avatar: "CA", joinDate: "Jan 12, 2026" },
  { id: "u2", name: "Sarah Bolu", email: "sarah.b@example.com", avatar: "SB", joinDate: "Feb 05, 2026" },
  { id: "u3", name: "Michael Okonkwo", email: "mike.o@example.com", avatar: "MO", joinDate: "Mar 10, 2026" },
  { id: "u4", name: "Fatima Aminu", email: "fatima@example.com", avatar: "FA", joinDate: "Mar 22, 2026" },
  { id: "u5", name: "David Eyo", email: "david.e@example.com", avatar: "DE", joinDate: "Apr 01, 2026" },
];

const MOCK_ORDERS: Order[] = [
  { id: "ORD-901", userId: "u1", items: [{ name: "Jollof rice", price: "₦1,200", quantity: 2 }, { name: "Chicken (soft)", price: "₦1,600", quantity: 2 }], total: 5600, status: "Completed", time: "May 09, 12:30 PM" },
  { id: "ORD-902", userId: "u1", items: [{ name: "Egusi", price: "₦1,800", quantity: 1 }, { name: "Pounded yam", price: "₦900", quantity: 2 }], total: 3600, status: "Preparing", time: "May 09, 2:15 PM" },
  { id: "ORD-903", userId: "u2", items: [{ name: "Combo A: Jollof + Chicken + Drink", price: "₦3,300", quantity: 1 }], total: 3300, status: "Completed", time: "May 08, 1:00 PM" },
  { id: "ORD-904", userId: "u3", items: [{ name: "Catfish pepper soup", price: "₦3,500", quantity: 1 }], total: 3500, status: "On Route", time: "May 09, 6:00 PM" },
  { id: "ORD-905", userId: "u4", items: [{ name: "Ofada rice", price: "₦1,800", quantity: 2 }], total: 3600, status: "Completed", time: "May 07, 4:45 PM" },
  { id: "ORD-906", userId: "u5", items: [{ name: "Amala", price: "₦600", quantity: 3 }, { name: "Gbegiri", price: "₦1,000", quantity: 1 }, { name: "Ewedu", price: "₦1,000", quantity: 1 }], total: 3800, status: "Preparing", time: "May 09, 7:15 PM" },
];

const MOCK_REVIEWS: Review[] = [
  { id: "rev1", userId: "u1", rating: 5, comment: "The food was absolutely amazing, the Egusi soup was spot on! Will order again.", date: "May 02, 2026", itemName: "Egusi" },
  { id: "rev2", userId: "u2", rating: 4, comment: "Loved the Combo A, but the chicken could be softer.", date: "May 05, 2026", itemName: "Combo A" },
  { id: "rev3", userId: "u3", rating: 5, comment: "Catfish pepper soup was spicy and perfect for the cold weather.", date: "May 06, 2026", itemName: "Catfish pepper soup" },
  { id: "rev4", userId: "u4", rating: 4.5, comment: "Ofada rice reminded me of home. Good portions.", date: "May 08, 2026", itemName: "Ofada rice" },
  { id: "rev5", userId: "u5", rating: 3, comment: "Amala was a bit lumpy today. Still decent.", date: "May 08, 2026", itemName: "Amala" },
];

type DbContextType = {
  menu: any[];
  users: User[];
  orders: Order[];
  reviews: Review[];
  updateMenuItem: (categoryIndex: number, itemIndex: number, newItem: any) => void;
  deleteMenuItem: (categoryIndex: number, itemIndex: number) => void;
  addMenuItem: (categoryIndex: number, newItem: any) => void;
  updateOrderStatus: (orderId: string, newStatus: "Preparing" | "On Route" | "Completed" | "Cancelled") => void;
  activeUser: User | null;
  setActiveUser: (user: User | null) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
};

const DbContext = createContext<DbContextType | undefined>(undefined);

export function DbProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState(initialMenuSections);
  const [users, setUsers] = useState(MOCK_USERS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [reviews] = useState(MOCK_REVIEWS);
  const [activeUser, setActiveUser] = useState<User | null>(MOCK_USERS[0]); // Default to first user

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...data } : u));
    if (activeUser?.id === userId) {
      setActiveUser(prev => prev ? { ...prev, ...data } : prev);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: "Preparing" | "On Route" | "Completed" | "Cancelled") => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const updateMenuItem = (categoryIndex: number, itemIndex: number, newItem: any) => {
    setMenu(prev => {
      const newMenu = [...prev];
      newMenu[categoryIndex].items[itemIndex] = newItem;
      return newMenu;
    });
  };

  const deleteMenuItem = (categoryIndex: number, itemIndex: number) => {
    setMenu(prev => {
      const newMenu = [...prev];
      newMenu[categoryIndex].items.splice(itemIndex, 1);
      return newMenu;
    });
  };

  const addMenuItem = (categoryIndex: number, newItem: any) => {
    setMenu(prev => {
      const newMenu = [...prev];
      newMenu[categoryIndex].items.push(newItem);
      return newMenu;
    });
  };

  return (
    <DbContext.Provider value={{
      menu, users, orders, reviews,
      updateMenuItem, deleteMenuItem, addMenuItem, updateOrderStatus,
      activeUser, setActiveUser, updateUser
    }}>
      {children}
    </DbContext.Provider>
  );
}

export function useDb() {
  const context = useContext(DbContext);
  if (!context) {
    throw new Error("useDb must be used within a DbProvider");
  }
  return context;
}
