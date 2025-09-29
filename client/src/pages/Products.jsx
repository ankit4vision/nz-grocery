import React, { useState } from 'react';
import { Container, Row, Col, Badge, Form } from 'react-bootstrap';
import { CustomButton, DataTable, ModalDialog, ConfirmDialog } from '../components';
import './Products.css';

const Products = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Sample product data
  const products = [
    { id: 1, name: 'Fresh Apples', category: 'Fruits', price: 4.99, stock: 50, image: '🍎' },
    { id: 2, name: 'Organic Bananas', category: 'Fruits', price: 3.49, stock: 30, image: '🍌' },
    { id: 3, name: 'Fresh Carrots', category: 'Vegetables', price: 2.99, stock: 25, image: '🥕' },
    { id: 4, name: 'Premium Milk', category: 'Dairy', price: 5.99, stock: 40, image: '🥛' },
    { id: 5, name: 'Whole Wheat Bread', category: 'Bakery', price: 3.99, stock: 20, image: '🍞' },
    { id: 6, name: 'Free Range Eggs', category: 'Dairy', price: 6.99, stock: 35, image: '🥚' },
  ];

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleAddToCart = () => {
    setShowConfirm(true);
  };

  const handleConfirmAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', selectedProduct);
    setShowConfirm(false);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const columns = [
    {
      key: 'product',
      title: 'Product',
      render: (item) => (
        <div className="products-table-product">
          <span className="products-table-icon">{item.image}</span>
          {item.name}
        </div>
      )
    },
    { key: 'category', title: 'Category' },
    { 
      key: 'price', 
      title: 'Price',
      render: (item) => (
        <span className="products-table-price">${item.price}</span>
      )
    },
    { 
      key: 'stock', 
      title: 'Stock',
      render: (item) => (
        <Badge bg={item.stock > 20 ? 'success' : 'warning'}>
          {item.stock}
        </Badge>
      )
    },
    { 
      key: 'actions', 
      title: 'Actions',
      render: (item) => (
        <CustomButton 
          variant="outline-primary" 
          size="sm"
          onClick={() => handleViewProduct(item)}
        >
          View
        </CustomButton>
      )
    }
  ];

  return (
    <Container>
      <Row className="products-header">
        <Col>
          <h1 className="products-title">Our Products</h1>
          <p className="products-subtitle">
            Discover our wide range of fresh and quality grocery items
          </p>
        </Col>
      </Row>

      {/* Products Table */}
      <Row>
        <Col>
          <DataTable
            columns={columns}
            data={products}
            variant="primary"
            hover={true}
            striped={true}
          />
        </Col>
      </Row>

      {/* Product Detail Modal */}
      <ModalDialog
        show={showModal}
        onHide={handleCloseModal}
        title={selectedProduct ? `${selectedProduct.image} ${selectedProduct.name}` : ''}
        size="md"
      >
        {selectedProduct && (
          <>
            <Row>
              <Col md={6}>
                <div className="products-modal-icon">{selectedProduct.image}</div>
              </Col>
              <Col md={6}>
                <div className="products-modal-details">
                  <h5>Product Details</h5>
                  <p><strong>Category:</strong> {selectedProduct.category}</p>
                  <p><strong>Price:</strong> <span className="products-modal-price">${selectedProduct.price}</span></p>
                  <p><strong>Stock:</strong> <Badge bg={selectedProduct.stock > 20 ? 'success' : 'warning'}>{selectedProduct.stock} units</Badge></p>
                </div>
              </Col>
            </Row>
            <hr />
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control type="number" min="1" max={selectedProduct.stock} defaultValue="1" />
              </Form.Group>
            </Form>
            <div className="d-flex gap-2">
              <CustomButton variant="secondary" onClick={handleCloseModal}>
                Close
              </CustomButton>
              <CustomButton variant="primary" onClick={handleAddToCart}>
                Add to Cart
              </CustomButton>
            </div>
          </>
        )}
      </ModalDialog>

      {/* Confirm Dialog */}
      <ConfirmDialog
        show={showConfirm}
        onHide={() => setShowConfirm(false)}
        onConfirm={handleConfirmAddToCart}
        title="Add to Cart"
        message={`Are you sure you want to add "${selectedProduct?.name}" to your cart?`}
        confirmText="Add to Cart"
        cancelText="Cancel"
        variant="primary"
      />
    </Container>
  );
};

export default Products;
