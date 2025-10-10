import React, { useState } from 'react'
import { Container, Row, Col, Nav, Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import BannersPromotions from './BannersPromotions'
import FAQManagement from './FAQManagement'
import Notifications from './Notifications'

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('banners')

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <FontAwesomeIcon icon={faEdit} className="me-3 text-success fs-4" />
            <h2 className="mb-0 text-dark">Content Management</h2>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Tab Navigation */}
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <Nav variant="tabs" className="border-0 mb-4">
                <Nav.Item>
                  <Nav.Link 
                    eventKey="banners" 
                    className={`border-0 px-4 py-3 ${activeTab === 'banners' ? 'text-success border-bottom border-success border-2 bg-transparent' : 'text-muted'}`}
                  >
                    Banners & Promotions
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="faq" 
                    className={`border-0 px-4 py-3 ${activeTab === 'faq' ? 'text-success border-bottom border-success border-2 bg-transparent' : 'text-muted'}`}
                  >
                    FAQ Management
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link 
                    eventKey="notifications" 
                    className={`border-0 px-4 py-3 ${activeTab === 'notifications' ? 'text-success border-bottom border-success border-2 bg-transparent' : 'text-muted'}`}
                  >
                    Notifications
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {/* Tab Content */}
              <Tab.Content>
                <Tab.Pane eventKey="banners">
                  <BannersPromotions />
                </Tab.Pane>
                <Tab.Pane eventKey="faq">
                  <FAQManagement />
                </Tab.Pane>
                <Tab.Pane eventKey="notifications">
                  <Notifications />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ContentManagement
