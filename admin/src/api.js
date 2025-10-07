// Mock API Service Setup
import config from './config'
import usersData from './mock/users.json'

class ApiService {
  constructor() {
    this.baseURL = config.api.baseURL
    this.timeout = config.api.timeout
    this.mockData = usersData
  }

  // Get auth token from localStorage
  getAuthToken() {
    return localStorage.getItem(config.auth.storageKey)
  }

  // Get user data from localStorage
  getUser() {
    const user = localStorage.getItem(config.auth.userStorageKey)
    return user ? JSON.parse(user) : null
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getAuthToken()
    const user = this.getUser()
    return !!(token && user)
  }

  // Simulate API delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // Mock API request
  async request(endpoint, options = {}) {
    // Simulate network delay
    await this.delay(300)

    const method = options.method || 'GET'
    
    // Mock responses based on endpoint
    switch (endpoint) {
      case '/users':
        if (method === 'GET') {
          return {
            success: true,
            data: this.mockData.users,
            total: this.mockData.users.length
          }
        }
        break
        
      case '/roles':
        if (method === 'GET') {
          return {
            success: true,
            data: this.mockData.roles,
            total: this.mockData.roles.length
          }
        }
        break
        
      case '/auth/login':
        if (method === 'POST') {
          const { email, password } = options.body ? JSON.parse(options.body) : {}
          const user = this.mockData.users.find(u => u.email === email && u.password === password)
          
          if (user) {
            const token = btoa(JSON.stringify({ 
              userId: user.id, 
              exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            }))
            
            return {
              success: true,
              user: { ...user, password: undefined }, // Remove password from response
              token
            }
          } else {
            throw new Error('Invalid credentials')
          }
        }
        break
        
      default:
        throw new Error(`Mock endpoint not implemented: ${endpoint}`)
    }
  }

  // HTTP Methods
  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }

  // Authentication Methods
  async login(credentials) {
    return this.post('/auth/login', credentials)
  }

  async register(userData) {
    return this.post('/auth/register', userData)
  }

  async forgotPassword(email) {
    return this.post('/auth/forgot-password', { email })
  }

  async resetPassword(token, newPassword) {
    return this.post('/auth/reset-password', { token, password: newPassword })
  }

  async logout() {
    // Clear local storage
    localStorage.removeItem(config.auth.storageKey)
    localStorage.removeItem(config.auth.userStorageKey)
    
    // Call logout endpoint if needed
    try {
      await this.post('/auth/logout')
    } catch (error) {
      console.warn('Logout endpoint failed:', error)
    }
  }

  // User Methods
  async getProfile() {
    return this.get('/user/profile')
  }

  async updateProfile(userData) {
    return this.put('/user/profile', userData)
  }
}

// Create and export singleton instance
const apiService = new ApiService()
export default apiService
