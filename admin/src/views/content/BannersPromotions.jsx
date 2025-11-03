import React, { useState, useEffect } from 'react'
import { Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch, faRedo, faEdit, faEye, faTrash } from '@fortawesome/free-solid-svg-icons'
import BannerFormModal from '../../components/pages/content/BannerFormModal'
import { bannerService } from '../../services/contentService'
import { useToast } from '../../components'

const BannersPromotions = () => {
  const { success, error: showError } = useToast()
  const [showBannerModal, setShowBannerModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [positionFilter, setPositionFilter] = useState('all')
  const [bannerTypeFilter, setBannerTypeFilter] = useState('all')

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    setLoading(true)
    try {
      const params = {}
      if (statusFilter !== 'all') {
        params.is_active = statusFilter === 'active'
      }
      if (positionFilter !== 'all') {
        params.position = positionFilter
      }
      if (bannerTypeFilter !== 'all') {
        params.banner_type = bannerTypeFilter
      }

      const response = await bannerService.getBanners(params)
      if (response.success) {
        setBanners(Array.isArray(response.data) ? response.data : [])
      } else {
        showError(response.message || 'Failed to load banners')
      }
    } catch (err) {
      showError('An error occurred while loading banners')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBanner = () => {
    setEditingBanner(null)
    setShowBannerModal(true)
  }

  const handleEditBanner = (banner) => {
    setEditingBanner(banner)
    setShowBannerModal(true)
  }

  const handleDeleteBanner = async (bannerId) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        const response = await bannerService.deleteBanner(bannerId)
        if (response.success) {
          success(response.message || 'Banner deleted successfully!')
          loadBanners()
        } else {
          showError(response.message || 'Failed to delete banner')
        }
      } catch (err) {
        showError('An error occurred while deleting banner')
      }
    }
  }

  const handleSaveBanner = async (bannerData) => {
    try {
      let response
      if (editingBanner) {
        // Update existing banner
        response = await bannerService.updateBanner(editingBanner.banner_id, bannerData)
      } else {
        // Create new banner
        response = await bannerService.createBanner(bannerData)
      }

      if (response.success) {
        success(response.message || (editingBanner ? 'Banner updated successfully!' : 'Banner created successfully!'))
        setShowBannerModal(false)
        loadBanners()
      } else {
        showError(response.message || `Failed to ${editingBanner ? 'update' : 'create'} banner`)
      }
    } catch (err) {
      showError(`An error occurred while ${editingBanner ? 'updating' : 'creating'} banner`)
    }
  }

  const handleSearch = () => {
    loadBanners()
  }

  const handleReset = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setPositionFilter('all')
    setBannerTypeFilter('all')
    loadBanners()
  }

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return <span className="badge bg-success text-white">Active</span>
    } else {
      return <span className="badge bg-danger text-white">Inactive</span>
    }
  }

  const filteredBanners = banners.filter(banner => {
    const matchesSearch = !searchTerm || 
                         (banner.banner_title && banner.banner_title.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (banner.banner_description && banner.banner_description.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
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
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold">Status</Form.Label>
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border-2"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold">Banner Type</Form.Label>
              <Form.Select
                value={bannerTypeFilter}
                onChange={(e) => setBannerTypeFilter(e.target.value)}
                className="border-2"
              >
                <option value="all">All Types</option>
                <option value="homepage">Homepage</option>
                <option value="category">Category</option>
                <option value="product">Product</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-semibold">Position</Form.Label>
              <Form.Control
                type="text"
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                className="border-2"
                placeholder="Filter by position"
              />
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
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted">Loading banners...</p>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {filteredBanners.map((banner) => (
              <Col key={banner.banner_id} md={6} lg={4}>
                <Card className="h-100 border-0 shadow-sm">
                  {/* Banner Image */}
                  <div 
                    className="border-bottom"
                    style={{ 
                      height: '200px', 
                      overflow: 'hidden',
                      backgroundColor: '#f8f9fa'
                    }}
                  >
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.banner_title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                        <div className="text-center">
                          <div className="fs-1 mb-2">🖼️</div>
                          <small>No Image</small>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <Card.Body className="d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="fw-bold mb-0">{banner.banner_title}</h6>
                      {getStatusBadge(banner.is_active)}
                    </div>
                    
                    <p className="text-muted small mb-2">
                      Type: {banner.banner_type} {banner.position && `| Position: ${banner.position}`}
                    </p>
                    {banner.banner_description && (
                      <p className="text-muted small mb-2">{banner.banner_description}</p>
                    )}
                    
                    <div className="mt-auto">
                      <div className="d-flex gap-2 justify-content-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditBanner(banner)}
                          className="px-3"
                          title="Edit Banner"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteBanner(banner.banner_id)}
                          className="px-3"
                          title="Delete Banner"
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

          {filteredBanners.length === 0 && !loading && (
            <div className="text-center py-5">
              <p className="text-muted">No banners found matching your criteria.</p>
            </div>
          )}
        </>
      )}

      {/* Banner Form Modal */}
      <BannerFormModal
        show={showBannerModal}
        onHide={() => {
          setShowBannerModal(false)
          setEditingBanner(null)
        }}
        banner={editingBanner}
        onSave={handleSaveBanner}
      />
    </>
  )
}

export default BannersPromotions
