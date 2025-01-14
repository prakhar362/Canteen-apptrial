import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the structure of a cart item
type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

// Define the context's value
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Add item to the cart
  const addToCart = (item: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        // Update quantity if the item is already in the cart
        return prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prev, item];
    });
  };

  // Update quantity of an item
  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((cartItem) =>
        cartItem.id === id ? { ...cartItem, quantity } : cartItem
      )
    );
  };

  // Remove item from the cart
  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((cartItem) => cartItem.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook to use the cart context
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
