/**
 * Test data for unit and integration tests
 */

// Mock user data
export const mockUsers = {
  customer: {
    id: '1',
    email: 'customer@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
    phone: '+64 21 123 4567',
    address: {
      street: '123 Main Street',
      city: 'Auckland',
      postalCode: '1010',
      country: 'New Zealand',
    },
    preferences: {
      theme: 'light',
      language: 'en',
      notifications: true,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  admin: {
    id: '2',
    email: 'admin@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'admin',
    phone: '+64 21 987 6543',
    address: {
      street: '456 Admin Street',
      city: 'Wellington',
      postalCode: '6011',
      country: 'New Zealand',
    },
    preferences: {
      theme: 'dark',
      language: 'en',
      notifications: true,
    },
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
};

// Mock product data
export const mockProducts = {
  single: {
    id: '1',
    name: 'Fresh Organic Apples',
    description: 'Crisp and juicy organic apples from local farms',
    price: 4.99,
    currentPrice: 3.99,
    originalPrice: 4.99,
    discount: 20,
    category: 'fresh-produce',
    subcategory: 'fruits',
    brand: 'Organic Farms',
    sku: 'APP-001',
    inStock: true,
    stockQuantity: 100,
    image: 'apples.jpg',
    images: ['apples-1.jpg', 'apples-2.jpg'],
    rating: 4.5,
    reviews: 25,
    tags: ['organic', 'fresh', 'local'],
    weight: '1kg',
    dimensions: '10x8x6cm',
    nutritionalInfo: {
      calories: 52,
      protein: '0.3g',
      carbs: '14g',
      fat: '0.2g',
    },
    allergens: [],
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  multiple: [
    {
      id: '1',
      name: 'Fresh Organic Apples',
      price: 4.99,
      currentPrice: 3.99,
      category: 'fresh-produce',
      image: 'apples.jpg',
      rating: 4.5,
      reviews: 25,
      inStock: true,
    },
    {
      id: '2',
      name: 'Whole Milk 1L',
      price: 2.99,
      currentPrice: 2.99,
      category: 'dairy-eggs',
      image: 'milk.jpg',
      rating: 4.2,
      reviews: 15,
      inStock: true,
    },
    {
      id: '3',
      name: 'Fresh Bread Loaf',
      price: 3.50,
      currentPrice: 2.99,
      category: 'bakery',
      image: 'bread.jpg',
      rating: 4.8,
      reviews: 8,
      inStock: false,
    },
  ],
};

// Mock cart data
export const mockCart = {
  empty: {
    items: [],
    totalItems: 0,
    totalPrice: 0,
  },
  withItems: {
    items: [
      {
        id: '1',
        name: 'Fresh Organic Apples',
        price: 4.99,
        currentPrice: 3.99,
        quantity: 2,
        image: 'apples.jpg',
        category: 'fresh-produce',
      },
      {
        id: '2',
        name: 'Whole Milk 1L',
        price: 2.99,
        currentPrice: 2.99,
        quantity: 1,
        image: 'milk.jpg',
        category: 'dairy-eggs',
      },
    ],
    totalItems: 3,
    totalPrice: 10.97,
  },
};

// Mock order data
export const mockOrders = {
  single: {
    id: '1',
    orderNumber: 'ORD-001',
    status: 'pending',
    total: 49.98,
    subtotal: 45.98,
    tax: 4.00,
    shipping: 0,
    discount: 0,
    items: [
      {
        id: '1',
        productId: '1',
        name: 'Fresh Organic Apples',
        price: 24.99,
        quantity: 2,
        image: 'apples.jpg',
      },
    ],
    shippingAddress: {
      street: '123 Main Street',
      city: 'Auckland',
      postalCode: '1010',
      country: 'New Zealand',
    },
    billingAddress: {
      street: '123 Main Street',
      city: 'Auckland',
      postalCode: '1010',
      country: 'New Zealand',
    },
    paymentMethod: 'credit_card',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  multiple: [
    {
      id: '1',
      orderNumber: 'ORD-001',
      status: 'pending',
      total: 49.98,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      status: 'delivered',
      total: 25.99,
      createdAt: '2023-01-02T00:00:00Z',
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      status: 'cancelled',
      total: 15.50,
      createdAt: '2023-01-03T00:00:00Z',
    },
  ],
};

// Mock category data
export const mockCategories = {
  single: {
    id: 'fresh-produce',
    name: 'Fresh Produce',
    description: 'Fresh fruits and vegetables',
    icon: '🥬',
    image: 'fresh-produce.jpg',
    parentId: null,
    subcategories: ['fruits', 'vegetables'],
    productCount: 150,
    isActive: true,
    sortOrder: 1,
  },
  multiple: [
    {
      id: 'fresh-produce',
      name: 'Fresh Produce',
      description: 'Fresh fruits and vegetables',
      icon: '🥬',
      productCount: 150,
    },
    {
      id: 'dairy-eggs',
      name: 'Dairy & Eggs',
      description: 'Milk, cheese, eggs and dairy products',
      icon: '🥛',
      productCount: 75,
    },
    {
      id: 'bakery',
      name: 'Bakery',
      description: 'Fresh bread, pastries and baked goods',
      icon: '🍞',
      productCount: 50,
    },
  ],
};

// Mock review data
export const mockReviews = {
  single: {
    id: '1',
    productId: '1',
    userId: '1',
    userName: 'John Doe',
    rating: 5,
    title: 'Excellent quality',
    comment: 'These apples are fresh and delicious. Highly recommended!',
    helpful: 3,
    verified: true,
    createdAt: '2023-01-01T00:00:00Z',
  },
  multiple: [
    {
      id: '1',
      productId: '1',
      userName: 'John Doe',
      rating: 5,
      title: 'Excellent quality',
      comment: 'These apples are fresh and delicious.',
      helpful: 3,
      verified: true,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      productId: '1',
      userName: 'Jane Smith',
      rating: 4,
      title: 'Good value',
      comment: 'Good quality for the price.',
      helpful: 1,
      verified: false,
      createdAt: '2023-01-02T00:00:00Z',
    },
  ],
};

// Mock notification data
export const mockNotifications = {
  single: {
    id: '1',
    type: 'info',
    title: 'Order Update',
    message: 'Your order has been shipped',
    read: false,
    persistent: false,
    createdAt: '2023-01-01T00:00:00Z',
  },
  multiple: [
    {
      id: '1',
      type: 'info',
      title: 'Order Update',
      message: 'Your order has been shipped',
      read: false,
      createdAt: '2023-01-01T00:00:00Z',
    },
    {
      id: '2',
      type: 'success',
      title: 'Welcome!',
      message: 'Welcome to NZ Grocery',
      read: true,
      createdAt: '2023-01-02T00:00:00Z',
    },
  ],
};

// Mock API responses
export const mockApiResponses = {
  success: {
    success: true,
    data: {},
    message: 'Success',
  },
  error: {
    success: false,
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      details: {},
    },
  },
  paginated: {
    success: true,
    data: {
      items: [],
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
    },
  },
};

// Mock form data
export const mockFormData = {
  login: {
    email: 'test@example.com',
    password: 'password123',
    rememberMe: false,
  },
  register: {
    email: 'newuser@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+64 21 123 4567',
    acceptTerms: true,
  },
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+64 21 123 4567',
    address: {
      street: '123 Main Street',
      city: 'Auckland',
      postalCode: '1010',
      country: 'New Zealand',
    },
  },
  address: {
    type: 'home',
    street: '123 Main Street',
    city: 'Auckland',
    postalCode: '1010',
    country: 'New Zealand',
    isDefault: true,
  },
  review: {
    rating: 5,
    title: 'Great product',
    comment: 'I really enjoyed this product.',
  },
};

// Mock search data
export const mockSearchData = {
  query: 'apples',
  results: {
    products: mockProducts.multiple,
    categories: mockCategories.multiple,
    suggestions: ['apples', 'apple juice', 'apple pie'],
  },
  filters: {
    category: 'fresh-produce',
    priceRange: { min: 0, max: 100 },
    rating: 4,
    inStock: true,
  },
  sort: {
    field: 'name',
    order: 'asc',
  },
};

export default {
  mockUsers,
  mockProducts,
  mockCart,
  mockOrders,
  mockCategories,
  mockReviews,
  mockNotifications,
  mockApiResponses,
  mockFormData,
  mockSearchData,
};
