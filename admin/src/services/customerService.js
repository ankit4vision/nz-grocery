// Customer Service - API calls for customer management
import apiClient from '../config/apiClient'
import { handleApiError, formatSuccessResponse } from '../utils/errorHandler'

const customerService = {
  // Get all customers with pagination and filters
  async getCustomers(params = {}) {
    try {
      const queryParams = {}
      
      // Map UI filters to API parameters
      if (params.page) queryParams.page = params.page
      if (params.limit) queryParams.limit = params.limit
      if (params.search) {
        // Search can be name, email, or phone
        // Try to detect if it's a phone number (digits only) or email (contains @)
        if (params.search.includes('@')) {
          queryParams.email = params.search
        } else if (/^\d+$/.test(params.search.replace(/\s+/g, ''))) {
          queryParams.phone = params.search
        } else {
          queryParams.customer_name = params.search
        }
      }
      if (params.customer_name) queryParams.customer_name = params.customer_name
      if (params.email) queryParams.email = params.email
      if (params.phone) queryParams.phone = params.phone
      if (params.customer_status && params.customer_status !== 'all') {
        queryParams.customer_status = params.customer_status
      }
      if (params.city) queryParams.city = params.city
      if (params.registered_date_from) queryParams.registered_date_from = params.registered_date_from
      if (params.registered_date_to) queryParams.registered_date_to = params.registered_date_to
      
      const response = await apiClient.get('/admin/customers/', { params: queryParams })
      
      // Map API response to UI format
      const customers = (response.data.customers || []).map(customer => ({
        id: customer.user_id,
        userId: customer.user_id,
        customerId: `#${String(customer.user_id).padStart(5, '0')}`,
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        email: customer.email || '',
        phone: customer.phone || '',
        status: customer.customer_status || (customer.is_active ? 'active' : 'suspended'),
        isActive: customer.is_active || false,
        isVerified: customer.is_verified || false,
        emailVerified: customer.email_verified || false,
        phoneVerified: customer.phone_verified || false,
        profileImageUrl: customer.profile_image_url || null,
        dateOfBirth: customer.date_of_birth || null,
        gender: customer.gender || null,
        lastLogin: customer.last_login || null,
        joinedDate: customer.created_at || new Date().toISOString(),
        createdAt: customer.created_at || new Date().toISOString(),
        updatedAt: customer.updated_at || new Date().toISOString(),
        // Default values for UI compatibility
        totalOrders: 0,
        totalSpent: 0,
        location: {
          city: '',
          country: 'New Zealand'
        }
      }))
      
    return {
      success: true,
        data: {
          customers: customers,
          total: response.data.total_count || customers.length,
          page: response.data.page || params.page || 1,
          limit: response.data.limit || params.limit || 50,
          totalPages: response.data.total_pages || 1,
          hasNext: response.data.has_next || false,
          hasPrev: response.data.has_prev || false
        },
      message: 'Customers fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get customer by ID
  async getCustomerById(userId) {
    try {
      const response = await apiClient.get(`/admin/customers/${userId}`)
      const customer = response.data
      
      // Map API response to UI format
      return {
        success: true,
        data: {
          id: customer.user_id,
          userId: customer.user_id,
          customerId: `#${String(customer.user_id).padStart(5, '0')}`,
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          email: customer.email || '',
          phone: customer.phone || '',
          status: customer.customer_status || (customer.is_active ? 'active' : 'suspended'),
          isActive: customer.is_active || false,
          isVerified: customer.is_verified || false,
          emailVerified: customer.email_verified || false,
          phoneVerified: customer.phone_verified || false,
          profileImageUrl: customer.profile_image_url || null,
          dateOfBirth: customer.date_of_birth || null,
          gender: customer.gender || null,
          lastLogin: customer.last_login || null,
          joinedDate: customer.created_at || new Date().toISOString(),
          createdAt: customer.created_at || new Date().toISOString(),
          updatedAt: customer.updated_at || new Date().toISOString()
        },
        message: 'Customer fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get customer details with addresses
  async getCustomerDetails(userId) {
    try {
      const response = await apiClient.get(`/admin/customers/${userId}/details`)
      const customer = response.data
      
      // Map API response to UI format
      const mappedCustomer = {
        id: customer.user_id,
        userId: customer.user_id,
        customerId: `#${String(customer.user_id).padStart(5, '0')}`,
        firstName: customer.first_name || '',
        lastName: customer.last_name || '',
        fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
        email: customer.email || '',
        phone: customer.phone || '',
        status: customer.customer_status || (customer.is_active ? 'active' : 'suspended'),
        isActive: customer.is_active || false,
        isVerified: customer.is_verified || false,
        emailVerified: customer.email_verified || false,
        phoneVerified: customer.phone_verified || false,
        profileImageUrl: customer.profile_image_url || null,
        dateOfBirth: customer.date_of_birth || null,
        gender: customer.gender || null,
        lastLogin: customer.last_login || null,
        joinedDate: customer.created_at || new Date().toISOString(),
        createdAt: customer.created_at || new Date().toISOString(),
        updatedAt: customer.updated_at || new Date().toISOString(),
        addresses: (customer.addresses || []).map(addr => ({
          id: addr.address_id,
          addressType: addr.address_type || 'home',
          addressLine1: addr.address_line1 || '',
          addressLine2: addr.address_line2 || '',
          city: addr.city || '',
          state: addr.state || '',
          postalCode: addr.postal_code || '',
          country: addr.country || 'New Zealand',
          latitude: addr.latitude || null,
          longitude: addr.longitude || null,
          isDefault: addr.is_default || false,
          isActive: addr.is_active !== false
        })),
        totalAddresses: customer.total_addresses || 0
      }
      
      return {
        success: true,
        data: mappedCustomer,
        message: 'Customer details fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Update customer
  async updateCustomer(userId, customerData) {
    try {
      const updateData = {}
      
      // Map UI data to API format
      if (customerData.isActive !== undefined) updateData.is_active = customerData.isActive
      if (customerData.isVerified !== undefined) updateData.is_verified = customerData.isVerified
      if (customerData.emailVerified !== undefined) updateData.email_verified = customerData.emailVerified
      if (customerData.phoneVerified !== undefined) updateData.phone_verified = customerData.phoneVerified
      
      const response = await apiClient.put(`/admin/customers/${userId}`, updateData)
      const customer = response.data
      
      // Map API response to UI format
      return {
        success: true,
        data: {
          id: customer.user_id,
          userId: customer.user_id,
          customerId: `#${String(customer.user_id).padStart(5, '0')}`,
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          email: customer.email || '',
          phone: customer.phone || '',
          status: customer.customer_status || (customer.is_active ? 'active' : 'suspended'),
          isActive: customer.is_active || false,
          isVerified: customer.is_verified || false,
          emailVerified: customer.email_verified || false,
          phoneVerified: customer.phone_verified || false,
          profileImageUrl: customer.profile_image_url || null,
          dateOfBirth: customer.date_of_birth || null,
          gender: customer.gender || null,
          lastLogin: customer.last_login || null,
          joinedDate: customer.created_at || new Date().toISOString(),
          createdAt: customer.created_at || new Date().toISOString(),
          updatedAt: customer.updated_at || new Date().toISOString()
        },
        message: 'Customer updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Suspend customer
  async suspendCustomer(userId) {
    try {
      const response = await apiClient.put(`/admin/customers/${userId}/suspend`)
      const customer = response.data
      
      // Map API response to UI format
      return {
        success: true,
        data: {
          id: customer.user_id,
          userId: customer.user_id,
          customerId: `#${String(customer.user_id).padStart(5, '0')}`,
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          email: customer.email || '',
          phone: customer.phone || '',
          status: 'suspended',
          isActive: false,
          isVerified: customer.is_verified || false,
          emailVerified: customer.email_verified || false,
          phoneVerified: customer.phone_verified || false,
          profileImageUrl: customer.profile_image_url || null,
          dateOfBirth: customer.date_of_birth || null,
          gender: customer.gender || null,
          lastLogin: customer.last_login || null,
          joinedDate: customer.created_at || new Date().toISOString(),
          createdAt: customer.created_at || new Date().toISOString(),
          updatedAt: customer.updated_at || new Date().toISOString()
        },
        message: 'Customer suspended successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Activate customer
  async activateCustomer(userId) {
    try {
      const response = await apiClient.put(`/admin/customers/${userId}/activate`)
      const customer = response.data
      
      // Map API response to UI format
      return {
        success: true,
        data: {
          id: customer.user_id,
          userId: customer.user_id,
          customerId: `#${String(customer.user_id).padStart(5, '0')}`,
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          email: customer.email || '',
          phone: customer.phone || '',
          status: 'active',
          isActive: true,
          isVerified: customer.is_verified || false,
          emailVerified: customer.email_verified || false,
          phoneVerified: customer.phone_verified || false,
          profileImageUrl: customer.profile_image_url || null,
          dateOfBirth: customer.date_of_birth || null,
          gender: customer.gender || null,
          lastLogin: customer.last_login || null,
          joinedDate: customer.created_at || new Date().toISOString(),
          createdAt: customer.created_at || new Date().toISOString(),
          updatedAt: customer.updated_at || new Date().toISOString()
        },
        message: 'Customer activated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },
      
      // Update customer status
  async updateCustomerStatus(userId, status) {
    try {
      const response = await apiClient.put(`/admin/customers/${userId}/status`, null, {
        params: { customer_status: status }
      })
      const customer = response.data
      
      // Map API response to UI format
      return {
        success: true,
        data: {
          id: customer.user_id,
          userId: customer.user_id,
          customerId: `#${String(customer.user_id).padStart(5, '0')}`,
          firstName: customer.first_name || '',
          lastName: customer.last_name || '',
          fullName: customer.full_name || `${customer.first_name || ''} ${customer.last_name || ''}`.trim(),
          email: customer.email || '',
          phone: customer.phone || '',
          status: customer.customer_status || status,
          isActive: customer.is_active || false,
          isVerified: customer.is_verified || false,
          emailVerified: customer.email_verified || false,
          phoneVerified: customer.phone_verified || false,
          profileImageUrl: customer.profile_image_url || null,
          dateOfBirth: customer.date_of_birth || null,
          gender: customer.gender || null,
          lastLogin: customer.last_login || null,
          joinedDate: customer.created_at || new Date().toISOString(),
          createdAt: customer.created_at || new Date().toISOString(),
          updatedAt: customer.updated_at || new Date().toISOString()
        },
        message: 'Customer status updated successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  },

  // Get customer statistics
  async getCustomerStats() {
    try {
      const response = await apiClient.get('/admin/customers/stats')
      const stats = response.data
    
    return {
      success: true,
      data: {
          totalCustomers: stats.total_customers || 0,
          activeCustomers: stats.active_customers || 0,
          suspendedCustomers: stats.suspended_customers || 0,
          newThisMonth: stats.new_customers_this_month || 0
      },
      message: 'Customer statistics fetched successfully'
      }
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export default customerService
