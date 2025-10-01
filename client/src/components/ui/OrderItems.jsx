import React from 'react';
import { Table } from 'react-bootstrap';
import { ImageWithFallback } from '../common';
import '../../styles/components/ui-components/order-items.css';

/**
 * OrderItems - Component for displaying itemized product list in order details
 * 
 * @param {Array} items - Array of order items with product details
 * 
 * @example
 * <OrderItems 
 *   items={[
 *     {
 *       id: 1,
 *       name: "Fresh Organic Apples",
 *       image: "apple-image.jpg",
 *       quantity: 2,
 *       unit: "lb",
 *       price: 4.98
 *     }
 *   ]}
 * />
 */
const OrderItems = ({ items = [] }) => {
  const formatCurrency = (amount) => {
    return `$${Number(amount).toFixed(2)}`;
  };

  if (!items || items.length === 0) {
    return (
      <div className="order-items">
        <h3 className="section-title">Order Items</h3>
        <div className="no-items">
          <p>No items found in this order.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-items">
      <h3 className="section-title">Order Items</h3>
      
      <div className="items-table-container">
        <Table responsive className="items-table">
          <thead>
            <tr>
              <th className="item-header">Item</th>
              <th className="quantity-header">Quantity</th>
              <th className="price-header">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id || index} className="item-row">
                <td className="item-cell">
                  <div className="item-info">
                    <div className="item-image">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="product-image"
                        fallbackSrc="/placeholder.svg"
                      />
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-unit">x {item.unit || 'piece'}</div>
                    </div>
                  </div>
                </td>
                <td className="quantity-cell">
                  <div className="quantity-value">{item.quantity}</div>
                </td>
                <td className="price-cell">
                  <div className="price-value">{formatCurrency(item.price)}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default OrderItems;
