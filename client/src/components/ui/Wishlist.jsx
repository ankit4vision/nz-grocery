import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Card, Row, Col, Button, Container, Modal, Form, Badge, Alert, Nav, Tab } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeart, 
  faSpinner, 
  faPlus, 
  faEdit, 
  faTrash, 
  faShoppingCart,
  faExclamationCircle,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { CustomButton } from '../common';
import ProductCard from './ProductCard';
import { useCartContext } from '../../context';
import WishlistService from '../../services/api/wishlist';
import '../../styles/components/ui-components/wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addItem: addToCart } = useCartContext();
  
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [showWishlistModal, setShowWishlistModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wishlistToDelete, setWishlistToDelete] = useState(null);
  const [editingWishlist, setEditingWishlist] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    wishlist_name: '',
    is_public: false,
  });

  const [formErrors, setFormErrors] = useState({});

  // Refs to prevent duplicate API calls
  const loadingItemsRef = useRef(false);
  const lastLoadedWishlistIdRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  // Helper function to check if wishlist is default
  const isDefaultWishlist = useCallback((wishlist) => {
    return wishlist?.wishlist_name === 'My Wishlist';
  }, []);

  // Load wishlists on mount
  useEffect(() => {
    loadWishlists();
  }, []);

  // Load items when wishlist changes (with duplicate prevention)
  useEffect(() => {
    if (selectedWishlist && selectedWishlist.wishlist_id) {
      const wishlistId = selectedWishlist.wishlist_id;
      
      // Prevent duplicate calls
      if (loadingItemsRef.current || lastLoadedWishlistIdRef.current === wishlistId) {
        return;
      }
      
      lastLoadedWishlistIdRef.current = wishlistId;
      loadWishlistItems(wishlistId);
    }
  }, [selectedWishlist?.wishlist_id]); // Only depend on wishlist_id, not the whole object

  const loadWishlists = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await WishlistService.getWishlists();
      if (response.success) {
        const wishlistsData = Array.isArray(response.data) ? response.data : [];
        setWishlists(wishlistsData);
        
        // Select default wishlist or first wishlist (only on initial load)
        if (wishlistsData.length > 0) {
          const defaultWishlist = wishlistsData.find(w => w.wishlist_name === 'My Wishlist') || wishlistsData[0];
          // Only set selected wishlist if it's different or initial load
          if (isInitialLoadRef.current || !selectedWishlist || selectedWishlist.wishlist_id !== defaultWishlist.wishlist_id) {
            setSelectedWishlist(defaultWishlist);
            isInitialLoadRef.current = false;
          }
        } else {
          // No wishlists, get or create default
          const defaultResponse = await WishlistService.getDefaultWishlist();
          if (defaultResponse.success) {
            setWishlists([defaultResponse.data]);
            if (isInitialLoadRef.current || !selectedWishlist || selectedWishlist.wishlist_id !== defaultResponse.data.wishlist_id) {
              setSelectedWishlist(defaultResponse.data);
              isInitialLoadRef.current = false;
            }
          }
        }
      } else {
        setError(response.message || 'Failed to load wishlists');
      }
    } catch (err) {
      setError('An error occurred while loading wishlists');
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistItems = useCallback(async (wishlistId) => {
    // Prevent duplicate calls
    if (loadingItemsRef.current) {
      return;
    }
    
    loadingItemsRef.current = true;
    setItemsLoading(true);
    try {
      const response = await WishlistService.getWishlistDetails(wishlistId);
      if (response.success && response.data) {
        // Response contains wishlist with items array
        const items = response.data.items || [];
        setWishlistItems(items);
      } else {
        setWishlistItems([]);
      }
    } catch (err) {
      setWishlistItems([]);
    } finally {
      setItemsLoading(false);
      loadingItemsRef.current = false;
    }
  }, []);

  const handleOpenWishlistModal = useCallback((wishlist = null) => {
    // Prevent editing default wishlist
    if (wishlist && isDefaultWishlist(wishlist)) {
      setError('Default wishlist cannot be edited');
      setTimeout(() => setError(null), 3000);
      return;
    }
    
    if (wishlist) {
      setEditingWishlist(wishlist);
      setFormData({
        wishlist_name: wishlist.wishlist_name || '',
        is_public: wishlist.is_public || false,
      });
    } else {
      setEditingWishlist(null);
      setFormData({
        wishlist_name: '',
        is_public: false,
      });
    }
    setFormErrors({});
    setShowWishlistModal(true);
  }, [isDefaultWishlist]);

  const handleCloseWishlistModal = () => {
    setShowWishlistModal(false);
    setEditingWishlist(null);
    setFormData({
      wishlist_name: '',
      is_public: false,
    });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.wishlist_name.trim()) {
      errors.wishlist_name = 'Wishlist name is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitWishlist = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      let response;
      if (editingWishlist) {
        response = await WishlistService.updateWishlist(editingWishlist.wishlist_id, {
          wishlist_name: formData.wishlist_name.trim(),
          is_public: formData.is_public,
        });
      } else {
        response = await WishlistService.createWishlist({
          wishlist_name: formData.wishlist_name.trim() || 'My Wishlist',
          is_public: formData.is_public,
        });
      }

      if (response.success) {
        setSuccessMessage(editingWishlist ? 'Wishlist updated successfully!' : 'Wishlist created successfully!');
        handleCloseWishlistModal();
        await loadWishlists();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setFormErrors({ submit: response.message || 'Failed to save wishlist' });
      }
    } catch (err) {
      setFormErrors({ submit: 'An error occurred while saving wishlist' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteWishlist = async () => {
    if (!wishlistToDelete) return;

    // Prevent deleting default wishlist
    if (isDefaultWishlist(wishlistToDelete)) {
      setError('Default wishlist cannot be deleted');
      setShowDeleteModal(false);
      setWishlistToDelete(null);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const response = await WishlistService.deleteWishlist(wishlistToDelete.wishlist_id);
      if (response.success) {
        setSuccessMessage('Wishlist deleted successfully!');
        setShowDeleteModal(false);
        setWishlistToDelete(null);
        
        // If deleted wishlist was selected, select another one
        if (selectedWishlist?.wishlist_id === wishlistToDelete.wishlist_id) {
          const remainingWishlists = wishlists.filter(w => w.wishlist_id !== wishlistToDelete.wishlist_id);
          if (remainingWishlists.length > 0) {
            setSelectedWishlist(remainingWishlists[0]);
          } else {
            setSelectedWishlist(null);
            setWishlistItems([]);
          }
        }
        
        await loadWishlists();
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to delete wishlist');
      }
    } catch (err) {
      setError('An error occurred while deleting wishlist');
    }
  };

  const handleRemoveItem = useCallback(async (itemId) => {
    try {
      const response = await WishlistService.removeItem(itemId);
      if (response.success) {
        setSuccessMessage('Item removed from wishlist!');
        if (selectedWishlist) {
          // Reset ref to allow reload
          lastLoadedWishlistIdRef.current = null;
          await loadWishlistItems(selectedWishlist.wishlist_id);
        }
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError(response.message || 'Failed to remove item');
      }
    } catch (err) {
      setError('An error occurred while removing item');
    }
  }, [selectedWishlist, loadWishlistItems]);

  const handleMoveToCart = async (item) => {
    try {
      // Add to cart using product_id and variant_id
      if (item.product_id && item.variant_id) {
        const product = {
          productId: item.product_id,
          variantId: item.variant_id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          name: item.product_name || 'Product',
          unit: item.variant_value || '',
          currentPrice: item.discounted_sale_price || item.sale_price || item.base_price || 0,
          originalPrice: item.base_price || item.sale_price || 0,
          image: item.variant_image_url || item.product_image_url || '',
          rating: 0,
          reviews: 0,
          discount: item.discount_percentage || 0,
          category: '',
        };
        
        const result = await addToCart(product, 1);
        if (result.success) {
          setSuccessMessage('Item added to cart!');
          setTimeout(() => setSuccessMessage(''), 3000);
        } else {
          setError(result.message || 'Failed to add item to cart');
        }
      } else {
        setError('Product information is missing');
      }
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  const transformWishlistItemToProduct = (item) => {
    // Prioritize variant_name or variant_value as the main name
    const variantName = item.variant_name || item.variant_value || '';
    const productName = item.product_name || 'Product';
    
    // Determine current price: discounted_sale_price > sale_price
    const currentPrice = item.discounted_sale_price || item.sale_price || 0;
    // Original price: only show if there's a discount (discounted_sale_price exists, then sale_price is original)
    const originalPrice = item.discounted_sale_price && item.sale_price 
      ? item.sale_price 
      : null;
    
    return {
      id: item.product_id,
      variantId: item.variant_id,
      name: variantName || productName, // Use variant name as main name, fallback to product name
      productName: productName, // Product name for secondary display
      variantName: variantName, // Variant name for main title
      unit: item.variant_value || '',
      currentPrice: currentPrice,
      originalPrice: originalPrice,
      image: item.variant_image_url || item.product_image_url || '',
      rating: 0,
      reviews: 0,
      discount: item.discount_percentage || 0,
      isFavorite: true,
      category: '',
      stock: item.stock_quantity || 0,
      isActive: item.is_active !== false,
    };
  };

  if (loading) {
    return (
      <div className="wishlist">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-2x text-primary mb-3" />
            <p>Loading wishlists...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist">
      <div className="wishlist-header">
        <div className="header-content">
          <h2 className="wishlist-title">My Wishlists</h2>
          <p className="wishlist-subtitle">
            Manage your favorite products across multiple wishlists
          </p>
        </div>
        <CustomButton
          variant="success"
          onClick={() => handleOpenWishlistModal()}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Create Wishlist
        </CustomButton>
      </div>

      {successMessage && (
        <Alert variant="success" className="mb-4" dismissible onClose={() => setSuccessMessage('')}>
          <FontAwesomeIcon icon={faCheck} className="me-2" />
          {successMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError(null)}>
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
        </Alert>
      )}

      {wishlists.length === 0 ? (
        <Card className="empty-wishlist-card">
          <Card.Body className="text-center p-5">
            <div className="empty-wishlist-icon">
              <FontAwesomeIcon icon={faHeart} className="fa-3x text-muted" />
            </div>
            <h5 className="empty-wishlist-title">No Wishlists Yet</h5>
            <p className="empty-wishlist-text">
              Create your first wishlist to start saving your favorite products!
            </p>
            <CustomButton variant="success" size="lg" onClick={() => handleOpenWishlistModal()}>
              <FontAwesomeIcon icon={faPlus} className="me-2" />
              Create Wishlist
            </CustomButton>
          </Card.Body>
        </Card>
      ) : (
        <Tab.Container activeKey={selectedWishlist?.wishlist_id || wishlists[0]?.wishlist_id || null}>
          <div className="wishlist-tabs-container">
            {/* Wishlist Tabs - Horizontal at Top */}
            <Card className="wishlist-tabs-card mb-4">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Your Wishlists</h5>
                  <CustomButton
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleOpenWishlistModal()}
                  >
                    <FontAwesomeIcon icon={faPlus} className="me-1" />
                    New Wishlist
                  </CustomButton>
                </div>
                <Nav variant="pills" className="wishlist-tabs-nav">
                  {wishlists.map((wishlist) => {
                    const isDefault = isDefaultWishlist(wishlist);
                    return (
                      <Nav.Item key={wishlist.wishlist_id}>
                        <Nav.Link
                          eventKey={wishlist.wishlist_id}
                          active={selectedWishlist?.wishlist_id === wishlist.wishlist_id}
                          onClick={(e) => {
                            e.preventDefault();
                            // Only update if different wishlist
                            if (selectedWishlist?.wishlist_id !== wishlist.wishlist_id) {
                              lastLoadedWishlistIdRef.current = null; // Reset to allow reload
                              setSelectedWishlist(wishlist);
                            }
                          }}
                          className="wishlist-tab-link"
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span className="wishlist-tab-name">{wishlist.wishlist_name}</span>
                            {wishlist.is_public && (
                              <Badge bg="info" className="wishlist-tab-badge">Public</Badge>
                            )}
                            {isDefault && (
                              <Badge bg="secondary" className="wishlist-tab-badge">Default</Badge>
                            )}
                            {!isDefault && (
                              <div className="wishlist-tab-actions">
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-primary p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenWishlistModal(wishlist);
                                  }}
                                  title="Edit wishlist"
                                >
                                  <FontAwesomeIcon icon={faEdit} />
                                </Button>
                                <Button
                                  variant="link"
                                  size="sm"
                                  className="text-danger p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setWishlistToDelete(wishlist);
                                    setShowDeleteModal(true);
                                  }}
                                  title="Delete wishlist"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </Button>
                              </div>
                            )}
                          </div>
                        </Nav.Link>
                      </Nav.Item>
                    );
                  })}
                </Nav>
              </Card.Body>
            </Card>

            {/* Wishlist Content - Full Width */}
            <Tab.Content>
              {wishlists.map((wishlist) => (
                <Tab.Pane key={wishlist.wishlist_id} eventKey={wishlist.wishlist_id}>
                  <Card className="wishlist-content-card">
                    <Card.Header className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">{wishlist.wishlist_name}</h5>
                        <div className="mt-1">
                          {wishlist.is_public && (
                            <Badge bg="info" className="me-2">Public Wishlist</Badge>
                          )}
                          {isDefaultWishlist(wishlist) && (
                            <Badge bg="secondary">Default Wishlist</Badge>
                          )}
                        </div>
                      </div>
                      {!isDefaultWishlist(wishlist) && (
                        <div>
                          <CustomButton
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleOpenWishlistModal(wishlist)}
                            className="me-2"
                          >
                            <FontAwesomeIcon icon={faEdit} className="me-1" />
                            Edit
                          </CustomButton>
                        </div>
                      )}
                    </Card.Header>
                    <Card.Body>
                      {itemsLoading ? (
                        <div className="text-center py-5">
                          <FontAwesomeIcon icon={faSpinner} className="fa-spin fa-2x text-primary mb-3" />
                          <p>Loading items...</p>
                        </div>
                      ) : wishlistItems.length === 0 ? (
                        <div className="text-center py-5">
                          <FontAwesomeIcon icon={faHeart} className="fa-3x text-muted mb-3" />
                          <h5>This wishlist is empty</h5>
                          <p className="text-muted">Add products to this wishlist to see them here</p>
                          <CustomButton variant="success" onClick={() => navigate('/products')}>
                            Browse Products
                          </CustomButton>
                        </div>
                      ) : (
                        <Row>
                          {wishlistItems.map((item) => {
                            const product = transformWishlistItemToProduct(item);
                            return (
                              <Col key={item.wishlist_item_id} xs={12} sm={6} md={4} lg={4} xl={4} className="mb-4">
                                <div className="wishlist-item-wrapper">
                                  <ProductCard
                                    id={product.variantId || product.id}
                                    productId={product.id}
                                    variantId={product.variantId}
                                    name={product.name}
                                    unit={product.unit}
                                    currentPrice={product.currentPrice}
                                    originalPrice={product.originalPrice}
                                    image={product.image}
                                    rating={product.rating}
                                    reviews={product.reviews}
                                    discount={product.discount}
                                    isFavorite={true}
                                    category={product.category}
                                    onToggleFavorite={() => handleRemoveItem(item.wishlist_item_id)}
                                    onAddToCart={() => handleMoveToCart(item)}
                                    variant="listing"
                                    showDeleteIcon={true}
                                    skipWishlistCheck={true}
                                  />
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      )}
                    </Card.Body>
                  </Card>
                </Tab.Pane>
              ))}
            </Tab.Content>
          </div>
        </Tab.Container>
      )}

      {/* Create/Edit Wishlist Modal */}
      <Modal show={showWishlistModal} onHide={handleCloseWishlistModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingWishlist ? 'Edit Wishlist' : 'Create New Wishlist'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmitWishlist}>
          <Modal.Body>
            {formErrors.submit && (
              <Alert variant="danger" className="mb-3">
                <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
                {formErrors.submit}
              </Alert>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Wishlist Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                value={formData.wishlist_name}
                onChange={(e) => handleInputChange('wishlist_name', e.target.value)}
                placeholder="Enter wishlist name"
                isInvalid={!!formErrors.wishlist_name}
                required
              />
              {formErrors.wishlist_name && (
                <Form.Control.Feedback type="invalid">
                  {formErrors.wishlist_name}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Make this wishlist public"
                checked={formData.is_public}
                onChange={(e) => handleInputChange('is_public', e.target.checked)}
              />
              <Form.Text className="text-muted">
                Public wishlists can be shared with others
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseWishlistModal} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
                  Saving...
                </>
              ) : (
                editingWishlist ? 'Update Wishlist' : 'Create Wishlist'
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete <strong>{wishlistToDelete?.wishlist_name}</strong>?
          </p>
          <p className="text-muted">
            This will permanently delete the wishlist and all items in it. This action cannot be undone.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteWishlist}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Delete Wishlist
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Wishlist;
