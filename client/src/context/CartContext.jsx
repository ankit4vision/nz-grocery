import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useUserContext } from './UserContext';
import CartService from '../services/api/cart';

/**
 * Cart Context for managing shopping cart state globally
 * Uses real API for all cart operations
 */

// Initial state
const initialState = {
  cartId: null,
  items: [],
  itemCount: 0, // Number of unique items/products
  totalItems: 0, // Total quantity of all items
  totalPrice: 0,
  isLoading: false,
  error: null,
  isOpen: false,
  lastUpdated: null,
};

// Action types
const CART_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_CART_ID: 'SET_CART_ID',
  SET_ITEMS: 'SET_ITEMS',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_ITEM_QUANTITY: 'UPDATE_ITEM_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  TOGGLE_CART: 'TOGGLE_CART',
  REFRESH_CART: 'REFRESH_CART',
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

    case CART_ACTIONS.SET_CART_ID:
      return {
        ...state,
        cartId: action.payload,
        error: null,
      };

    case CART_ACTIONS.SET_ITEMS:
      const items = action.payload.items || [];
      // item_count = number of unique products (e.g., 2 products = items.length)
      // total_items = total quantity across all products (e.g., 6 items = sum of quantities)
      // Always calculate itemCount from items array length (number of unique products)
      const itemCount = items.length; // Number of unique products
      // Use API's total_items if available, otherwise calculate from quantities
      const totalItems = action.payload.total_items !== undefined && action.payload.total_items !== null
        ? action.payload.total_items
        : items.reduce((sum, item) => sum + (item.quantity || 0), 0); // Sum of all quantities
      const totalPrice = action.payload.total_amount || items.reduce((sum, item) => sum + (item.total_price || 0), 0);
      
      return {
        ...state,
        items,
        itemCount,
        totalItems,
        totalPrice,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.ADD_ITEM:
      // This is handled by refreshing cart from API
      return {
        ...state,
        error: null,
      };

    case CART_ACTIONS.REMOVE_ITEM:
      // This is handled by refreshing cart from API
        return {
          ...state,
          error: null,
        };

    case CART_ACTIONS.UPDATE_ITEM_QUANTITY:
      // This is handled by refreshing cart from API
      return {
        ...state,
        error: null,
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: [],
        itemCount: 0,
        totalItems: 0,
        totalPrice: 0,
        error: null,
        lastUpdated: new Date().toISOString(),
      };

    case CART_ACTIONS.TOGGLE_CART:
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case CART_ACTIONS.REFRESH_CART:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, isAuthenticated } = useUserContext();
  const isAddingItemRef = useRef(false); // Prevent duplicate add operations

  /**
   * Get user ID from user object (handles both id and user_id fields)
   */
  const getUserId = useCallback(() => {
    if (!user) return null;
    return user.id || user.user_id || null;
  }, [user]);

  /**
   * Load cart items from API
   */
  const loadCart = useCallback(async () => {
    const userId = getUserId();
    
    if (!isAuthenticated || !userId) {
      if (import.meta.env.DEV) {
        console.log('[CartContext] Cannot load cart - Auth check:', {
          isAuthenticated,
          userId,
          user: user ? { ...user, password: '***' } : null
        });
      }
      dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: { items: [], total_items: 0, total_amount: 0 } });
      return;
    }

    dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

    try {
      // Get or create active cart
      const cartResponse = await CartService.getOrCreateActiveCart(userId);
      
      if (!cartResponse.success) {
        // If no cart exists, that's okay - just set empty cart
        if (cartResponse.status === 404) {
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: { items: [], total_items: 0, total_amount: 0 } });
          return;
        }
        throw new Error(cartResponse.message || 'Failed to load cart');
      }

      const cart = cartResponse.data;
      const cartId = cart.cart_id || cart.id;

      if (!cartId) {
        throw new Error('Cart ID not found in response');
      }

      dispatch({ type: CART_ACTIONS.SET_CART_ID, payload: cartId });

      // Get cart items with pricing
      const itemsResponse = await CartService.getCartItemsWithPricing(cartId);
      
      if (!itemsResponse.success) {
        // If no items, that's okay
        if (itemsResponse.status === 404) {
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: { items: [], total_items: 0, total_amount: 0 } });
          return;
        }
        throw new Error(itemsResponse.message || 'Failed to load cart items');
      }

      const cartData = itemsResponse.data;
      dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: cartData });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ 
        type: CART_ACTIONS.SET_ERROR, 
        payload: error.message || 'Failed to load cart' 
      });
    }
  }, [isAuthenticated, getUserId, user]);

  // Load cart when user changes or on mount
  // Use a ref to prevent loading cart while an add operation is in progress
  const shouldLoadCartRef = useRef(true);
  
  useEffect(() => {
    // Only load cart if we're not in the middle of adding an item
    if (shouldLoadCartRef.current && !isAddingItemRef.current) {
      loadCart();
    }
  }, [loadCart]);

  // Context actions
  const actions = {
    /**
     * Add item to cart
     * @param {object} product - Product object with productId, variantId, etc.
     * @param {number} quantity - Quantity to add
     */
    addItem: async (product, quantity = 1) => {
      // Prevent duplicate add operations
      if (isAddingItemRef.current) {
        console.warn('[CartContext] Add to cart already in progress, ignoring duplicate call');
        return { success: false, message: 'Add to cart operation already in progress' };
      }

      const userId = getUserId();
      
      // Detailed authentication check with logging
      if (!isAuthenticated) {
        const errorMsg = 'Please login to add items to cart. You are not authenticated.';
        console.error('[CartContext] Add to cart failed - Not authenticated:', {
          isAuthenticated,
          hasUser: !!user,
          userId,
          userObject: user ? { ...user, password: '***' } : null
        });
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMsg });
        return { success: false, message: errorMsg };
      }

      if (!userId) {
        const errorMsg = 'Please login to add items to cart. User ID not found.';
        console.error('[CartContext] Add to cart failed - No user ID:', {
          isAuthenticated,
          hasUser: !!user,
          userId,
          userObject: user ? { ...user, password: '***' } : null,
          userKeys: user ? Object.keys(user) : []
        });
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: errorMsg });
        return { success: false, message: errorMsg };
      }

      // Set flag to prevent duplicate calls and prevent useEffect from loading cart
      isAddingItemRef.current = true;
      shouldLoadCartRef.current = false;
      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      try {
        // Ensure we have a cart ID
        let cartId = state.cartId;
        
        if (!cartId) {
          // Get or create active cart (only if we don't have one)
          const cartResponse = await CartService.getOrCreateActiveCart(userId);
          
          if (!cartResponse.success) {
            throw new Error(cartResponse.message || 'Failed to get or create cart');
          }

          const cart = cartResponse.data;
          cartId = cart.cart_id || cart.id;

          if (!cartId) {
            throw new Error('Cart ID not found in response');
          }

          dispatch({ type: CART_ACTIONS.SET_CART_ID, payload: cartId });
        }

        const itemData = {
          cart_id: cartId,
          product_id: product.productId || product.product_id || product.id,
          quantity: quantity,
        };

        // Add variant_id if available
        if (product.variantId || product.variant_id) {
          itemData.variant_id = product.variantId || product.variant_id;
        }

        // Add item to cart (ONLY ONCE)
        const response = await CartService.addItem(itemData);

        if (!response.success) {
          throw new Error(response.message || 'Failed to add item to cart');
        }

        // Refresh full cart items to get updated list with new item
        const itemsResponse = await CartService.getCartItemsWithPricing(cartId);
        
        if (itemsResponse.success && itemsResponse.data) {
          // Update full items list with new item
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: itemsResponse.data });
        } else {
          console.warn('Failed to refresh cart items after add, reloading cart as fallback');
          await loadCart();
        }

        return { success: true, message: 'Item added to cart' };
      } catch (error) {
        console.error('Error adding item to cart:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Failed to add item to cart' });
        return { success: false, message: error.message || 'Failed to add item to cart' };
      } finally {
        // Reset flags after a short delay to allow state to settle
        setTimeout(() => {
          isAddingItemRef.current = false;
          shouldLoadCartRef.current = true;
        }, 100);
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      }
    },

    /**
     * Remove item from cart
     * @param {number|string} itemId - Cart item ID, variant ID, or object with {productId, variantId}
     * @param {number|string} productId - Product ID (optional, for more accurate matching)
     */
    removeItem: async (itemId, productId = null) => {
      if (!state.cartId) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'No cart found' });
        return { success: false, message: 'No cart found' };
      }

      // Find cart item ID from variant ID/product ID if needed
      let cartItemId = itemId;
      if (typeof itemId === 'string' || (typeof itemId === 'number' && itemId < 1000)) {
        // Likely a variant ID, find the actual cart item
        // If productId is also provided, use both for accurate matching
        const item = state.items.find(i => {
          if (productId !== null && productId !== undefined) {
            // Match by BOTH product_id AND variant_id for accuracy
            return i.product_id === productId && i.variant_id === itemId;
          }
          // Fallback: match by variant_id only (less accurate)
          return i.variant_id === itemId || i.cart_item_id === itemId;
        });
        if (item) {
          cartItemId = item.cart_item_id;
        }
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      try {
        const response = await CartService.removeItem(cartItemId);

        if (!response.success) {
          throw new Error(response.message || 'Failed to remove item from cart');
        }

        // Refresh full cart items to get updated list (removed item should be gone)
        const itemsResponse = await CartService.getCartItemsWithPricing(state.cartId);
        
        if (itemsResponse.success && itemsResponse.data) {
          // Update full items list
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: itemsResponse.data });
        } else if (
          itemsResponse.status === 404 ||
          (itemsResponse.data && itemsResponse.data.items && itemsResponse.data.items.length === 0)
        ) {
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: { items: [], total_items: 0, total_amount: 0, item_count: 0 } });
        } else {
          // Last resort: full cart reload
          await loadCart();
        }

        return { success: true, message: 'Item removed from cart' };
      } catch (error) {
        console.error('Error removing item from cart:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Failed to remove item from cart' });
        return { success: false, message: error.message || 'Failed to remove item from cart' };
      }
    },

    /**
     * Update item quantity
     * @param {number|string} itemId - Cart item ID, variant ID, or object with {productId, variantId}
     * @param {number} quantity - New quantity
     * @param {number|string} productId - Product ID (optional, for more accurate matching)
     */
    updateItemQuantity: async (itemId, quantity, productId = null) => {
      if (!state.cartId) {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'No cart found' });
        return { success: false, message: 'No cart found' };
      }

      if (quantity < 1) {
        // Remove item if quantity is 0 or less
        return await actions.removeItem(itemId, productId);
      }

      // Find cart item ID from variant ID/product ID if needed
      let cartItemId = itemId;
      if (typeof itemId === 'string' || (typeof itemId === 'number' && itemId < 1000)) {
        // Likely a variant ID, find the actual cart item
        // If productId is also provided, use both for accurate matching
        const item = state.items.find(i => {
          if (productId !== null && productId !== undefined) {
            // Match by BOTH product_id AND variant_id for accuracy
            return i.product_id === productId && i.variant_id === itemId;
          }
          // Fallback: match by variant_id only (less accurate)
          return i.variant_id === itemId || i.cart_item_id === itemId;
        });
        if (item) {
          cartItemId = item.cart_item_id;
        }
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      try {
        const response = await CartService.updateItemQuantity(cartItemId, quantity);

        if (!response.success) {
          throw new Error(response.message || 'Failed to update item quantity');
        }

        // Refresh full cart items to get updated quantities and pricing
        const itemsResponse = await CartService.getCartItemsWithPricing(state.cartId);
        
        if (itemsResponse.success && itemsResponse.data) {
          // Update full items list with new quantities
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: itemsResponse.data });
        } else {
          // Fallback: full cart reload
          await loadCart();
        }

        return { success: true, message: 'Item quantity updated' };
      } catch (error) {
        console.error('Error updating item quantity:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Failed to update item quantity' });
        return { success: false, message: error.message || 'Failed to update item quantity' };
      } finally {
        dispatch({ type: CART_ACTIONS.SET_LOADING, payload: false });
      }
    },

    /**
     * Clear entire cart
     */
    clearCart: async () => {
      if (!state.cartId) {
        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        return { success: true, message: 'Cart is already empty' };
      }

      dispatch({ type: CART_ACTIONS.SET_LOADING, payload: true });

      try {
        const response = await CartService.clearCart(state.cartId);

        if (!response.success) {
          throw new Error(response.message || 'Failed to clear cart');
        }

        dispatch({ type: CART_ACTIONS.CLEAR_CART });
        return { success: true, message: 'Cart cleared successfully' };
      } catch (error) {
        console.error('Error clearing cart:', error);
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: error.message || 'Failed to clear cart' });
        return { success: false, message: error.message || 'Failed to clear cart' };
      }
    },

    /**
     * Refresh cart from API
     * @param {boolean} fullRefresh - If true, fetches full items. If false, only updates summary (faster)
     */
    refreshCart: async (fullRefresh = false) => {
      if (!state.cartId) {
        await loadCart();
        return;
      }

      if (fullRefresh) {
        // Fetch full items with pricing
        await loadCart();
      } else {
        // Update totals using latest items with pricing
        const itemsResponse = await CartService.getCartItemsWithPricing(state.cartId);
        if (itemsResponse.success && itemsResponse.data) {
          dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: itemsResponse.data });
        }
      }
    },

    /**
     * Load full cart items (use when cart sidebar is opened)
     */
    loadCartItems: async () => {
      if (!state.cartId) {
        await loadCart();
        return;
      }

      const itemsResponse = await CartService.getCartItemsWithPricing(state.cartId);
      if (itemsResponse.success && itemsResponse.data) {
        dispatch({ type: CART_ACTIONS.SET_ITEMS, payload: itemsResponse.data });
      }
    },

    toggleCart: () => {
      dispatch({ type: CART_ACTIONS.TOGGLE_CART });
    },

    openCart: () => {
      if (!state.isOpen) {
      dispatch({ type: CART_ACTIONS.TOGGLE_CART });
      }
    },

    closeCart: () => {
      if (state.isOpen) {
        dispatch({ type: CART_ACTIONS.TOGGLE_CART });
      }
    },

    /**
     * Get item quantity in cart by product ID and variant ID
     * @param {number|string} productId - Product ID (required for accurate matching)
     * @param {number|string} variantId - Variant ID (required for accurate matching)
     * @returns {number} - Quantity in cart
     */
    getItemQuantity: (productId, variantId = null) => {
      // Early return if cart is empty
      if (!state.items || state.items.length === 0) {
        return 0;
      }

      // If only one argument provided, treat it as variantId for backward compatibility
      if (variantId === null && productId !== null) {
        // Backward compatibility: if only one arg, assume it's variantId
        const item = state.items.find(i => {
          // Use loose equality for type coercion (handles string/number mismatch)
          return String(i.variant_id) === String(productId) || String(i.cart_item_id) === String(productId);
        });
        return item ? item.quantity : 0;
      }
      
      // Match by BOTH product_id AND variant_id for exact matching
      // This ensures we only match the exact product variant combination
      const item = state.items.find(i => {
        // Convert to strings for comparison to handle type mismatches (number vs string)
        const cartProductId = i.product_id != null ? String(i.product_id) : null;
        const cartVariantId = i.variant_id != null ? String(i.variant_id) : null;
        const searchProductId = productId != null ? String(productId) : null;
        const searchVariantId = variantId != null ? String(variantId) : null;
        
        // Both product_id and variant_id must match exactly
        const productMatch = cartProductId === searchProductId;
        
        // If variantId is provided, require exact match on both
        if (searchVariantId !== null && searchVariantId !== undefined) {
          const variantMatch = cartVariantId === searchVariantId;
          return productMatch && variantMatch;
        }
        
        // If variantId is null/undefined, match by product_id only (fallback for products without variants)
        // But only if cart item also has null variant_id
        if (searchVariantId === null || searchVariantId === undefined) {
          return productMatch && (cartVariantId === null || cartVariantId === undefined);
        }
        
        return productMatch;
      });
      return item ? item.quantity : 0;
    },

    /**
     * Check if product variant is in cart (must match BOTH product_id AND variant_id)
     * @param {number|string} productId - Product ID (required for accurate matching)
     * @param {number|string} variantId - Variant ID (required for accurate matching)
     * @returns {boolean} - Whether item is in cart
     */
    isInCart: (productId, variantId = null) => {
      // Early return if cart is empty
      if (!state.items || state.items.length === 0) {
        return false;
      }

      // If only one argument provided, treat it as variantId for backward compatibility
      if (variantId === null && productId !== null) {
        // Backward compatibility: if only one arg, assume it's variantId
        return state.items.some(item => {
          // Use string conversion for type-safe comparison
          return String(item.variant_id) === String(productId) || String(item.cart_item_id) === String(productId);
        });
      }
      
      // Match by BOTH product_id AND variant_id for exact matching
      // This ensures we only match the exact product variant combination
      return state.items.some(item => {
        // Convert to strings for comparison to handle type mismatches (number vs string)
        const cartProductId = item.product_id != null ? String(item.product_id) : null;
        const cartVariantId = item.variant_id != null ? String(item.variant_id) : null;
        const searchProductId = productId != null ? String(productId) : null;
        const searchVariantId = variantId != null ? String(variantId) : null;
        
        // Both product_id and variant_id must match exactly
        const productMatch = cartProductId === searchProductId;
        
        // If variantId is provided, require exact match on both
        if (searchVariantId !== null && searchVariantId !== undefined) {
          const variantMatch = cartVariantId === searchVariantId;
          return productMatch && variantMatch;
        }
        
        // If variantId is null/undefined, match by product_id only (fallback for products without variants)
        // But only if cart item also has null variant_id
        if (searchVariantId === null || searchVariantId === undefined) {
          return productMatch && (cartVariantId === null || cartVariantId === undefined);
        }
        
        return productMatch;
      });
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
