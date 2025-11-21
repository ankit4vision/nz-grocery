import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Accordion, Alert } from 'react-bootstrap';
import { CustomButton } from '../common';
import { Loader } from '../common';
import FAQService from '../../services/api/faq';
import '../../styles/components/ui-components/help-center.css';

const HelpCenter = () => {
  const [activeAccordion, setActiveAccordion] = useState('');
  const [faqEntries, setFaqEntries] = useState([]);
  const [faqCategories, setFaqCategories] = useState([]);
  const [groupedFAQs, setGroupedFAQs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch FAQ entries and categories
  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch FAQ entries and categories in parallel
      const [entriesResponse, categoriesResponse] = await Promise.all([
        FAQService.getFAQEntries({ is_active: true }),
        FAQService.getFAQCategories({ is_active: true })
      ]);

      if (entriesResponse.success && categoriesResponse.success) {
        const entries = entriesResponse.data || [];
        const categories = categoriesResponse.data || [];

        setFaqEntries(entries);
        setFaqCategories(categories);

        // Group entries by category_id
        const grouped = groupEntriesByCategory(entries, categories);
        setGroupedFAQs(grouped);
      } else {
        setError(entriesResponse.message || categoriesResponse.message || 'Failed to load FAQs');
      }
    } catch (err) {
      setError('An error occurred while loading FAQs. Please try again later.');
      console.error('Error loading FAQs:', err);
    } finally {
      setLoading(false);
    }
  };

  // Group FAQ entries by category_id
  const groupEntriesByCategory = (entries, categories) => {
    // Create a map of category_id to category details
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.category_id] = {
        category_id: category.category_id,
        category_name: category.category_name,
        sort_order: category.sort_order || 0,
      };
    });

    // Group entries by category_id
    const grouped = {};
    entries.forEach(entry => {
      const categoryId = entry.category_id;
      if (!grouped[categoryId]) {
        grouped[categoryId] = {
          category: categoryMap[categoryId] || {
            category_id: categoryId,
            category_name: `Category ${categoryId}`,
            sort_order: 0,
          },
          entries: [],
        };
      }
      grouped[categoryId].entries.push(entry);
    });

    // Convert to array and sort by sort_order, then by category_id
    const groupedArray = Object.values(grouped).map(group => ({
      ...group,
      entries: group.entries.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    }));

    // Sort categories by sort_order, then by category_id
    groupedArray.sort((a, b) => {
      if (a.category.sort_order !== b.category.sort_order) {
        return (a.category.sort_order || 0) - (b.category.sort_order || 0);
      }
      return a.category.category_id - b.category.category_id;
    });

    return groupedArray;
  };

  const handleContactSupport = () => {
    console.log('Contact support clicked');
    // Navigate to contact page or open contact modal
  };

  const handleSendEmail = () => {
    console.log('Send email clicked');
    // Open email client or contact form
  };

  // Generate colors for categories (fallback if no color in API)
  const getCategoryColor = (index) => {
    const colors = ['#dc3545', '#007bff', '#28a745', '#ffc107', '#17a2b8', '#6f42c1', '#e83e8c'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="help-center">
        <div className="help-header">
          <h2 className="help-title">Help Center</h2>
          <p className="help-subtitle">Find answers to frequently asked questions</p>
        </div>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="help-center">
        <div className="help-header">
          <h2 className="help-title">Help Center</h2>
          <p className="help-subtitle">Find answers to frequently asked questions</p>
        </div>
        <Alert variant="danger" className="mt-4">
          <Alert.Heading>Error Loading FAQs</Alert.Heading>
          <p>{error}</p>
          <CustomButton
            variant="outline-danger"
            onClick={loadFAQs}
          >
            Try Again
          </CustomButton>
        </Alert>
      </div>
    );
  }

  return (
    <div className="help-center">
      <div className="help-header">
        <h2 className="help-title">Help Center</h2>
        <p className="help-subtitle">Find answers to frequently asked questions</p>
      </div>

      {groupedFAQs.length === 0 ? (
        <Alert variant="info" className="mt-4">
          <Alert.Heading>No FAQs Available</Alert.Heading>
          <p>There are no frequently asked questions available at the moment. Please check back later or contact support for assistance.</p>
        </Alert>
      ) : (
        <Row className="faq-categories">
          {groupedFAQs.map((group, categoryIndex) => {
            const categoryColor = getCategoryColor(categoryIndex);
            
            return (
              <Col key={group.category.category_id} xs={12} className="mb-4">
                <Card 
                  className="faq-category-card"
                  style={{ borderLeftColor: categoryColor }}
                >
                  <Card.Body>
                    <div className="category-header">
                      <h5 className="category-title">{group.category.category_name}</h5>
                    </div>
                    
                    <Accordion 
                      activeKey={activeAccordion}
                      onSelect={(eventKey) => setActiveAccordion(eventKey)}
                    >
                      {group.entries.map((faq, index) => (
                        <Accordion.Item 
                          key={faq.faq_id} 
                          eventKey={`${group.category.category_id}-${faq.faq_id}`}
                        >
                          <Accordion.Header className="faq-question">
                            {faq.question}
                          </Accordion.Header>
                          <Accordion.Body className="faq-answer">
                            {faq.answer}
                          </Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Card className="help-contact-card">
        <Card.Body className="text-center">
          <div className="contact-content">
            <h3 className="contact-title">Need More Help?</h3>
            <p className="contact-text">
              Can't find what you're looking for? Our support team is here to help!
            </p>
            <div className="contact-actions">
              <CustomButton
                variant="outline-success"
                size="lg"
                onClick={handleContactSupport}
                className="contact-btn"
              >
                <i className="fas fa-headset me-2"></i>
                Contact Support
              </CustomButton>
              <CustomButton
                variant="success"
                size="lg"
                onClick={handleSendEmail}
                className="contact-btn"
              >
                <i className="fas fa-envelope me-2"></i>
                Send Email
              </CustomButton>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HelpCenter;
