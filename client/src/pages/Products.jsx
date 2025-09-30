import React, { useState, useEffect, useMemo } from 'react';
import { Container } from 'react-bootstrap';
import { 
  Breadcrumb, 
  AllCategories,
  SelectedCategoryName,
  ProductFilters, 
  ProductGrid, 
  Pagination 
} from '../components';
import { 
  productCategoriesData, 
  productsListingData, 
  filterOptionsData, 
  breadcrumbData 
} from '../data/mockData';
import './Products.css';

const Products = () => {
  // State management
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    sortBy: 'relevance',
    bestUnitPrice: false,
    inStock: false,
    specials: false,
    soldBy: 'all',
    brand: 'all',
    allergens: 'none',
    dietary: 'all',
    healthRating: 'all'
  });
  const [favorites, setFavorites] = useState(new Set());

  // Products per page
  const productsPerPage = 20;

  // Get selected category name and product count
  const selectedCategoryData = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        name: 'All Products',
        count: productsListingData.length
      };
    }
    
    const category = productCategoriesData.find(cat => cat.id === selectedCategory);
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

      // Stock filter
      if (filters.inStock && !product.inStock) {
        return false;
      }

      // Specials filter
      if (filters.specials && product.discount <= 0) {
        return false;
      }

      // Sold by filter
      if (filters.soldBy !== 'all' && product.soldBy !== filters.soldBy) {
        return false;
      }

      // Brand filter
      if (filters.brand !== 'all' && product.brand !== filters.brand) {
        return false;
      }

      // Allergens filter
      if (filters.allergens !== 'none' && !product.allergens.includes(filters.allergens)) {
        return false;
      }

      // Dietary filter
      if (filters.dietary !== 'all' && !product.dietary.includes(filters.dietary)) {
        return false;
      }

      // Health rating filter
      if (filters.healthRating !== 'all' && product.healthRating < parseInt(filters.healthRating)) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return parseFloat(a.currentPrice) - parseFloat(b.currentPrice);
        case 'price-high':
          return parseFloat(b.currentPrice) - parseFloat(a.currentPrice);
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
          return b.id - a.id;
        default: // relevance
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, filters]);

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
    
    return breadcrumbData[selectedCategory] || [
      { label: 'Home', path: '/' },
      { label: 'Products', path: '/products' },
      { label: selectedCategoryData.name, path: `/products/${selectedCategory}` }
    ];
  }, [selectedCategory, selectedCategoryData.name]);

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page when category changes
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle sort changes
  const handleSortChange = (sortValue) => {
    setFilters(prev => ({ ...prev, sortBy: sortValue }));
    setCurrentPage(1); // Reset to first page when sort changes
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
          categories={productCategoriesData}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
          className="products-all-categories"
        />
      </section>

      {/* 3rd Row: Selected Category Name */}
      <section className="products-category-name-section">
        <SelectedCategoryName
          categoryName={selectedCategoryData.name}
          productCount={selectedCategoryData.count}
          className="products-selected-category"
        />
      </section>

      {/* 4th Row: Filters */}
      <section className="products-filters-section">
        <ProductFilters
          filterOptions={filterOptionsData}
          currentFilters={filters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          className="products-filters"
        />
      </section>

      {/* 5th Row: Product Grid */}
      <section className="products-grid-section">
        <ProductGrid
          products={productsWithFavorites}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          className="products-grid"
        />
      </section>

      {/* 6th Row: Pagination */}
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
