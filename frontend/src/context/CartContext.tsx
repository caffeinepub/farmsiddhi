import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  productId: bigint;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: bigint;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: bigint, variantName: string) => void;
  updateQuantity: (productId: bigint, variantName: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const key = `${newItem.productId.toString()}-${newItem.variantName}`;
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId.toString() === newItem.productId.toString() &&
          item.variantName === newItem.variantName
      );
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItem.quantity,
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: bigint, variantName: string) => {
    setItems((prev) =>
      prev.filter(
        (item) =>
          !(item.productId.toString() === productId.toString() && item.variantName === variantName)
      )
    );
  };

  const updateQuantity = (productId: bigint, variantName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId.toString() === productId.toString() && item.variantName === variantName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce(
    (sum, item) => sum + item.quantity * Number(item.unitPrice),
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
