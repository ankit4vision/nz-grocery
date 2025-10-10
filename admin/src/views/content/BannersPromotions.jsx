import React, { useState } from 'react'
import { Row, Col, Form, Button, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faRedo, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import BannerFormModal from '../../components/pages/content/BannerFormModal'

const BannersPromotions = () => {
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')

  // Mock data for banners
  const [banners] = useState([
    {
      id: 1,
      title: '20% Off Grocery Delivery',
      type: 'Hero Section Banner',
      position: 'hero',
      status: 'active',
      createdDate: '2024-01-15',
      image: null,
      description: 'Special discount on grocery delivery service'
    },
    {
      id: 2,
      title: 'Fresh Organic Products',
      type: 'Sidebar Banner',
      position: 'sidebar',
      status: 'active',
      createdDate: '2024-01-14',
      image: null,
      description: 'Promoting fresh organic produce'
    },
    {
      id: 3,
      title: 'New Product Promotion',
      type: 'Footer Banner',
      position: 'footer',
      status: 'draft',
      createdDate: '2024-01-13',
      image: null,
      description: 'Introducing new product line'
    },
    {
      id: 4,
      title: 'Seasonal Sale',
      type: 'Hero Section Banner',
      position: 'hero',
      status: 'inactive',
      createdDate: '2024-01-12',
      image: null,
      description: 'Seasonal discount promotion'
    }
  ])

  const handleAddBanner = () => {
    setEditingBanner(null)
    setShowBannerModal(true)
  }

  const handleEditBanner = (banner) => {
    setEditingBanner(banner)
    setShowBannerModal(true)
  }

  const handleDeleteBanner = (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      console.log('Delete banner:', bannerId)
    }
  }

  const handleSearch = () => {
    console.log('Search:', { searchTerm, statusFilter, positionFilter })
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPositionFilter('all')
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', text: 'Active' },
      draft: { variant: 'warning', text: 'Draft' },
      inactive: { variant: 'danger', text: 'Inactive' }
    }
    const config = statusConfig[status] || statusConfig.inactive
    return <span className={`badge bg-${config.variant} text-white`}>{config.text}</span>
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         banner.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter
    const matchesPosition = positionFilter === 'all' || banner.position === positionFilter
    return matchesSearch && matchesStatus && matchesPosition
  })

  return (
    <>
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <h4 className="mb-0 text-success">Banners & Promotions</h4>
        <div className="ms-auto">
          <Button variant="success" onClick={handleAddBanner} className="text-white">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add Banner
          </Button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
          <h5 className="mb-0 text-dark">Search Banners</h5>
        </div>
        
        <Row className="g-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Banner title or description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search banners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2"
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">Position</Form.Label>
              <Form.Select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="border-2"
              >
                <option value="all">All Positions</option>
                <option value="hero">Hero Section</option>
                <option value="sidebar">Sidebar</option>
                <option value="footer">Footer</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        
        <div className="d-flex gap-2 mt-3">
          <Button variant="success" onClick={handleSearch} className="text-white">
            <FontAwesomeIcon icon={faSearch} className="me-2" />
            Search
          </Button>
          <Button variant="outline-secondary" onClick={handleReset}>
            <FontAwesomeIcon icon={faRedo} className="me-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Banners Grid */}
      <Row className="g-4">
        {filteredBanners.map((banner) => (
          <Col key={banner.id} md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm">
              {/* Banner Image Placeholder */}
              <div 
                className="bg-light border-bottom"
                style={{ height: '200px', background: 'linear-gradient(45deg, #f8f9fa 25%, transparent 25%), linear-gradient(-45deg, #f8f9fa 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8f9fa 75%), linear-gradient(-45deg, transparent 75%, #f8f9fa 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}
              >
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                  <div className="text-center">
                    <div className="fs-1 mb-2">🖼️</div>
                    <small>Banner Image</small>
                  </div>
                </div>
              </div>
              
              <Card.Body className="d-flex flex-column">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0">{banner.title}</h6>
                  {getStatusBadge(banner.status)}
                </div>
                
                <p className="text-muted small mb-2">{banner.type}</p>
                <p className="text-muted small mb-3">Created: {banner.createdDate}</p>
                
                <div className="mt-auto">
                  <div className="d-flex gap-2 justify-content-end">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEditBanner(banner)}
                      className="px-3"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="outline-info"
                      size="sm"
                      className="px-3"
                    >
                      <FontAwesomeIcon icon={faEye} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteBanner(banner.id)}
                      className="px-3"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredBanners.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No banners found matching your criteria.</p>
        </div>
      )}

      {/* Banner Form Modal */}
      <BannerFormModal
        show={showBannerModal}
        onHide={() => setShowBannerModal(false)}
        banner={editingBanner}
        onSave={(bannerData) => {
          console.log('Save banner:', bannerData)
          setShowBannerModal(false)
        }}
      />
    </>
  )
}

export default BannersPromotions
