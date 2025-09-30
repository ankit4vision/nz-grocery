import React, { useState } from 'react';
import { 
  Offcanvas, 
  Card, 
  ListGroup, 
  Button
} from 'react-bootstrap';
import { ImageWithFallback } from '../common';
import './BrowseSidebar.css';

const BrowseSidebar = ({ show, onHide }) => {
  const [activeCategory, setActiveCategory] = useState('fruit-veg');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSubcategoryPanel, setShowSubcategoryPanel] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category.id);
    setSelectedSubcategory(category);
    setShowSubcategoryPanel(true);
  };

  const handleProductClick = (product) => {
    console.log(`Selected product: ${product.name}`);
    // Here you can add navigation logic or API calls
  };

  // Product data for each category
  const getCategoryProducts = (categoryId) => {
    const productsData = {
      'fruit-veg': [
        { id: 1, name: 'Fresh Apples', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=100&h=100&fit=crop' },
        { id: 2, name: 'Organic Bananas', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop' },
        { id: 3, name: 'Fresh Carrots', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=100&h=100&fit=crop' },
        { id: 4, name: 'Organic Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=100&h=100&fit=crop' }
      ],
      'poultry-meat': [
        { id: 5, name: 'Fresh Chicken Breast', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&h=100&fit=crop' },
        { id: 6, name: 'Premium Beef', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=100&h=100&fit=crop' },
        { id: 7, name: 'Fresh Salmon', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a8b67?w=100&h=100&fit=crop' }
      ],
      'dairy': [
        { id: 8, name: 'Fresh Milk', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop' },
        { id: 9, name: 'Cheddar Cheese', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&h=100&fit=crop' },
        { id: 10, name: 'Free Range Eggs', image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d8?w=100&h=100&fit=crop' }
      ],
      'snacks': [
        { id: 11, name: 'Potato Chips', image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=100&h=100&fit=crop' },
        { id: 12, name: 'Soft Drink', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=100&h=100&fit=crop' }
      ],
      'religious': [
        { id: 13, name: 'Prayer Beads', image: 'https://images.unsplash.com/photo-1544376664-80b17f09d399?w=100&h=100&fit=crop' },
        { id: 14, name: 'Religious Books', image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop' }
      ],
      'indian-sweets': [
        { id: 15, name: 'Traditional Sweets', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=100&h=100&fit=crop' },
        { id: 16, name: 'Dry Fruits', image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=100&h=100&fit=crop' }
      ]
    };
    
    return productsData[categoryId] || [];
  };

  const handleBackToCategories = () => {
    setShowSubcategoryPanel(false);
    setSelectedSubcategory(null);
  };

  // Reset sidebar state when closing
  const handleCloseSidebar = () => {
    setShowSubcategoryPanel(false);
    setSelectedSubcategory(null);
    setActiveCategory('fruit-veg');
    onHide();
  };

  const categories = [
    {
      id: 'fruit-veg',
      name: 'Fruit & Veg',
      icon: '🥬',
      subcategories: ['Fresh Fruits', 'Fresh Vegetables', 'Organic Produce', 'Frozen Fruits & Veg']
    },
    {
      id: 'poultry-meat',
      name: 'Poultry, Meat & Seafood',
      icon: '🥩',
      subcategories: ['Fresh Chicken', 'Beef & Lamb', 'Fresh Fish', 'Frozen Seafood']
    },
    {
      id: 'religious',
      name: 'Religious Items',
      icon: '🕉️',
      subcategories: ['Prayer Items', 'Religious Books', 'Temple Items']
    },
    {
      id: 'indian-sweets',
      name: 'Indian Sweets',
      icon: '🍯',
      subcategories: ['Traditional Sweets', 'Festival Sweets', 'Dry Fruits']
    },
    {
      id: 'dairy',
      name: 'Dairy, Eggs & Fridge',
      icon: '🥛',
      subcategories: ['Milk & Cream', 'Cheese', 'Eggs', 'Yogurt']
    },
    {
      id: 'philippine',
      name: 'Philippine Groceries',
      icon: '🍜',
      subcategories: ['Filipino Foods', 'Spices', 'Canned Goods']
    },
    {
      id: 'south-indian',
      name: 'South Indian Groceries',
      icon: '🍚',
      subcategories: ['Rice & Grains', 'Spices', 'Coconut Products']
    },
    {
      id: 'sri-lankan',
      name: 'Sri Lankan Groceries',
      icon: '🍵',
      subcategories: ['Ceylon Tea', 'Spices', 'Traditional Foods']
    },
    {
      id: 'snacks',
      name: 'Snacks & Beverages',
      icon: '🥤',
      subcategories: ['Chips & Crackers', 'Soft Drinks', 'Energy Drinks']
    },
    {
      id: 'pantry',
      name: 'Pantry & Staples',
      icon: '🫒',
      subcategories: ['Rice & Grains', 'Cooking Oils', 'Spices']
    },
    {
      id: 'dietary',
      name: 'Dietary Preferences',
      icon: '🥗',
      subcategories: ['Gluten Free', 'Organic', 'Vegan', 'Keto']
    }
  ];

  const popularCards = [
    {
      title: 'Try this',
      subtitle: 'Whole body deodorants',
      color: 'success',
      icon: '🧴'
    },
    {
      title: 'Lower Shelf Price',
      subtitle: 'Family essentials',
      color: 'danger',
      icon: '💰'
    },
    {
      title: '1/2 Price',
      subtitle: 'Snacking & treats',
      color: 'warning',
      icon: '🍪'
    },
    {
      title: 'Winter Wine',
      subtitle: 'Under $15',
      color: 'info',
      icon: '🍷'
    }
  ];

  return (
    <div className="sidebar-container">
      <Offcanvas 
        show={show} 
        onHide={handleCloseSidebar}
        placement="start"
        className="browse-sidebar"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="sidebar-title">
            Browse products
          </Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body className="sidebar-body">
        {/* Popular & Suggested Section */}
        <div className="popular-section">
          <h6 className="section-title">Popular & Suggested</h6>
          <div className="popular-cards">
            {popularCards.map((card, index) => (
              <Card key={index} className={`popular-card bg-${card.color}`}>
                <Card.Body className="text-white">
                  <div className="card-icon">{card.icon}</div>
                  <Card.Title className="card-title">{card.title}</Card.Title>
                  <Card.Text className="card-subtitle">{card.subtitle}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>

                {/* Shop by Category Section */}
                <div className="category-section">
                  <h6 className="section-title">Shop by Category</h6>
                  <ListGroup variant="flush" className="category-list">
                    {categories.map((category) => (
                      <ListGroup.Item 
                        key={category.id}
                        action
                        className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                      >
                        <div className="category-content">
                          <span className="category-icon">{category.icon}</span>
                          <span className="category-name">{category.name}</span>
                          <span className="category-arrow">▶</span>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
      </Offcanvas.Body>
    </Offcanvas>

    {/* Horizontal Subcategory Panel */}
    {showSubcategoryPanel && selectedSubcategory && (
      <div className="subcategory-panel">
        <div className="subcategory-header">
          <h6 className="subcategory-title">
            {selectedSubcategory.icon} {selectedSubcategory.name}
          </h6>
          <Button 
            variant="success" 
            size="sm" 
            className="subcategory-view-all"
            onClick={() => console.log(`View all ${selectedSubcategory.name} products`)}
          >
            View All
          </Button>
        </div>
        
        <div className="subcategory-content">
          <ListGroup variant="flush" className="subcategory-list">
            {getCategoryProducts(selectedSubcategory?.id).map((product) => (
              <ListGroup.Item 
                key={product.id}
                className="subcategory-item"
                action
                onClick={() => handleProductClick(product)}
              >
                <div className="subcategory-item-content">
                  <div className="subcategory-item-image">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="subcategory-item-image-element"
                    />
                  </div>
                  <span className="subcategory-item-name">{product.name}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    )}
    </div>
  );
};

export default BrowseSidebar;
