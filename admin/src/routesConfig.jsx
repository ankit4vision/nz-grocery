// Routes configuration for breadcrumbs and navigation
const routesConfig = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard' },
  
  // User Management Routes
  { path: '/users', name: 'Users' },
  { path: '/users/create', name: 'Create User' },
  { path: '/users/edit/:id', name: 'Edit User' },
  { path: '/users/:id', name: 'User Details' },
  
  // Role Management Routes
  { path: '/roles', name: 'Roles' },
  { path: '/roles/create', name: 'Create Role' },
  { path: '/roles/edit/:id', name: 'Edit Role' },
  { path: '/roles/:id', name: 'Role Details' },
  
  // Category Management Routes
  { path: '/categories', name: 'Categories' },
  { path: '/categories/create', name: 'Create Category' },
  { path: '/categories/edit/:id', name: 'Edit Category' },
  { path: '/categories/:id', name: 'Category Details' },
  
  // Product Management Routes
  { path: '/products', name: 'Products' },
  { path: '/add-product', name: 'Add Product' },
  { path: '/products/edit/:id', name: 'Edit Product' },
  { path: '/products/:id', name: 'Product Details' },
  
  // Inventory Management Routes
  { path: '/inventory', name: 'Inventory Management' },
  { path: '/inventory/history/:id', name: 'Inventory History' },
  
  // Order Management Routes
  { path: '/orders', name: 'Order Management' },
  { path: '/order-history', name: 'Order History' },
  { path: '/orders/:id', name: 'Order Details' },
  
  // Customer Management Routes
  { path: '/customers', name: 'Customer Management' },
  { path: '/customers/:id', name: 'Customer Details' },
  
  // Content Management Routes
  { path: '/content', name: 'Content Management' },
  
  // Account Routes
  { path: '/profile', name: 'Profile' },
  { path: '/profile/edit', name: 'Edit Profile' },
  { path: '/settings', name: 'Global Settings' },
  
  // Auth Routes
  { path: '/login', name: 'Login' },
  { path: '/forgot-password', name: 'Forgot Password' },
  { path: '/reset-password', name: 'Reset Password' },
]

export default routesConfig
