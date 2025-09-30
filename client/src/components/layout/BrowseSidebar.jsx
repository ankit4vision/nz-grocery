import React, { useState } from 'react';
import { 
  Offcanvas, 
  Card, 
  ListGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { categoriesData, popularCardsData } from '../../data/mockData';
import './BrowseSidebar.css';

const BrowseSidebar = ({ show, onHide }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    // Navigate to products page with selected category
    navigate(`/products?category=${category.id}`);
    onHide(); // Close the sidebar
  };

  const handleCloseSidebar = () => {
    onHide();
  };

  // Use categories from mockData
  const categories = categoriesData;
  const popularCards = popularCardsData;

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
                        className="category-item"
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
    </div>
  );
};

export default BrowseSidebar;
