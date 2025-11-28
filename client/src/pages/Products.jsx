import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form, Alert, Spinner } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  AllCategories,
  ProductGrid,
  LoadMore
} from '../components';
import { useCartContext, useUserContext, useAuthModal } from '../context';
import { filterOptionsData } from '../data/mockData';
import ProductsService from '../services/api/products';
import CategoriesService from '../services/api/categories';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const { addItem } = useCartContext();
  const { isAuthenticated } = useUserContext();
  const { openLoginModal } = useAuthModal();
  
  // State management
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  // Products per page
  const productsPerPage = 36;

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load products when category or page changes
  useEffect(() => {
    loadProducts();
  }, [selectedCategory, currentPage]);

  // Initialize selected category from URL parameter
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Load categories
  const loadCategories = async () => {
    try {
      const response = await CategoriesService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      } else {
        setError(response.message || 'Failed to load categories');
      }
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error loading categories:', err);
    }
  };

  // Load products
  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: currentPage,
        page_size: productsPerPage,
      };

      // Add category filter if not 'all'
      if (selectedCategory !== 'all') {
        params.category_id = parseInt(selectedCategory);
      }

      const response = await ProductsService.getProductVariants(params);
      if (response.success && response.data) {
        // Transform API response to match component expectations
        const transformedProducts = transformProductVariants(response.data.items || []);
        
        // Append products if loading more pages, otherwise replace
        if (currentPage > 1) {
          setProducts(prev => [...prev, ...transformedProducts]);
        } else {
          setProducts(transformedProducts);
        }
        
        setPagination({
          page: response.data.page || currentPage,
          page_size: response.data.page_size || productsPerPage,
          total_count: response.data.total_count || 0,
          total_pages: response.data.total_pages || 1,
          has_next: response.data.has_next || false,
          has_previous: response.data.has_previous || false,
        });
      } else {
        setError(response.message || 'Failed to load products');
        setProducts([]);
      }
    } catch (err) {
      setError('Failed to load products');
      setProducts([]);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Transform product variants from API to component format
  const transformProductVariants = (variants) => {
    return variants.map((variant) => {
      const productName = variant.product_name || variant.name || 'Product';
      const variantName = variant.variant_name || '';
      
      // Create display name: "Product Name - Variant Name" or just "Product Name" if no variant
      const displayName = variantName 
        ? `${productName} - ${variantName}` 
        : productName;
      
      // Determine current price: discounted_sale_price > sale_price
      const currentPrice = variant.discounted_sale_price || variant.sale_price || 0;
      const originalPrice = variant.discounted_sale_price && variant.sale_price 
        ? variant.sale_price 
        : null;
      
      return {
        id: variant.variant_id || variant.id, // Keep variant_id as id for backward compatibility
        variantId: variant.variant_id || variant.id, // Explicit variant ID
        productId: variant.product_id, // Product ID for fetching full details
        name: displayName, // Display name: "Product Name - Variant Name"
        productName: productName, // Original product name
        variantName: variantName, // Variant name
        unit: variant.unit || null, // Unit (null if not provided, don't default to 'each')
        currentPrice: currentPrice,
        originalPrice: originalPrice,
        image: variant.image_url || variant.image || '/placeholder-image.jpg',
        rating: variant.rating || 0,
        reviews: variant.reviews_count || 0,
        discount: variant.discount_percentage || 0,
        category: variant.category_id,
        categoryName: variant.category_name || 'Uncategorized',
        stockQuantity: variant.stock_quantity || 0,
        sku: variant.sku,
        isActive: variant.is_active !== false,
        isFavorite: variant.is_wishlist === true, // Use is_wishlist from API response
      };
    });
  };

  // Create categories list with "All" option
  const categoriesWithAll = useMemo(() => {
    const allCategory = {
      id: 'all',
      name: 'All',
      icon: '🛒',
      description: 'All products',
      count: pagination?.total_count || 0
    };
    
    // Transform API categories to component format
    const transformedCategories = categories.map((cat) => ({
      id: cat.category_id?.toString() || cat.id?.toString(),
      name: cat.category_name || cat.name,
      icon: cat.icon || '📦',
      description: cat.category_description || cat.description || '',
      count: cat.product_count || 0,
      image: cat.category_image_url || cat.image || null,
      imageUrl: cat.category_image_url || cat.image_url || cat.image || null
    }));
    
    return [allCategory, ...transformedCategories];
  }, [categories, pagination]);

  // Get selected category name and product count
  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        name: 'All Products',
        count: pagination?.total_count || 0
      };
    }
    
    const category = categories.find(cat => 
      (cat.category_id?.toString() || cat.id?.toString()) === selectedCategory
    );
    if (category) {
      return {
        name: category.category_name || category.name,
        count: category.product_count || pagination?.total_count || 0
      };
    }
    
    return {
      name: 'Products',
      count: pagination?.total_count || 0
    };
  }, [selectedCategory, categories, pagination]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => parseFloat(a.currentPrice) - parseFloat(b.currentPrice));
      case 'price-high':
        return sorted.sort((a, b) => parseFloat(b.currentPrice) - parseFloat(a.currentPrice));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'newest':
        return sorted.sort((a, b) => b.id - a.id);
      default:
        return sorted;
    }
  }, [products, sortBy]);

  // Get breadcrumb data based on selected category
  const breadcrumbItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' }
      ];
    }
    
    const category = categories.find(cat => 
      (cat.category_id?.toString() || cat.id?.toString()) === selectedCategory
    );
    if (category) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: category.category_name || category.name, path: `/products/${selectedCategory}` }
      ];
    }
    
    return [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' }
    ];
  }, [selectedCategory, categories]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle sort changes
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // Note: Sorting is done client-side for now
    // In the future, this could be moved to server-side
  };

  // Handle load more
  const handleLoadMore = () => {
    if (pagination?.has_next) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    addItem(product, 1);
    console.log(`Added ${product.name} to cart`);
  };

  // Handle toggle favorite (ProductCard manages its own state, this is just for callback)
  const handleToggleFavorite = (productId, isFavorite) => {
    // ProductCard handles wishlist API calls internally
    // This callback can be used for additional UI updates if needed
    console.log('Toggle favorite:', productId, 'Is favorite:', isFavorite);
  };

  // Show loading state
  if (loading && products.length === 0) {
    return (
      <div className="products-page">
        <Container className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading products...</span>
          </Spinner>
        </Container>
      </div>
    );
  }

  // Show error state
  if (error && products.length === 0) {
    return (
      <div className="products-page">
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error Loading Products</Alert.Heading>
            <p>{error}</p>
            <button onClick={loadProducts} className="btn btn-primary">
              Try Again
            </button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* 1st Row: Breadcrumb */}
      <section className="products-breadcrumb-section">
    <Container>
          <Breadcrumb items={breadcrumbItems} className="products-breadcrumb" />
        </Container>
      </section>

      {/* 2nd Row: All Categories */}
      <section className="products-categories-section">
        <AllCategories
          categories={categoriesWithAll}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          className="products-all-categories"
        />
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

           {/* 3rd Row: Category Title and Sort */}
           <section className="products-title-sort-section">
             <Container>
               <Row className="align-items-center">
                 <Col md={8}>
                   <h2 className="selected-category-title">{selectedCategoryData.name}</h2>
                 </Col>
                 <Col md={4} className="text-md-end">
                   <Form.Select 
                     value={sortBy} 
                     onChange={(e) => handleSortChange(e.target.value)}
                     className="products-sort-select"
                     size="sm"
                   >
                     {filterOptionsData.sortBy?.map(option => (
                       <option key={option.value} value={option.value}>
                         {option.label}
                       </option>
                     ))}
                   </Form.Select>
                 </Col>
               </Row>
             </Container>
           </section>

      {/* 4th Row: Product Grid */}
      <section className="products-grid-section">
        <ProductGrid
          products={sortedProducts}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          className="products-grid"
        />
      </section>

      {/* 5th Row: Load More */}
      {pagination?.has_next && (
        <LoadMore
          onLoadMore={handleLoadMore}
          hasMore={pagination.has_next}
          text="Load More Products"
          size="lg"
          className="products-load-more"
        />
      )}
      
      {/* Loading indicator for pagination */}
      {loading && products.length > 0 && (
        <Container className="text-center py-3">
          <Spinner animation="border" size="sm" />
        </Container>
      )}
    </div>
  );
};

export default Products;
