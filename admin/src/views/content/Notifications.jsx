import React, { useState } from 'react'
import { Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEye } from '@fortawesome/free-solid-svg-icons'
import Table from '../../components/common/Table'
import NotificationFormModal from '../../components/pages/content/NotificationFormModal'

const Notifications = () => {
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [editingNotification, setEditingNotification] = useState(null)

  // Mock data for notifications
  const [notifications] = useState([
    {
      id: 1,
      title: 'New Product Launch',
      type: 'promotional',
      targetAudience: 'All Customers',
      sentDate: '2024-01-15',
      status: 'sent',
      description: 'Announcing our new organic product line'
    },
    {
      id: 2,
      title: 'System Maintenance Notice',
      type: 'system',
      targetAudience: 'All Users',
      sentDate: '2024-01-14',
      status: 'sent',
      description: 'Scheduled maintenance window notification'
    },
    {
      id: 3,
      title: 'Order Status Update',
      type: 'transactional',
      targetAudience: 'Specific Customers',
      sentDate: '2024-01-13',
      status: 'sent',
      description: 'Order delivery status update'
    },
    {
      id: 4,
      title: 'Weekly Newsletter',
      type: 'promotional',
      targetAudience: 'Subscribers',
      sentDate: '2024-01-12',
      status: 'sent',
      description: 'Weekly product highlights and offers'
    },
    {
      id: 5,
      title: 'Payment Reminder',
      type: 'transactional',
      targetAudience: 'Pending Orders',
      sentDate: '2024-01-11',
      status: 'sent',
      description: 'Reminder for pending payment'
    },
    {
      id: 6,
      title: 'Holiday Special Offer',
      type: 'promotional',
      targetAudience: 'All Customers',
      sentDate: '2024-01-10',
      status: 'sent',
      description: 'Special holiday discount promotion'
    }
  ])

  const handleSendNotification = () => {
    setEditingNotification(null)
    setShowNotificationModal(true)
  }

  const handleViewNotification = (notification) => {
    console.log('View notification:', notification)
  }

  const getTypeBadge = (type) => {
    const typeConfig = {
      promotional: { variant: 'info', text: 'Promotional' },
      system: { variant: 'warning', text: 'System' },
      transactional: { variant: 'success', text: 'Transactional' }
    }
    const config = typeConfig[type] || typeConfig.system
    return <span className={`badge bg-${config.variant} text-white`}>{config.text}</span>
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      sent: { variant: 'success', text: 'Sent' },
      pending: { variant: 'warning', text: 'Pending' },
      failed: { variant: 'danger', text: 'Failed' }
    }
    const config = statusConfig[status] || statusConfig.pending
    return <span className={`badge bg-${config.variant} text-white`}>{config.text}</span>
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      render: (value, notification) => (
        <div>
          <div className="fw-semibold">{notification.title}</div>
          <small className="text-muted">{notification.description}</small>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (value, notification) => getTypeBadge(notification.type)
    },
    {
      key: 'targetAudience',
      header: 'Target Audience',
      render: (value, notification) => notification.targetAudience
    },
    {
      key: 'sentDate',
      header: 'Sent Date',
      render: (value, notification) => notification.sentDate
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, notification) => getStatusBadge(notification.status)
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, notification) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleViewNotification(notification)}
          className="px-3"
        >
          <FontAwesomeIcon icon={faEye} />
        </Button>
      )
    }
  ]

  const sortableColumns = ['title', 'sentDate']

  return (
    <>
      {/* Section Header */}
      <div className="d-flex align-items-center mb-4 pb-3 border-bottom border-success border-2">
        <h4 className="mb-0 text-success">System Notifications</h4>
        <div className="ms-auto">
          <Button variant="success" onClick={handleSendNotification} className="text-white">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            Send Notification
          </Button>
        </div>
      </div>

      {/* Notifications Table */}
      <Table
        data={notifications}
        columns={columns}
        sortableColumns={sortableColumns}
        pagination={true}
        currentPage={1}
        pageSize={10}
        totalItems={notifications.length}
        loading={false}
        emptyMessage="No notifications found."
      />

      {/* Notification Form Modal */}
      <NotificationFormModal
        show={showNotificationModal}
        onHide={() => setShowNotificationModal(false)}
        notification={editingNotification}
        onSave={(notificationData) => {
          console.log('Send notification:', notificationData)
          setShowNotificationModal(false)
        }}
      />
    </>
  )
}

export default Notifications
