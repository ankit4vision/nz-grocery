import React, { useState } from 'react';
import { 
  Offcanvas, 
  Card, 
  ListGroup, 
  Button
} from 'react-bootstrap';
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

  const handleSubcategoryClick = (subcategory) => {
    console.log(`Selected subcategory: ${subcategory}`);
    // Here you can add navigation logic or API calls
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
        </div>
        
        <div className="subcategory-content">
          <ListGroup variant="flush" className="subcategory-list">
            {selectedSubcategory.subcategories.map((subcategory, index) => {
              // Get appropriate icon for each subcategory
              const getSubcategoryIcon = (subcategory) => {
                const iconMap = {
                  // Fruit & Veg
                  'Fresh Fruits': '🍎',
                  'Fresh Vegetables': '🥕',
                  'Organic Produce': '🌱',
                  'Frozen Fruits & Veg': '🧊',
                  
                  // Poultry, Meat & Seafood
                  'Fresh Chicken': '🐔',
                  'Beef & Lamb': '🥩',
                  'Fresh Fish': '🐟',
                  'Frozen Seafood': '🦐',
                  
                  // Religious Items
                  'Prayer Items': '📿',
                  'Religious Books': '📖',
                  'Temple Items': '🕯️',
                  
                  // Indian Sweets
                  'Traditional Sweets': '🍯',
                  'Festival Sweets': '🎂',
                  'Dry Fruits': '🥜',
                  
                  // Dairy, Eggs & Fridge
                  'Milk & Cream': '🥛',
                  'Cheese': '🧀',
                  'Eggs': '🥚',
                  'Yogurt': '🍶',
                  
                  // Philippine Groceries
                  'Filipino Foods': '🍜',
                  'Spices': '🌶️',
                  'Canned Goods': '🥫',
                  
                  // South Indian Groceries
                  'Rice & Grains': '🍚',
                  'Spices': '🌶️',
                  'Coconut Products': '🥥',
                  
                  // Sri Lankan Groceries
                  'Ceylon Tea': '🍵',
                  'Spices': '🌶️',
                  'Traditional Foods': '🍛',
                  
                  // Snacks & Beverages
                  'Chips & Crackers': '🍿',
                  'Soft Drinks': '🥤',
                  'Energy Drinks': '⚡',
                  
                  // Pantry & Staples
                  'Rice & Grains': '🍚',
                  'Cooking Oils': '🫒',
                  'Spices': '🌶️',
                  
                  // Dietary Preferences
                  'Gluten Free': '🌾',
                  'Organic': '🌿',
                  'Vegan': '🥗',
                  'Keto': '🥑'
                };
                return iconMap[subcategory] || '📦';
              };

              return (
                <ListGroup.Item 
                  key={index}
                  className="subcategory-item"
                  action
                  onClick={() => handleSubcategoryClick(subcategory)}
                >
                  <div className="subcategory-item-content">
                    <span className="subcategory-item-icon">{getSubcategoryIcon(subcategory)}</span>
                    <span className="subcategory-item-name">{subcategory}</span>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        </div>
      </div>
    )}
    </div>
  );
};

export default BrowseSidebar;
