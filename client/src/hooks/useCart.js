import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing shopping cart state
 * 
 * @returns {object} - Cart state and methods
 * 
 * @example
 * const { 
 *   cartItems, 
 *   addToCart, 
 *   removeFromCart, 
 *   updateQuantity, 
 *   clearCart, 
 *   getTotalPrice, 
 *   getTotalItems 
 * } = useCart();
 */
export const useCart = () => {
  const [cartItems, setCartItems] = useLocalStorage('cart', []);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item to cart
        return [...prevItems, { ...product, quantity }];
      }
    });
  }, [setCartItems]);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, [setCartItems]);

  // Update item quantity
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [setCartItems, removeFromCart]);

  // Clear entire cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  // Get total price
  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const price = item.currentPrice || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  }, [cartItems]);

  // Get total items count
  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  // Check if item is in cart
  const isInCart = useCallback((productId) => {
    return cartItems.some(item => item.id === productId);
  }, [cartItems]);

  // Get item quantity in cart
  const getItemQuantity = useCallback((productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    isInCart,
    getItemQuantity
  };
};

export default useCart;
