import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
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
          <div className="dashboard-sidebar">
            <div className="sidebar-header">
              <h4 className="sidebar-title">My Account</h4>
            </div>
            <Nav className="flex-column dashboard-nav">
              {dashboardTabs.map((tab) => (
                <Nav.Item key={tab.key}>
                  <Nav.Link
                    className={`dashboard-nav-link ${activeTab === tab.key ? 'active' : ''}`}
                    onClick={() => handleTabChange(tab.key)}
                  >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-text">{tab.title}</span>
                  </Nav.Link>
                </Nav.Item>
              ))}
              <hr className="sidebar-divider" />
              <Nav.Item>
                <Nav.Link className="dashboard-nav-link logout-link">
                  <span className="nav-icon">🚪</span>
                  <span className="nav-text">Logout</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>
        <Col lg={9} md={8}>
          <div className="dashboard-content">
            {renderTabContent()}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;
