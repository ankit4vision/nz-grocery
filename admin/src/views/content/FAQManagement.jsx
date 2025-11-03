import React, { useState, useEffect } from 'react'
import { Row, Col, Button, Card, Collapse, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faChevronUp, faChevronDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import FAQFormModal from '../../components/pages/content/FAQFormModal'
import { faqService } from '../../services/contentService'
import { useToast } from '../../components'

const FAQManagement = () => {
  const { success, error: showError } = useToast()
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedFAQs, setExpandedFAQs] = useState(new Set())

  useEffect(() => {
    loadFAQs()
  }, [])

  const loadFAQs = async () => {
    setLoading(true)
    try {
      const response = await faqService.getFAQs()
      if (response.success) {
        setFaqs(Array.isArray(response.data) ? response.data : [])
      } else {
        showError(response.message || 'Failed to load FAQs')
      }
    } catch (err) {
      showError('An error occurred while loading FAQs')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFAQ = () => {
    setEditingFAQ(null)
    setShowFAQModal(true)
  }

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq)
    setShowFAQModal(true)
  }

  const handleDeleteFAQ = async (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      try {
        const response = await faqService.deleteFAQ(faqId)
        if (response.success) {
          success(response.message || 'FAQ deleted successfully!')
          loadFAQs()
        } else {
          showError(response.message || 'Failed to delete FAQ')
        }
      } catch (err) {
        showError('An error occurred while deleting FAQ')
      }
    }
  }

  const handleSaveFAQ = async (faqData) => {
    try {
      let response
      if (editingFAQ) {
        // Update existing FAQ
        response = await faqService.updateFAQ(editingFAQ.faq_id, faqData)
      } else {
        // Create new FAQ
        response = await faqService.createFAQ(faqData)
      }

      if (response.success) {
        success(response.message || (editingFAQ ? 'FAQ updated successfully!' : 'FAQ created successfully!'))
        setShowFAQModal(false)
        loadFAQs()
      } else {
        showError(response.message || `Failed to ${editingFAQ ? 'update' : 'create'} FAQ`)
      }
    } catch (err) {
      showError(`An error occurred while ${editingFAQ ? 'updating' : 'creating'} FAQ`)
    }
  }

  const toggleFAQ = (faqId) => {
    const newExpanded = new Set(expandedFAQs)
    if (newExpanded.has(faqId)) {
      newExpanded.delete(faqId)
    } else {
      newExpanded.add(faqId)
    }
    setExpandedFAQs(newExpanded)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    } catch {
      return dateString
    }
  }

  return (
    <>
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <h4 className="mb-0 text-success">FAQ Management</h4>
        <div className="ms-auto">
          <Button variant="success" onClick={handleAddFAQ} className="text-white">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="success" />
          <p className="mt-3 text-muted">Loading FAQs...</p>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {faqs.map((faq) => (
              <Col key={faq.faq_id} xs={12}>
                <Card className="border-0 shadow-sm">
                  <Card.Body>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h6 className="fw-bold mb-0 text-dark">{faq.question}</h6>
                          {faq.is_active ? (
                            <span className="badge bg-success text-white">Active</span>
                          ) : (
                            <span className="badge bg-secondary text-white">Inactive</span>
                          )}
                        </div>
                        <Collapse in={expandedFAQs.has(faq.faq_id)}>
                          <div>
                            <p className="text-muted mb-3">{faq.answer}</p>
                            <div className="d-flex gap-3 text-muted small">
                              {faq.created_at && <span>Created: {formatDate(faq.created_at)}</span>}
                              <span>Category ID: {faq.category_id}</span>
                              {faq.sort_order !== undefined && <span>Order: {faq.sort_order}</span>}
                            </div>
                          </div>
                        </Collapse>
                      </div>
                      
                      <div className="d-flex align-items-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditFAQ(faq)}
                          className="px-3"
                          title="Edit FAQ"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteFAQ(faq.faq_id)}
                          className="px-3"
                          title="Delete FAQ"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => toggleFAQ(faq.faq_id)}
                          className="px-3"
                          title={expandedFAQs.has(faq.faq_id) ? 'Collapse' : 'Expand'}
                        >
                          <FontAwesomeIcon 
                            icon={expandedFAQs.has(faq.faq_id) ? faChevronUp : faChevronDown} 
                          />
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {faqs.length === 0 && !loading && (
            <div className="text-center py-5">
              <p className="text-muted">No FAQs found. Click "Add FAQ" to create your first FAQ.</p>
            </div>
          )}
        </>
      )}

      {/* FAQ Form Modal */}
      <FAQFormModal
        show={showFAQModal}
        onHide={() => {
          setShowFAQModal(false)
          setEditingFAQ(null)
        }}
        faq={editingFAQ}
        onSave={handleSaveFAQ}
      />
    </>
  )
}

export default FAQManagement
