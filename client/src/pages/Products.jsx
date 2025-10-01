import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  AllCategories,
  ProductGrid,
  LoadMore
} from '../components';
import {
  categoriesData,
  productsListingData,
  filterOptionsData
} from '../data/mockData';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(new Set());
  const [sortBy, setSortBy] = useState('relevance');
  const [visibleProducts, setVisibleProducts] = useState(12);

  // Products per load
  const productsPerLoad = 6;

  // Initialize selected category from URL parameter
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoriesData.find(cat => cat.id === categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

  // Create categories list with "All" option
  const categoriesWithAll = useMemo(() => {
    const allCategory = {
      id: 'all',
      name: 'All',
      icon: '🛒',
      description: 'All products',
      count: productsListingData.length
    };
    return [allCategory, ...categoriesData];
  }, []);

  // Get selected category name and product count
  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        name: 'All Products',
        count: productsListingData.length
      };
    }
    
    const category = categoriesData.find(cat => cat.id === selectedCategory);
    if (category) {
      const categoryProducts = productsListingData.filter(product => product.category === selectedCategory);
      return {
        name: category.name,
        count: categoryProducts.length
      };
    }
    
    return {
      name: 'Products',
      count: 0
    };
  }, [selectedCategory]);

  // Filter and sort products based on current filters and category
  const filteredProducts = useMemo(() => {
    let filtered = productsListingData.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return parseFloat(a.currentPrice) - parseFloat(b.currentPrice);
        case 'price-high':
          return parseFloat(b.currentPrice) - parseFloat(a.currentPrice);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return b.id - a.id;
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, sortBy]);

  // Calculate visible products
  const currentProducts = filteredProducts.slice(0, visibleProducts);
  const hasMoreProducts = visibleProducts < filteredProducts.length;

  // Get breadcrumb data based on selected category
  const breadcrumbItems = useMemo(() => {
    if (selectedCategory === 'all') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' }
      ];
    }
    
    const category = categoriesData.find(cat => cat.id === selectedCategory);
    if (category) {
      return [
        { label: 'Home', path: '/' },
        { label: 'Products', path: '/products' },
        { label: category.name, path: `/products/${selectedCategory}` }
      ];
    }
    
    return [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' }
    ];
  }, [selectedCategory]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setVisibleProducts(12); // Reset visible products when category changes
  };

  // Handle sort changes
  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setVisibleProducts(12); // Reset visible products when sort changes
  };

  // Handle load more
  const handleLoadMore = () => {
    setVisibleProducts(prev => prev + productsPerLoad);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    console.log('Added to cart:', product);
    // TODO: Implement cart functionality
  };

  // Handle toggle favorite
  const handleToggleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Update products with favorite status
  const productsWithFavorites = currentProducts.map(product => ({
    ...product,
    isFavorite: favorites.has(product.id)
  }));

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
          products={productsWithFavorites}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          className="products-grid"
        />
      </section>

      {/* 5th Row: Load More */}
      <LoadMore
        onLoadMore={handleLoadMore}
        hasMore={hasMoreProducts}
        text="Load More Products"
        size="lg"
        className="products-load-more"
      />
    </div>
  );
};

export default Products;
