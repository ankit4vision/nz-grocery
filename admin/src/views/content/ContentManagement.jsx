import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileAlt, faCog, faClock, faRocket } from '@fortawesome/free-solid-svg-icons'

const ContentManagement = () => {
  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          {/* Page Header */}
          <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
            <h2 className="mb-0 text-dark">Content Management</h2>
          </div>

          {/* Main Content Container */}
          <div className="bg-white rounded-3 shadow-sm p-4">
            {/* Coming Soon Section */}
            <div className="text-center py-5">
              <div className="mb-4">
                <div className="d-inline-flex align-items-center justify-content-center mb-3 p-4 rounded-circle bg-light border border-success border-3" 
                     style={{ width: '120px', height: '120px' }}>
                  <FontAwesomeIcon icon={faFileAlt} className="text-success fs-1" />
                </div>
              </div>
              
              <h3 className="text-success mb-3 fw-bold">Content Management</h3>
              <p className="text-muted fs-5 mb-4">
                Manage your website content, pages, and media files
              </p>
              
              {/* Coming Soon Badge */}
              <div className="mb-4">
                <span className="badge bg-warning text-dark fs-6 px-3 py-2">
                  <FontAwesomeIcon icon={faClock} className="me-2" />
                  Coming Soon
                </span>
              </div>
              
              {/* Features Preview */}
              <div className="row justify-content-center mt-5">
                <div className="col-md-8">
                  <div className="bg-light rounded-3 p-4 border border-success border-2">
                    <h5 className="text-success mb-3">
                      <FontAwesomeIcon icon={faRocket} className="me-2" />
                      Planned Features
                    </h5>
                    <div className="row">
                      <div className="col-md-6">
                        <ul className="list-unstyled text-start">
                          <li className="mb-2">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-success" />
                            Home Banners
                          </li>
                          <li className="mb-2">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-success" />
                            Ads Banner
                          </li>
                          <li className="mb-2">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-success" />
                            FAQ Management
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-unstyled text-start">
                          <li className="mb-2">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-success" />
                            Notifications
                          </li>
                          <li className="mb-2">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-success" />
                            Page Management
                          </li>
                          <li className="mb-2">
                            <FontAwesomeIcon icon={faFileAlt} className="me-2 text-success" />
                            Media Library
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Development Status */}
              <div className="mt-4">
                <p className="text-muted small">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  This feature is currently under development and will be available soon.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default ContentManagement
