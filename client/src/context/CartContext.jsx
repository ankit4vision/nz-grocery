import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useCart } from '../hooks';
import { STORAGE_KEYS } from '../utils/constants';
import { productsData } from '../data/mockData';

/**
 * Cart Context for managing shopping cart state globally
 */

// Default mock cart items
const getDefaultCartItems = () => {
  // Start with empty cart
  return [];
};

// Initial state
const initialState = {
  items: getDefaultCartItems(),
  totalItems: 0,
  totalPrice: 0,
  isLoading: false,
  error: null,
  isOpen: false,
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM_QUANTITY: 'UPDATE_ITEM_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  CALCULATE_TOTALS: 'CALCULATE_TOTALS',
};

// Reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case CART_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case CART_ACTIONS.SET_ITEMS:
      return {
        ...state,
        items: action.payload,
        isLoading: false,
        error: null,
      };

    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { ...product, quantity }];
      }
      
      return {
        ...state,
        items: newItems,
        error: null,
      };
    }

    case CART_ACTIONS.REMOVE_ITEM: {
      const newItems = state.items.filter(item => item.id !== action.payload);
      return {
        ...state,
        items: newItems,
        error: null,
      };
    }

    case CART_ACTIONS.UPDATE_ITEM_QUANTITY: {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== productId),
          error: null,
        };
      }
      
      const newItems = state.items.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      return {
        ...state,
        items: newItems,
        error: null,
      };
    }

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        error: null,
      };

    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case CART_ACTIONS.CALCULATE_TOTALS: {
      const totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      const totalPrice = state.items.reduce((total, item) => {
        const price = Number(item.currentPrice || item.price || 0);
        return total + (price * item.quantity);
      }, 0);
      
      return {
        ...state,
        totalItems,
        totalPrice,
      };
    }

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Load cart from localStorage on mount
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });
    try {
      dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: cartItems });
    } catch (error) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
    }
  }, [cartItems]);

  // Calculate totals whenever items change
  useEffect(() => {
    dispatch({ type: CART_ACTIONS.CALCULATE_TOTALS });
  }, [state.items]);

  // Context actions
  const actions = {
    addItem: (product, quantity = 1) => {
      try {
        addToCart(product, quantity);
        dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity } });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    removeItem: (productId) => {
      try {
        removeFromCart(productId);
        dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    updateItemQuantity: (productId, quantity) => {
      try {
        updateQuantity(productId, quantity);
        dispatch({ type: CART_ACTIONS.UPDATE_ITEM_QUANTITY, payload: { productId, quantity } });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    clearCart: () => {
      try {
        clearCart();
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
      } catch (error) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message });
      }
    },

    toggleCart: () => {
      dispatch({ type: CART_ACTIONS.TOGGLE_CART });
    },

    openCart: () => {
      dispatch({ type: CART_ACTIONS.TOGGLE_CART });
    },

    closeCart: () => {
      if (state.isOpen) {
        dispatch({ type: CART_ACTIONS.TOGGLE_CART });
      }
    },

    getItemQuantity: (productId) => {
      const item = state.items.find(item => item.id === productId);
      return item ? item.quantity : 0;
    },

    isInCart: (productId) => {
      return state.items.some(item => item.id === productId);
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
