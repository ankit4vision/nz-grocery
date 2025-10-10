# Inventory Management Module

## Overview
The Inventory Management module provides comprehensive stock tracking, adjustment capabilities, and historical reporting for the NZ Grocery Admin system.

## Components

### 1. InventoryManagement.jsx
Main inventory management view component that displays:
- **Summary Cards**: Total products, stock units, low stock items, out of stock items
- **Alert Banners**: Low stock and expiry warnings
- **Search & Filters**: Product name/SKU search, category, status, and dietary filters
- **Bulk Actions**: Select multiple products for bulk operations
- **Inventory Table**: Detailed view of all products with stock information
- **Actions**: View history, edit, and view details for each product

### 2. InventoryHistoryModal.jsx
Modal component for viewing detailed inventory history:
- **Product Summary**: Current stock information and product details
- **Timeline View**: Chronological history of stock changes
- **History Types**: Stock increases, order fulfillments, and adjustments
- **Export Functionality**: Download history as CSV

### 3. StockAdjustmentForm.jsx
Form component for making stock adjustments:
- **Adjustment Types**: Stock adjustment, increase, damage removal, expiry removal
- **Validation**: Ensures valid changes and required fields
- **Preview**: Shows impact of changes before submission
- **Reason Tracking**: Categorized reasons for adjustments

## Features

### Stock Management
- Real-time stock tracking
- Low stock alerts
- Expiry date monitoring
- Reserved vs available stock calculation

### History Tracking
- Complete audit trail of all stock changes
- User attribution for changes
- Reference number tracking
- Timestamp recording

### Bulk Operations
- Multi-select functionality
- Bulk status updates
- Bulk low stock alert adjustments
- Export selected items

### Search & Filtering
- Product name and SKU search
- Category filtering
- Status filtering (In Stock, Low Stock, Out of Stock)
- Dietary information filtering

## Data Structure

### Inventory Item
```javascript
{
  id: number,
  productId: number,
  productName: string,
  productImage: string,
  sku: string,
  category: string,
  currentStock: number,
  reserved: number,
  available: number,
  lowStockAlert: number,
  expiryDate: string,
  status: 'in_stock' | 'low_stock' | 'out_of_stock',
  stockStatus: string,
  dietaryInfo: string,
  lastUpdated: string,
  history: HistoryEntry[]
}
```

### History Entry
```javascript
{
  id: number,
  type: 'stock_increase' | 'order_fulfillment' | 'stock_adjustment',
  change: number,
  description: string,
  timestamp: string,
  user: string,
  reference: string
}
```

## Service Layer

### inventoryService.js
Provides API methods for:
- `getInventoryItems(filters)` - Get filtered inventory list
- `getInventoryItemById(id)` - Get specific inventory item
- `getInventoryStats()` - Get summary statistics
- `updateInventoryItem(id, data)` - Update inventory item
- `bulkUpdateInventory(ids, data)` - Bulk update multiple items
- `addInventoryHistory(productId, entry)` - Add history entry
- `getInventoryHistory(productId)` - Get product history
- `exportInventory(filters)` - Export inventory data

## Usage

### Navigation
The inventory management module is accessible through:
- **Main Menu**: Product Management → Inventory Management
- **Direct Route**: `/inventory`
- **Stock Adjustments**: `/inventory/adjustments`

### Key Actions
1. **View Inventory**: Browse all products with current stock levels
2. **Search Products**: Use filters to find specific products
3. **View History**: Click history icon to see stock change timeline
4. **Make Adjustments**: Use edit button to adjust stock levels
5. **Bulk Operations**: Select multiple items for batch updates
6. **Export Data**: Download inventory data as CSV

## Integration

### Dependencies
- React Bootstrap for UI components
- FontAwesome for icons
- Custom service layer for API calls
- Mock data for development

### Styling
Follows the project's design guidelines:
- Green theme colors (#16a34a)
- Bootstrap classes with custom enhancements
- Consistent spacing and typography
- Responsive design patterns

## Future Enhancements
- Real-time stock updates via WebSocket
- Barcode scanning integration
- Automated reorder point notifications
- Supplier integration for stock receipts
- Advanced reporting and analytics
- Mobile-responsive adjustments
