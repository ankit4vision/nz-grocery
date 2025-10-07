import React, { useState, useEffect } from 'react'
import { CCol, CRow, CCard, CCardHeader, CCardBody, CCardTitle, CButton, CBadge, CProgress } from '@coreui/react'
import { cilPeople, cilDollar, cilCart, cilUserPlus, cilChartLine, cilSettings, cilBell, cilShieldAlt } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useNavigate } from 'react-router-dom'
import { Card, Table } from '../../components'
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
      icon: cilPeople,
      variant: 'primary',
      color: 'primary'
    },
    {
      title: 'Revenue',
      value: `$${dashboardStats.totalRevenue.toLocaleString()}`,
      change: '+8%',
      changeType: 'positive',
      icon: cilDollar,
      variant: 'success',
      color: 'success'
    },
    {
      title: 'Orders',
      value: dashboardStats.totalOrders.toLocaleString(),
      change: '+15%',
      changeType: 'positive',
      icon: cilCart,
      variant: 'info',
      color: 'info'
    },
    {
      title: 'Active Users',
      value: dashboardStats.activeUsers.toLocaleString(),
      change: '+5%',
      changeType: 'positive',
      icon: cilUserPlus,
      variant: 'warning',
      color: 'warning'
    }
  ]

  // Recent activities data
  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Created new account',
      time: '2 minutes ago',
      type: 'user'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Updated profile',
      time: '5 minutes ago',
      type: 'profile'
    },
    {
      id: 3,
      user: 'Admin User',
      action: 'Deleted user account',
      time: '10 minutes ago',
      type: 'admin'
    },
    {
      id: 4,
      user: 'Mike Johnson',
      action: 'Changed password',
      time: '15 minutes ago',
      type: 'security'
    },
    {
      id: 5,
      user: 'Sarah Wilson',
      action: 'Uploaded document',
      time: '20 minutes ago',
      type: 'upload'
    }
  ]

  const activityColumns = [
    {
      key: 'user',
      label: 'User',
      render: (value, activity) => (
        <div className="d-flex align-items-center">
          <div 
            className="rounded-circle me-2 d-flex align-items-center justify-content-center text-white fw-bold"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#6c757d'
            }}
          >
            {value.charAt(0)}
          </div>
          <span className="fw-semibold">{value}</span>
        </div>
      )
    },
    {
      key: 'action',
      label: 'Action',
      render: (value) => <span>{value}</span>
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <CBadge color={
          value === 'user' ? 'primary' : 
          value === 'profile' ? 'info' : 
          value === 'admin' ? 'danger' : 
          value === 'security' ? 'warning' : 'success'
        }>
          {value}
        </CBadge>
      )
    },
    {
      key: 'time',
      label: 'Time',
      render: (value) => <span className="text-muted">{value}</span>
    }
  ]

  const quickActions = [
    {
      title: 'Add New User',
      description: 'Create a new user account',
      icon: cilPeople,
      color: 'primary',
      onClick: () => navigate('/users/create')
    },
    {
      title: 'Manage Roles',
      description: 'Configure user roles and permissions',
      icon: cilShieldAlt,
      color: 'warning',
      onClick: () => navigate('/roles')
    },
    {
      title: 'View Reports',
      description: 'Access analytics and reports',
      icon: cilChartLine,
      color: 'info',
      onClick: () => navigate('/reports')
    },
    {
      title: 'System Settings',
      description: 'Configure system preferences',
      icon: cilSettings,
      color: 'secondary',
      onClick: () => navigate('/settings')
    }
  ]

  return (
    <>
      {/* Welcome Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard</h2>
          <p className="text-muted mb-0">Welcome back! Here's what's happening with your system.</p>
        </div>
        <div className="d-flex gap-2">
          <CButton color="outline-primary" variant="outline">
            <CIcon icon={cilBell} className="me-1" />
            Notifications
          </CButton>
          <CButton color="primary">
            <CIcon icon={cilSettings} className="me-1" />
            Settings
          </CButton>
        </div>
      </div>

      {/* Stats Cards */}
      <CRow className="mb-4">
        {dashboardData.map((item, index) => (
          <CCol md={3} key={`dashboard-card-${index}`}>
            <CCard className="h-100">
              <CCardBody>
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-3 bg-${item.color} bg-opacity-10`}>
                      <CIcon icon={item.icon} size="xl" className={`text-${item.color}`} />
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="text-muted small fw-semibold">{item.title}</div>
                    <div className="h4 mb-0 fw-bold">{item.value}</div>
                    <div className={`small ${item.changeType === 'positive' ? 'text-success' : 'text-danger'}`}>
                      <CIcon icon={item.changeType === 'positive' ? 'cil-trending-up' : 'cil-trending-down'} className="me-1" />
                      {item.change} from last month
                    </div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>

      <CRow className="mb-4">
        {/* Analytics Chart */}
        <CCol md={8}>
          <CCard className="h-100">
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CCardTitle className="mb-0">Analytics Overview</CCardTitle>
                <div className="d-flex gap-2">
                  <CButton color="outline-primary" size="sm">7 Days</CButton>
                  <CButton color="primary" size="sm">30 Days</CButton>
                  <CButton color="outline-primary" size="sm">90 Days</CButton>
                </div>
              </div>
            </CCardHeader>
            <CCardBody>
              <p className="text-muted mb-4">Performance metrics for the last 30 days</p>
              <MainChart />
            </CCardBody>
          </CCard>
        </CCol>

        {/* Quick Actions */}
        <CCol md={4}>
          <CCard className="h-100">
            <CCardHeader>
              <CCardTitle className="mb-0">Quick Actions</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <div className="d-grid gap-3">
                {quickActions.map((action, index) => (
                  <CButton
                    key={`quick-action-${index}`}
                    color={action.color}
                    variant="outline"
                    className="d-flex align-items-center justify-content-start p-3"
                    onClick={action.onClick}
                  >
                    <CIcon icon={action.icon} className="me-3" />
                    <div className="text-start">
                      <div className="fw-semibold">{action.title}</div>
                      <small className="text-muted">{action.description}</small>
                    </div>
                  </CButton>
                ))}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        {/* Recent Activities */}
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <div className="d-flex justify-content-between align-items-center">
                <CCardTitle className="mb-0">Recent Activities</CCardTitle>
                <CButton color="outline-primary" size="sm">
                  View All
                </CButton>
              </div>
            </CCardHeader>
            <CCardBody>
              <Table
                data={recentActivities}
                columns={activityColumns}
                hover
                small
                pagination={false}
                sortable={false}
              />
            </CCardBody>
          </CCard>
        </CCol>

        {/* System Status */}
        <CCol md={4}>
          <CCard>
            <CCardHeader>
              <CCardTitle className="mb-0">System Status</CCardTitle>
            </CCardHeader>
            <CCardBody>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>CPU Usage</span>
                  <span className="fw-semibold">45%</span>
                </div>
                <CProgress value={45} className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Memory Usage</span>
                  <span className="fw-semibold">67%</span>
                </div>
                <CProgress value={67} color="warning" className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Disk Usage</span>
                  <span className="fw-semibold">23%</span>
                </div>
                <CProgress value={23} color="success" className="mb-3" />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Network</span>
                  <span className="fw-semibold">89%</span>
                </div>
                <CProgress value={89} color="danger" className="mb-3" />
              </div>

              <div className="mt-4">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="text-muted">Server Status</span>
                  <CBadge color="success">Online</CBadge>
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
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
