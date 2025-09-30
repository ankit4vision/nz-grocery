import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for making API calls with loading, error, and data states
 * 
 * @param {function} apiFunction - The API function to call
 * @param {any} dependencies - Dependencies array for useEffect
 * @param {boolean} immediate - Whether to call the API immediately
 * @returns {object} - { data, loading, error, refetch }
 * 
 * @example
 * const { data: products, loading, error, refetch } = useApi(
 *   () => fetchProducts(categoryId),
 *   [categoryId],
 *   true
 * );
 */
export const useApi = (apiFunction, dependencies = [], immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useApi;
