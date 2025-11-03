import React, { createContext, useContext, useState } from "react";

// ✅ Step 1: Create the Cart Context
const CartContext = createContext();

// ✅ Step 2: Create the Cart Provider
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // You can add functions here (optional)
  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Step 3: Custom hook for using the cart context
export const useCart = () => useContext(CartContext);
