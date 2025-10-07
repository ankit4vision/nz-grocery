import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faDollarSign, faCartShopping, faUserPlus, faChartLine, faCog, faBell, faShieldAlt, faArrowTrendUp, faArrowTrendDown } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { Table } from '../../components'
import MainChart from './MainChart'

const Dashboard = () => {
  const navigate = useNavigate()
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    activeUsers: 0
  })

  // Mock data - in real app, this would come from API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardStats({
        totalUsers: 1247,
        totalRevenue: 45678,
        totalOrders: 892,
        activeUsers: 856
      })
    }, 1000)
  }, [])

  const dashboardData = [
    {
      title: 'Total Users',
      value: dashboardStats.totalUsers.toLocaleString(),
      change: '+12%',
      changeType: 'positive',
      icon: faUsers,
      color: 'primary'
    },
    {
      title: 'Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: '+8%',
      changeType: 'positive',
      icon: faDollarSign,
      color: 'success'
    },
    {
      title: 'Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      change: '+15%',
      changeType: 'positive',
      icon: faCartShopping,
      color: 'info'
    },
    {
      title: 'Active Users',
      value: dashboardStats.activeUsers.toLocaleString(),
      change: '+5%',
      changeType: 'positive',
      icon: faUserPlus,
      color: 'warning'
    }
  ]

  // Recent activities data
  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new account', time: '2 minutes ago', type: 'user' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '5 minutes ago', type: 'profile' },
    { id: 3, user: 'Admin User', action: 'Deleted user account', time: '10 minutes ago', type: 'admin' },
    { id: 4, user: 'Mike Johnson', action: 'Changed password', time: '15 minutes ago', type: 'security' },
    { id: 5, user: 'Sarah Wilson', action: 'Uploaded document', time: '20 minutes ago', type: 'upload' }
  ]

  const activityColumns = [
    {
      key: 'user',
      label: 'User',
      render: (value) => (
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
            style={{ width: '32px', height: '32px', backgroundColor: '#6c757d' }}
          >
            {value.charAt(0)}
          </div>
          <span className="fw-semibold">{value}</span>
        </div>
      )
    },
    { key: 'action', label: 'Action', render: (value) => <span>{value}</span> },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <Badge bg={
          value === 'user' ? 'primary' : 
          value === 'profile' ? 'info' : 
          value === 'admin' ? 'danger' : 
          value === 'security' ? 'warning' : 'success'
        }>
          {value}
        </Badge>
      )
    },
    { key: 'time', label: 'Time', render: (value) => <span className="text-muted">{value}</span> }
  ]

  const quickActions = [
    { title: 'Add New User', description: 'Create a new user account', icon: faUsers, color: 'primary', onClick: () => navigate('/users/create') },
    { title: 'Manage Roles', description: 'Configure user roles and permissions', icon: faShieldAlt, color: 'warning', onClick: () => navigate('/roles') },
    { title: 'View Reports', description: 'Access analytics and reports', icon: faChartLine, color: 'info', onClick: () => navigate('/reports') },
    { title: 'System Settings', description: 'Configure system preferences', icon: faCog, color: 'secondary', onClick: () => navigate('/settings') }
  ]

  return (
    <Container fluid>
      {/* Welcome Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your system.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary">
            <FontAwesomeIcon icon={faBell} className="me-1" />
            Notifications
          </Button>
          <Button variant="primary">
            <FontAwesomeIcon icon={faCog} className="me-1" />
            Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {dashboardData.map((item, index) => (
          <Col md={3} key={`dashboard-card-${index}`}>
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-3 bg-${item.color} bg-opacity-10`}>
                      <FontAwesomeIcon icon={item.icon} size="xl" className={`text-${item.color}`} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="text-muted small fw-semibold">{item.title}</div>
                    <div className="h4 mb-0 fw-bold">{item.value}</div>
                    <div className={`small ${item.changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                      <FontAwesomeIcon icon={item.changeType === 'positive' ? faArrowTrendUp : faArrowTrendDown} className="me-1" />
                      {item.change} from last month
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="mb-4">
        {/* Analytics Chart */}
        <Col md={8}>
          <Card className="h-100">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">Analytics Overview</Card.Title>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm">7 Days</Button>
                  <Button variant="primary" size="sm">30 Days</Button>
                  <Button variant="outline-primary" size="sm">90 Days</Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <p className="text-muted mb-4">Performance metrics for the last 30 days</p>
              <MainChart />
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col md={4}>
          <Card className="h-100">
            <Card.Header>
              <Card.Title className="mb-0">Quick Actions</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={`quick-action-${index}`}
                    variant={`outline-${action.color}`}
                    className="d-flex align-items-center justify-content-start p-3"
                    onClick={action.onClick}
                  >
                    <FontAwesomeIcon icon={action.icon} className="me-3" />
                    <div className="text-start">
                      <div className="fw-semibold">{action.title}</div>
                      <small className="text-muted">{action.description}</small>
                    </div>
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Recent Activities */}
        <Col md={8}>
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">Recent Activities</Card.Title>
                <Button variant="outline-primary" size="sm">View All</Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table
                data={recentActivities}
                columns={activityColumns}
                hover
                small
                pagination={false}
                sortable={false}
              />
            </Card.Body>
          </Card>
        </Col>

        {/* System Status */}
        <Col md={4}>
          <Card>
            <Card.Header>
              <Card.Title className="mb-0">System Status</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>CPU Usage</span>
                  <span className="fw-semibold">45%</span>
                </div>
                <ProgressBar now={45} className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Memory Usage</span>
                  <span className="fw-semibold">67%</span>
                </div>
                <ProgressBar now={67} variant="warning" className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Disk Usage</span>
                  <span className="fw-semibold">23%</span>
                </div>
                <ProgressBar now={23} variant="success" className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Network</span>
                  <span className="fw-semibold">89%</span>
                </div>
                <ProgressBar now={89} variant="danger" className="mb-3" />
              </div>

              <div className="mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted">Server Status</span>
                  <Badge bg="success">Online</Badge>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <span className="text-muted">Last Backup</span>
                  <span className="small">2 hours ago</span>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <span className="text-muted">Uptime</span>
                  <span className="small">99.9%</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Dashboard
