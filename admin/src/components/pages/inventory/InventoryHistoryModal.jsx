import React, { useState, useEffect } from 'react'
import { Modal, Button, Row, Col, Card, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faTimes, 
  faDownload, 
  faPlus, 
  faMinus, 
  faExclamationTriangle,
  faClock,
  faUser,
  faFileAlt
} from '@fortawesome/free-solid-svg-icons'
import inventoryService from '../../../services/inventoryService'

const InventoryHistoryModal = ({ show, onHide, variant }) => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (show && variant) {
      loadHistory()
    }
  }, [show, variant])

  const loadHistory = async () => {
    if (!variant) return
    
    try {
      setLoading(true)
      const result = await inventoryService.getInventoryHistory(variant.variant_id)
      if (result.success) {
        setHistory(result.data || [])
      }
    } catch (error) {
      console.error('Error loading inventory history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getHistoryTypeIcon = (type) => {
    switch (type) {
      case 'stock_increase':
        return <FontAwesomeIcon icon={faPlus} className="text-success" />
      case 'order_fulfillment':
        return <FontAwesomeIcon icon={faMinus} className="text-danger" />
      case 'stock_adjustment':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="text-warning" />
      default:
        return <FontAwesomeIcon icon={faFileAlt} className="text-info" />
    }
  }

  const getHistoryTypeColor = (type) => {
    switch (type) {
      case 'stock_increase':
        return 'success'
      case 'order_fulfillment':
        return 'danger'
      case 'stock_adjustment':
        return 'warning'
      default:
        return 'info'
    }
  }

  const getHistoryTypeLabel = (type) => {
    switch (type) {
      case 'stock_increase':
        return 'Stock Increase'
      case 'order_fulfillment':
        return 'Order Fulfillment'
      case 'stock_adjustment':
        return 'Stock Adjustment'
      default:
        return 'Other'
    }
  }

  const formatChange = (change) => {
    return change > 0 ? `+${change}` : `${change}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleExportHistory = () => {
    if (!variant || !history.length) return

    // Create CSV content
    const csvContent = [
      ['Date', 'Type', 'Change', 'Description', 'User', 'Reference'],
      ...history.map(item => [
        formatDate(item.timestamp),
        getHistoryTypeLabel(item.type),
        formatChange(item.change),
        item.description,
        item.user,
        item.reference || ''
      ])
    ].map(row => row.join(',')).join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-history-${variant.sku || variant.variant_id}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!variant) return null

  return (
    <Modal show={show} onHide={onHide} size="lg" centered="true">
      <Modal.Header closeButton>
        <Modal.Title>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faClock} className="me-2 text-success" />
            Inventory History - {variant.product_name} {variant.variant_name ? `(${variant.variant_name})` : ''}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Product Summary */}
        <Card className="mb-4 bg-light">
          <Card.Body>
            <Row>
              <Col md={6}>
                <div className="d-flex align-items-center">
                  <div className="bg-white rounded me-3 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                    <FontAwesomeIcon icon={faFileAlt} className="text-muted" size="2x" />
                  </div>
                  <div>
                    <h5 className="mb-1">{variant.product_name || 'N/A'}</h5>
                    <p className="mb-1 text-muted">Variant: {variant.variant_name || 'Default'}</p>
                    {variant.sku && (
                      <p className="mb-1 text-muted">SKU: {variant.sku}</p>
                    )}
                    {variant.category_name && (
                      <Badge bg="success">{variant.category_name}</Badge>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="text-end">
                  <div className="mb-2">
                    <strong>Current Stock:</strong> {variant.stock_quantity || 0} units
                  </div>
                  <div className="mb-2">
                    <strong>Low Stock Threshold:</strong> {variant.low_stock_quantity || 0} units
                  </div>
                  <div>
                    <strong>Variant ID:</strong> {variant.variant_id}
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* History Timeline */}
        <div className="position-relative">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : history.length > 0 ? (
            history.map((item, index) => (
              <div key={item.id} className="mb-3">
                <Card className="border-0 shadow-sm">
                  <Card.Body className="py-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center me-3"
                          style={{ 
                            width: '32px', 
                            height: '32px', 
                            backgroundColor: `var(--bs-${getHistoryTypeColor(item.type)})`,
                            color: 'white'
                          }}
                        >
                          {getHistoryTypeIcon(item.type)}
                        </div>
                        <div>
                          <div className="d-flex align-items-center mb-1">
                            <Badge bg={getHistoryTypeColor(item.type)} className="me-2">
                              {getHistoryTypeLabel(item.type)}
                            </Badge>
                          </div>
                          <p className="mb-0 text-muted small">{item.description}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <div className={`text-${getHistoryTypeColor(item.type)} fw-bold mb-1`}>
                          {formatChange(item.change)} units
                        </div>
                        <small className="text-muted">
                          {formatDate(item.timestamp)}
                        </small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <FontAwesomeIcon icon={faClock} className="text-muted mb-3" size="3x" />
              <h5 className="text-muted">No History Available</h5>
              <p className="text-muted">No inventory changes have been recorded for this variant.</p>
            </div>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {history.length > 0 && (
          <Button variant="success" onClick={handleExportHistory} className="text-white">
            <FontAwesomeIcon icon={faDownload} className="me-2" />
            Export History
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  )
}

export default InventoryHistoryModal
