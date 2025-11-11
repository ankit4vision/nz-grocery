import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://3.106.58.15:8000',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.params || config.data)
    }
    
    return config
  },
  (error) => {
    console.error('[API Request Error]', error)
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Log successful response in development
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data)
    }
    
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error('[API Error]', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        message: error.response?.data || error.message,
      })
    }
    
    // Handle 401 Unauthorized - token expired or invalid
    // Only redirect if:
    // 1. It's a 401 error
    // 2. The request had a token (authenticated request)
    // 3. It's NOT a login/register endpoint (those can fail with 401 for wrong credentials)
    // 4. We haven't already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      const requestUrl = error.config?.url || ''
      const isAuthEndpoint = requestUrl.includes('/auth/login') || 
                            requestUrl.includes('/auth/register')
      const hadToken = originalRequest.headers?.Authorization
      
      // Only redirect if it was an authenticated request (had token) and not a login/register attempt
      if (hadToken && !isAuthEndpoint) {
        originalRequest._retry = true
        
        // Clear auth data
        localStorage.removeItem('access_token')
        localStorage.removeItem('user')
        
        // If not already on login page, redirect to home
        if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
          window.location.href = '/'
        }
      }
      // For login/register 401 errors, just reject the promise (don't redirect)
      // The error will be handled by the component
    }
    
    return Promise.reject(error)
  }
)

export default apiClient

