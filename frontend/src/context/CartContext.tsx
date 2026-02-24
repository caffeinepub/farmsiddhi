import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  productId: number;
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: number, variantName: string) => void;
  updateQuantity: (productId: number, variantName: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === newItem.productId && i.variantName === newItem.variantName
      );
      if (existing) {
        return prev.map(i =>
          i.productId === newItem.productId && i.variantName === newItem.variantName
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: number, variantName: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variantName === variantName)));
  };

  const updateQuantity = (productId: number, variantName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, variantName);
      return;
    }
    setItems(prev =>
      prev.map(i =>
        i.productId === productId && i.variantName === variantName ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartTotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
