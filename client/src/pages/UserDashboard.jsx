import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, ListGroup } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import { ProfileInformation } from '../components/ui';
import { ChangePassword } from '../components/ui';
import { MyOrders } from '../components/ui';
import { Wishlist } from '../components/ui';
import { HelpCenter } from '../components/ui';
import './UserDashboard.css';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');

  // Handle tab from URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'password', 'orders', 'wishlist', 'help'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const dashboardTabs = [
    { key: 'profile', title: 'Profile', icon: '👤' },
    { key: 'password', title: 'Change Password', icon: '🔒' },
    { key: 'orders', title: 'All Orders', icon: '📦' },
    { key: 'wishlist', title: 'Wishlist', icon: '❤️' },
    { key: 'help', title: 'Help', icon: '❓' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInformation />;
      case 'password':
        return <ChangePassword />;
      case 'orders':
        return <MyOrders />;
      case 'wishlist':
        return <Wishlist />;
      case 'help':
        return <HelpCenter />;
      default:
        return <ProfileInformation />;
    }
  };

  return (
    <Container className="user-dashboard-container">
      <Row>
        <Col lg={3} md={4}>
          <Card className="dashboard-sidebar">
            <Card.Header className="sidebar-header">
              <Card.Title className="sidebar-title">My Account</Card.Title>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush" className="dashboard-nav">
                {dashboardTabs.map((tab) => (
                  <ListGroup.Item 
                    key={tab.key}
                    action
                    active={activeTab === tab.key}
                    onClick={() => handleTabChange(tab.key)}
                    className="dashboard-nav-link"
                  >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-text">{tab.title}</span>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="dashboard-nav-divider"></ListGroup.Item>
                <ListGroup.Item 
                  action
                  className="dashboard-nav-link logout-link"
                >
                  <span className="nav-icon">🚪</span>
                  <span className="nav-text">Logout</span>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={9} md={8}>
          <Card className="dashboard-content">
            <Card.Body>
              {renderTabContent()}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
