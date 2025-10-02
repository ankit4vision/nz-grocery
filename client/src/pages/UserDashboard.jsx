import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Nav, Card, ListGroup } from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProfileInformation } from '../components/ui';
import { ChangePassword } from '../components/ui';
import { MyOrders } from '../components/ui';
import { Wishlist } from '../components/ui';
import { HelpCenter } from '../components/ui';
import { useUserContext } from '../context';
import './UserDashboard.css';

const UserDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('profile');
  const { user, isAuthenticated, isLoading, logout } = useUserContext();
  const navigate = useNavigate();

  // Handle tab from URL parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'password', 'orders', 'wishlist', 'help'].includes(tab)) {
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
    { key: 'orders', title: 'All Orders', icon: '📦' },
    { key: 'wishlist', title: 'Wishlist', icon: '❤️' },
    { key: 'help', title: 'Help', icon: '❓' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileInformation user={user} />;
      case 'password':
        return <ChangePassword user={user} />;
      case 'orders':
        return <MyOrders user={user} />;
      case 'wishlist':
        return <Wishlist user={user} />;
      case 'help':
        return <HelpCenter user={user} />;
      default:
        return <ProfileInformation user={user} />;
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
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
                    alt="Demo User"
                    className="avatar-image"
                  />
                </div>
                <div className="user-info">
                  <h5 className="user-name">
                    {user ? `${user.firstName} ${user.lastName}` : 'User'}
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
