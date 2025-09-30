import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import {
  Breadcrumb,
  AllCategories,
  ProductGrid,
  Pagination
} from '../components';
import {
  categoriesData,
  productsListingData
} from '../data/mockData';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState(new Set());

  // Products per page
  const productsPerPage = 20;

  // Initialize selected category from URL parameter
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categoriesData.find(cat => cat.id === categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [searchParams]);

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

    return filtered;
  }, [selectedCategory]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of products section
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          categories={categoriesData}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          className="products-all-categories"
        />
      </section>

      {/* Divider */}
      <div className="section-divider"></div>

           {/* 3rd Row: Selected Category Name */}
           <section className="products-category-name-section">
             <Container>
            <Row>
                 <Col>
                   <div className="selected-category-content">
                     <h2 className="selected-category-title">{selectedCategoryData.name}</h2>
                </div>
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

      {/* 5th Row: Pagination */}
      <section className="products-pagination-section">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="products-pagination"
        />
      </section>
    </div>
  );
};

export default Products;
