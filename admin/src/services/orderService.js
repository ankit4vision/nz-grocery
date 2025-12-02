// Order Management Service - API calls for order management
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils/errorHandler'

const orderService = {
  // Get all orders with pagination and filters
  async getOrders(params = {}) {
    try {
      const queryParams = {}
      
      // Map UI filters to API parameters
      // API expects: order_id, customer_first_name, customer_last_name, order_status, payment_status, date_from, date_to, page, limit
      if (params.page) queryParams.page = params.page
      if (params.limit) queryParams.limit = params.limit
      
      // Order ID filter (must be integer)
      if (params.search && params.search.trim() !== '') {
        const orderId = parseInt(params.search.trim())
        if (!isNaN(orderId) && orderId > 0) {
          queryParams.order_id = orderId
        }
      }
      
      // Customer name filter - split into first and last name
      if (params.customer && params.customer.trim() !== '') {
        const nameParts = params.customer.trim().split(/\s+/)
        if (nameParts.length > 1) {
          queryParams.customer_first_name = nameParts[0]
          queryParams.customer_last_name = nameParts.slice(1).join(' ')
        } else {
          queryParams.customer_first_name = nameParts[0]
        }
      }
      
      // Order status filter
      if (params.status && params.status !== 'all') {
        queryParams.order_status = params.status
      }
      
      // Payment status filter
      if (params.paymentStatus && params.paymentStatus !== 'all') {
        queryParams.payment_status = params.paymentStatus
      }
      
      // Handle date range
      if (params.dateRange && params.dateRange !== 'all') {
        const today = new Date()
        let dateFrom, dateTo
        
        switch (params.dateRange) {
          case 'today':
            dateFrom = today.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          case 'week':
            const weekAgo = new Date(today)
            weekAgo.setDate(today.getDate() - 7)
            dateFrom = weekAgo.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          case 'month':
            const monthAgo = new Date(today)
            monthAgo.setMonth(today.getMonth() - 1)
            dateFrom = monthAgo.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          case 'quarter':
            const quarterAgo = new Date(today)
            quarterAgo.setMonth(today.getMonth() - 3)
            dateFrom = quarterAgo.toISOString().split('T')[0]
            dateTo = today.toISOString().split('T')[0]
            break
          default:
            break
        }
        
        if (dateFrom) queryParams.date_from = dateFrom
        if (dateTo) queryParams.date_to = dateTo
      }
      
      const response = await apiClient.get('/admin/orders/', { params: queryParams })
      
      // Map API response to UI format
      // API returns: { orders: [], total_count, page, limit, total_pages, has_next, has_prev }
      const orders = (response.data.orders || []).map(order => ({
        id: order.order_id,
        orderId: order.order_id,
        orderNumber: order.order_number || `#${order.order_id}`,
        customer: {
          firstName: order.customer_first_name || '',
          lastName: order.customer_last_name || '',
          email: order.customer_email || '',
          phone: order.customer_phone || ''
        },
        status: order.order_status || 'pending',
        paymentStatus: order.payment_status || 'pending',
        total: parseFloat(order.total_amount || 0),
        subtotal: parseFloat(order.subtotal || 0),
        shipping: parseFloat(order.shipping_fee || 0),
        tax: parseFloat(order.tax_amount || order.gst_amount || 0),
        gst: parseFloat(order.gst_amount || order.tax_amount || 0),
        discount: parseFloat(order.discount_amount || 0),
        commission: parseFloat(order.total_amount || 0) * 0.1, // 10% commission
        orderDate: order.created_at || new Date().toISOString(),
        orderType: order.order_type || 'standard',
        // Note: items are not returned in list endpoint, only in details endpoint
        items: [],
        estimatedDeliveryTime: order.estimated_delivery_time || null,
        actualDeliveryTime: order.actual_delivery_time || null
      }))
      
      return {
        success: true,
        data: {
          orders: orders,
          total: response.data.total_count || 0,
          totalCount: response.data.total_count || 0,
          page: response.data.page || params.page || 1,
          limit: response.data.limit || params.limit || 10,
          totalPages: response.data.total_pages || 1,
          hasNext: response.data.has_next || false,
          hasPrev: response.data.has_prev || false
        },
        message: 'Orders fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const response = await apiClient.get(`/admin/orders/${orderId}`)
      
      // Map API response to UI format
      const order = response.data
      return {
        success: true,
        data: {
          id: order.order_id,
          orderNumber: `#${order.order_id}`,
          customer: {
            firstName: order.customer_first_name || '',
            lastName: order.customer_last_name || '',
            email: order.customer_email || '',
            phone: order.customer_phone || '',
            avatar: null
          },
          status: order.order_status || 'pending',
          paymentStatus: order.payment_status || 'pending',
          total: parseFloat(order.total_amount || 0),
          subtotal: parseFloat(order.subtotal || 0),
          shipping: parseFloat(order.shipping_cost || 0),
          tax: parseFloat(order.tax_amount || order.gst_amount || 0),
          gst: parseFloat(order.gst_amount || order.tax_amount || 0),
          commission: parseFloat(order.total_amount || 0) * 0.1,
          orderDate: order.created_at || order.order_date || new Date().toISOString(),
          items: order.order_items || [],
          shippingAddress: order.shipping_address || {}
        },
        message: 'Order fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get order details with items (full details)
  async getOrderDetails(orderId) {
    try {
      const response = await apiClient.get(`/admin/orders/${orderId}/details`)
      
      // Map API response to UI format
      // API returns: order_id, order_number, customer_*, order_status, payment_status, items[], etc.
      const order = response.data
      return {
        success: true,
        data: {
          id: order.order_id,
          orderId: order.order_id,
          orderNumber: order.order_number || `#${order.order_id}`,
          orderType: order.order_type || 'standard',
          customer: {
            firstName: order.customer_first_name || '',
            lastName: order.customer_last_name || '',
            email: order.customer_email || '',
            phone: order.customer_phone || '',
            avatar: null
          },
          status: order.order_status || 'pending',
          paymentStatus: order.payment_status || 'pending',
          total: parseFloat(order.total_amount || 0),
          subtotal: parseFloat(order.subtotal || 0),
          shipping: parseFloat(order.shipping_fee || 0),
          tax: parseFloat(order.tax_amount || order.gst_amount || 0),
          gst: parseFloat(order.gst_amount || order.tax_amount || 0),
          discount: parseFloat(order.discount_amount || 0),
          commission: parseFloat(order.total_amount || 0) * 0.1,
          orderDate: order.created_at || new Date().toISOString(),
          updatedAt: order.updated_at || null,
          items: (order.items || []).map(item => ({
            id: item.order_item_id,
            orderItemId: item.order_item_id,
            productId: item.product_id,
            variantId: item.variant_id,
            productName: item.product_name || 'Unknown Product',
            variantName: item.variant_name || null,
            quantity: item.quantity || 0,
            unitPrice: parseFloat(item.unit_price || 0),
            totalPrice: parseFloat(item.total_price || 0),
            productImage: null, // Not in API response
            createdAt: item.created_at || null
          })),
          totalItemsCount: order.total_items_count || 0,
          deliveryAddressId: order.delivery_address_id || null,
          pickupAddressId: order.pickup_address_id || null,
          deliveryInstructions: order.delivery_instructions || null,
          estimatedDeliveryTime: order.estimated_delivery_time || null,
          actualDeliveryTime: order.actual_delivery_time || null,
          cancellationReason: order.cancellation_reason || null,
          paymentMethodId: order.payment_method_id || null,
          stripePaymentIntentId: order.stripe_payment_intent_id || null,
          vendorId: order.vendor_id || null,
          shippingAddress: {} // Will need to fetch separately if needed
        },
        message: 'Order details fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update order status
  async updateOrderStatus(orderId, status, notes = '') {
    try {
      const response = await apiClient.put(`/admin/orders/${orderId}/status`, null, {
        params: {
          order_status: status
        }
      })
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update payment status
  async updatePaymentStatus(orderId, paymentStatus, stripePaymentIntentId = null) {
    try {
      const params = {
        payment_status: paymentStatus
      }
      
      if (stripePaymentIntentId) {
        params.stripe_payment_intent_id = stripePaymentIntentId
      }
      
      const response = await apiClient.put(`/admin/orders/${orderId}/payment-status`, null, {
        params: params
      })
      
      return formatSuccessResponse(response)
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get order statistics
  async getOrderStats(params = {}) {
    try {
      const response = await apiClient.get('/admin/orders/stats')
      
      return {
        success: true,
        data: {
          totalOrders: response.data.total_orders || 0,
          pendingOrders: response.data.pending_orders || 0,
          processingOrders: response.data.processing_orders || 0,
          totalRevenue: parseFloat(response.data.total_revenue || 0)
        },
        message: 'Order statistics fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Generate timeline from order data
  generateTimeline(order) {
    const timeline = []
    const statusOrder = ['pending', 'confirmed', 'processing', 'ready_for_pickup', 'out_for_delivery', 'delivered']
    const currentStatus = order.order_status || 'pending'
    const currentIndex = statusOrder.indexOf(currentStatus)
    
    statusOrder.forEach((status, index) => {
      const isCompleted = index <= currentIndex
      const isCurrent = index === currentIndex
      
      let title = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')
      let description = ''
      let date = null
      
      switch (status) {
        case 'pending':
          title = 'Order Placed'
          description = 'Order has been placed and is awaiting confirmation'
          date = order.created_at || order.order_date
          break
        case 'confirmed':
          title = 'Order Confirmed'
          description = 'Order has been confirmed'
          break
        case 'processing':
          title = 'Processing'
          description = 'Order is being prepared'
          break
        case 'ready_for_pickup':
          title = 'Ready for Pickup'
          description = 'Order is ready for pickup'
          break
        case 'out_for_delivery':
          title = 'Out for Delivery'
          description = 'Order is on the way'
          break
        case 'delivered':
          title = 'Delivered'
          description = 'Order has been delivered'
          date = order.delivered_at || order.actual_delivery_time
          break
        default:
          break
      }
      
      timeline.push({
        id: index + 1,
        status: status,
        title: title,
        description: description,
        isCompleted: isCompleted,
        isCurrent: isCurrent,
        date: date,
        expectedDate: !isCompleted && !isCurrent ? 'TBD' : null
      })
    })
    
    // Add cancelled/refunded status if applicable
    if (currentStatus === 'cancelled' || currentStatus === 'refunded') {
      timeline.push({
        id: timeline.length + 1,
        status: currentStatus,
        title: currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1),
        description: currentStatus === 'cancelled' ? 'Order has been cancelled' : 'Order has been refunded',
        isCompleted: true,
        isCurrent: false,
        date: order.cancelled_at || order.refunded_at
      })
    }
    
    return timeline
  },

  // Get order status options
  getOrderStatusOptions() {
    return [
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'confirmed', label: 'Confirmed', color: 'info' },
      { value: 'processing', label: 'Processing', color: 'primary' },
      { value: 'ready_for_pickup', label: 'Ready for Pickup', color: 'info' },
      { value: 'out_for_delivery', label: 'Out for Delivery', color: 'info' },
      { value: 'delivered', label: 'Delivered', color: 'success' },
      { value: 'cancelled', label: 'Cancelled', color: 'danger' },
      { value: 'refunded', label: 'Refunded', color: 'secondary' },
    ]
  },

  // Get payment status options
  getPaymentStatusOptions() {
    return [
      { value: 'pending', label: 'Pending', color: 'warning' },
      { value: 'paid', label: 'Paid', color: 'success' },
      { value: 'failed', label: 'Failed', color: 'danger' },
      { value: 'refunded', label: 'Refunded', color: 'secondary' },
    ]
  },

  // Get payment method options
  getPaymentMethodOptions() {
    return [
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'debit_card', label: 'Debit Card' },
      { value: 'paypal', label: 'PayPal' },
      { value: 'bank_transfer', label: 'Bank Transfer' },
      { value: 'cash_on_delivery', label: 'Cash on Delivery' },
      { value: 'digital_wallet', label: 'Digital Wallet' },
    ]
  },

  // Get shipping method options
  getShippingMethodOptions() {
    return [
      { value: 'standard', label: 'Standard Shipping' },
      { value: 'express', label: 'Express Shipping' },
      { value: 'overnight', label: 'Overnight Shipping' },
      { value: 'pickup', label: 'Store Pickup' },
      { value: 'local_delivery', label: 'Local Delivery' },
    ]
  },

  // Get address by ID
  async getAddressById(addressId) {
    try {
      const response = await apiClient.get(`/users/addresses/${addressId}`)
      
      // Map API response to UI format
      const address = response.data
      return {
        success: true,
        data: {
          id: address.address_id,
          userId: address.user_id,
          addressType: address.address_type || 'home',
          addressLine1: address.address_line1 || '',
          addressLine2: address.address_line2 || '',
          city: address.city || '',
          state: address.state || '',
          postalCode: address.postal_code || '',
          country: address.country || 'New Zealand',
          latitude: address.latitude || null,
          longitude: address.longitude || null,
          isDefault: address.is_default || false,
          isActive: address.is_active !== false,
          createdAt: address.created_at || null,
          updatedAt: address.updated_at || null
        },
        message: 'Address fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Format address for display
  formatAddress(address) {
    if (!address) return 'N/A'
    
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.city,
      address.state,
      address.postalCode,
      address.country
    ].filter(Boolean)
    
    return parts.join(', ') || 'N/A'
  }
}

export default orderService
