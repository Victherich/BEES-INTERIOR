"use client";

import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "app_cart";

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart on client mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          setCart(JSON.parse(saved));
        }
      } catch (error) {
        console.error("Error loading cart from localStorage", error);
      }
    }
  }, []);

  const saveCartToStorage = (updatedCart) => {
    setCart(updatedCart);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedCart));
      } catch (error) {
        console.error("Error saving cart to localStorage", error);
      }
    }
  };

  const addToCart = (productToAdd) => {
    const currentCart = [...cart];
    
    // Check if exact variant/product exists
    const existingIndex = currentCart.findIndex(
      (item) =>
        item.id === productToAdd.id &&
        item.selectedColor === productToAdd.selectedColor &&
        item.selectedSize === productToAdd.selectedSize
    );

    if (existingIndex > -1) {
      currentCart[existingIndex].quantity += (productToAdd.quantity || 1);
    } else {
      currentCart.push({
        ...productToAdd,
        quantity: productToAdd.quantity || 1,
      });
    }

    saveCartToStorage(currentCart);
  };

  const updateQuantity = (id, selectedColor, selectedSize, delta) => {
    const updated = cart
      .map((item) => {
        if (
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        ) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    saveCartToStorage(updated);
  };

  const removeFromCart = (id, selectedColor, selectedSize) => {
    const updated = cart.filter(
      (item) =>
        !(
          item.id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
        )
    );
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const cartTotalItems = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || item.amount || 0) * item.quantity, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotalItems,
      cartSubtotal,
    }),
    [cart, cartTotalItems, cartSubtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}