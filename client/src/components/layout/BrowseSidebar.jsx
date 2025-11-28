import React, { useState, useEffect } from 'react';
import { 
  Offcanvas, 
  Card, 
  ListGroup,
  Spinner
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { popularCardsData } from '../../data/mockData';
import CategoriesService from '../../services/api/categories';
import '../../styles/components/layout-elements/browse-sidebar.css';

const BrowseSidebar = ({ show, onHide }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await CategoriesService.getCategories();
      if (response.success && response.data) {
        // Transform API categories to component format
        const transformedCategories = response.data.map((cat) => ({
          id: cat.category_id?.toString() || cat.id?.toString(),
          name: cat.category_name || cat.name,
          icon: cat.icon || '📦',
          description: cat.category_description || cat.description || '',
          image: cat.category_image_url || cat.image || null,
          imageUrl: cat.category_image_url || cat.image_url || cat.image || null
        }));
        setCategories(transformedCategories);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    // Navigate to products page with selected category
    navigate(`/products?category=${category.id}`);
    onHide(); // Close the sidebar
  };

  const handleCloseSidebar = () => {
    onHide();
  };

  // Create categories list with "All" option
  const categoriesWithAll = [
    {
      id: 'all',
      name: 'All',
      icon: '🛒',
      description: 'All products'
    },
    ...categories
  ];
  // const popularCards = popularCardsData; // Hidden for now

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
        {/* Popular & Suggested Section - Hidden for now */}
        {/* <div className="popular-section">
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
        </div> */}

                {/* Shop by Category Section */}
                <div className="category-section">
                  <h6 className="section-title">Shop by Category</h6>
                  {loading ? (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </div>
                  ) : (
                    <ListGroup variant="flush" className="category-list">
                      {categoriesWithAll.map((category) => (
                        <ListGroup.Item 
                          key={category.id}
                          action
                          className="category-item"
                          onClick={() => handleCategoryClick(category)}
                        >
                          <div className="category-content">
                            <span className="category-icon">
                              {category.image || category.imageUrl ? (
                                <img 
                                  src={category.image || category.imageUrl} 
                                  alt={category.name}
                                  className="category-icon-image"
                                  onError={(e) => {
                                    // Fallback to icon if image fails to load
                                    e.target.style.display = 'none';
                                    const iconSpan = e.target.parentElement.querySelector('.category-icon-emoji');
                                    if (iconSpan) {
                                      iconSpan.style.display = 'inline';
                                    }
                                  }}
                                />
                              ) : null}
                              <span 
                                className="category-icon-emoji"
                                style={{ display: (category.image || category.imageUrl) ? 'none' : 'inline' }}
                              >
                                {category.icon}
                              </span>
                            </span>
                            <span className="category-name">{category.name}</span>
                            <span className="category-arrow">▶</span>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </div>
      </Offcanvas.Body>
    </Offcanvas>
    </div>
  );
};

export default BrowseSidebar;
