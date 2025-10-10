import React, { useState } from 'react'
import { Row, Col, Button, Card, Collapse } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faChevronUp, faChevronDown, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import FAQFormModal from '../../components/pages/content/FAQFormModal'

const FAQManagement = () => {
  const [showFAQModal, setShowFAQModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState(null)
  const [expandedFAQs, setExpandedFAQs] = useState(new Set())

  // Mock data for FAQs
  const [faqs] = useState([
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can pay using various payment methods including credit cards, PayPal, or cash on delivery.',
      createdDate: '2024-01-15',
      updatedDate: '2024-01-15'
    },
    {
      id: 2,
      question: 'What are your delivery times?',
      answer: 'We offer same-day delivery for orders placed before 2 PM. Standard delivery takes 1-2 business days. Express delivery is available for an additional fee.',
      createdDate: '2024-01-14',
      updatedDate: '2024-01-14'
    },
    {
      id: 3,
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and viewing the order status, or by using the tracking number sent to your email.',
      createdDate: '2024-01-13',
      updatedDate: '2024-01-13'
    },
    {
      id: 4,
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Fresh produce and perishable items have a 7-day return window. Items must be in original condition.',
      createdDate: '2024-01-12',
      updatedDate: '2024-01-12'
    },
    {
      id: 5,
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer special pricing for bulk orders. Contact our sales team for custom pricing based on your requirements.',
      createdDate: '2024-01-11',
      updatedDate: '2024-01-11'
    },
    {
      id: 6,
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team via phone, email, or live chat. Our support hours are Monday to Friday, 9 AM to 6 PM.',
      createdDate: '2024-01-10',
      updatedDate: '2024-01-10'
    }
  ])

  const handleAddFAQ = () => {
    setEditingFAQ(null)
    setShowFAQModal(true)
  }

  const handleEditFAQ = (faq) => {
    setEditingFAQ(faq)
    setShowFAQModal(true)
  }

  const handleDeleteFAQ = (faqId) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      console.log('Delete FAQ:', faqId)
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
      <Row className="g-4">
        {faqs.map((faq) => (
          <Col key={faq.id} xs={12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-2 text-dark">{faq.question}</h6>
                    <Collapse in={expandedFAQs.has(faq.id)}>
                      <div>
                        <p className="text-muted mb-3">{faq.answer}</p>
                        <div className="d-flex gap-3 text-muted small">
                          <span>Created: {faq.createdDate}</span>
                          <span>Updated: {faq.updatedDate}</span>
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
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                      className="px-3"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => toggleFAQ(faq.id)}
                      className="px-3"
                    >
                      <FontAwesomeIcon 
                        icon={expandedFAQs.has(faq.id) ? faChevronUp : faChevronDown} 
                      />
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {faqs.length === 0 && (
        <div className="text-center py-5">
          <p className="text-muted">No FAQs found. Click "Add FAQ" to create your first FAQ.</p>
        </div>
      )}

      {/* FAQ Form Modal */}
      <FAQFormModal
        show={showFAQModal}
        onHide={() => setShowFAQModal(false)}
        faq={editingFAQ}
        onSave={(faqData) => {
          console.log('Save FAQ:', faqData)
          setShowFAQModal(false)
        }}
      />
    </>
  )
}

export default FAQManagement
