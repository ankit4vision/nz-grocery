import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, ListGroup } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProfileInformation } from '../components/ui';
import { ChangePassword } from '../components/ui';
import { AddressManagement } from '../components/ui';
import { MyOrders } from '../components/ui';
import { Wishlist } from '../components/ui';
import { HelpCenter } from '../components/ui';
import { useUserContext } from '../context';
import { usePageTitle } from '../hooks';
import './UserDashboard.css';

const UserDashboard = () => {
  // Set page title and SEO
  usePageTitle(
    'My Account',
    'Manage your Farm2Fridge account. Update profile, view orders, manage addresses, and track your wishlist.'
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isAuthenticated, isLoading, logout } = useUserContext();
  const navigate = useNavigate();

  // Handle tab from URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'password', 'addresses', 'orders', 'wishlist', 'help'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // Redirect to login if not authenticated (only after loading is complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardTabs = [
    { key: 'profile', title: 'Profile', icon: '👤' },
    { key: 'password', title: 'Change Password', icon: '🔒' },
    { key: 'addresses', title: 'Addresses', icon: '📍' },
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
      case 'addresses':
        return <AddressManagement />;
      case 'orders':
        return <MyOrders user={user} />;
      case 'wishlist':
        return <Wishlist user={user} />;
      case 'help':
        return <HelpCenter user={user} />;
      default:
        return <ProfileInformation />;
    }
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Container className="user-dashboard-container">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading dashboard...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="user-dashboard-container">
      <Row>
        <Col lg={3} md={4}>
          <Card className="dashboard-sidebar">
            <Card.Header className="sidebar-header">
              <div className="account-header">
                <div className="user-avatar">
                  {user?.profile_image_url ? (
                    <img 
                      src={user.profile_image_url} 
                      alt={user ? `${user.first_name || user.firstName} ${user.last_name || user.lastName}` : 'User'}
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {user ? (user.first_name || user.firstName || user.email || 'U').charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <h5 className="user-name">
                    {user ? `${user.first_name || user.firstName || ''} ${user.last_name || user.lastName || ''}`.trim() || 'User' : 'User'}
                  </h5>
                  <p className="user-email">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
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
                  onClick={handleLogout}
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
