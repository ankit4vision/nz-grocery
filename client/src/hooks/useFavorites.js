import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

/**
 * Custom hook for managing favorite products
 * 
 * @returns {object} - Favorites state and methods
 * 
 * @example
 * const { 
 *   favorites, 
 *   addToFavorites, 
 *   removeFromFavorites, 
 *   toggleFavorite, 
 *   isFavorite 
 * } = useFavorites();
 */
export const useFavorites = () => {
  const [favorites, setFavorites] = useLocalStorage('favorites', []);

  // Add product to favorites
  const addToFavorites = useCallback((product) => {
    setFavorites(prevFavorites => {
      if (!prevFavorites.find(item => item.id === product.id)) {
        return [...prevFavorites, product];
      }
      return prevFavorites;
    });
  }, [setFavorites]);

  // Remove product from favorites
  const removeFromFavorites = useCallback((productId) => {
    setFavorites(prevFavorites => 
      prevFavorites.filter(item => item.id !== productId)
    );
  }, [setFavorites]);

  // Toggle favorite status
  const toggleFavorite = useCallback((product) => {
    setFavorites(prevFavorites => {
      const isAlreadyFavorite = prevFavorites.find(item => item.id === product.id);
      
      if (isAlreadyFavorite) {
        return prevFavorites.filter(item => item.id !== product.id);
      } else {
        return [...prevFavorites, product];
      }
    });
  }, [setFavorites]);

  // Check if product is favorite
  const isFavorite = useCallback((productId) => {
    return favorites.some(item => item.id === productId);
  }, [favorites]);

  // Get favorites count
  const getFavoritesCount = useCallback(() => {
    return favorites.length;
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    getFavoritesCount,
    clearFavorites
  };
};

export default useFavorites;
