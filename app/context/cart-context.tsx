"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type CartItemAddon = {
  name: string;
  price: number;
  qty: number;
};

export type CartItem = {
  id: string; // unique generated ID for this cart entry
  itemId: string;
  name: string;
  basePrice: number;
  qty: number;
  addons: CartItemAddon[];
  totalItemPrice: number;
  image?: string;
  portionSize?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, newQty: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load from local storage if available
    const saved = localStorage.getItem("restaurant-cart");
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse cart JSON");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("restaurant-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Check if an identical item already exists in the cart
      const existingItemIndex = prev.findIndex((i) => {
        if (i.itemId !== item.itemId) return false;
        if (i.portionSize !== item.portionSize) return false;

        // Check if addons are identical
        if (i.addons.length !== item.addons.length) return false;

        const sortedExistingAddons = [...i.addons].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        const sortedNewAddons = [...item.addons].sort((a, b) =>
          a.name.localeCompare(b.name),
        );

        return sortedExistingAddons.every(
          (addon, idx) =>
            addon.name === sortedNewAddons[idx].name &&
            addon.price === sortedNewAddons[idx].price &&
            addon.qty === sortedNewAddons[idx].qty,
        );
      });

      if (existingItemIndex > -1) {
        // Item exists, update its quantity
        const newCart = [...prev];
        const existingItem = newCart[existingItemIndex];
        const newQty = existingItem.qty + item.qty;

        newCart[existingItemIndex] = {
          ...existingItem,
          qty: newQty,
          totalItemPrice:
            (existingItem.basePrice +
              existingItem.addons.reduce(
                (sum, a) => sum + a.price * a.qty,
                0,
              )) *
            newQty,
        };
        return newCart;
      }

      // Item does not exist, add it
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQty = (id: string, newQty: number) => {
    setCart((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              qty: newQty,
              totalItemPrice:
                (i.basePrice +
                  i.addons.reduce((sum, a) => sum + a.price * a.qty, 0)) *
                newQty,
            }
          : i,
      ),
    );
  };

  const clearCart = () => setCart([]);

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.totalItemPrice, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
