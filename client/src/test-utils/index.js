import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AppProvider } from '../context/AppContext';

/**
 * Custom render function that includes all necessary providers
 */
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AppProvider>
        <ThemeProvider>
          <UserProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </UserProvider>
        </ThemeProvider>
      </AppProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options = {}) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render };

/**
 * Mock data for testing
 */
export const mockData = {
  user: {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    role: 'customer',
  },
  product: {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    currentPrice: 24.99,
    description: 'Test product description',
    image: 'test-image.jpg',
    category: 'test-category',
    inStock: true,
    rating: 4.5,
    reviews: 10,
  },
  cartItem: {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    currentPrice: 24.99,
    quantity: 2,
    image: 'test-image.jpg',
  },
  order: {
    id: '1',
    orderNumber: 'ORD-001',
    status: 'pending',
    total: 49.98,
    items: [
      {
        id: '1',
        name: 'Test Product',
        price: 24.99,
        quantity: 2,
      },
    ],
    createdAt: '2023-01-01T00:00:00Z',
  },
};

/**
 * Mock functions for testing
 */
export const mockFunctions = {
  mockAddToCart: jest.fn(),
  mockRemoveFromCart: jest.fn(),
  mockUpdateQuantity: jest.fn(),
  mockClearCart: jest.fn(),
  mockLogin: jest.fn(),
  mockLogout: jest.fn(),
  mockUpdateProfile: jest.fn(),
  mockSetTheme: jest.fn(),
  mockToggleTheme: jest.fn(),
  mockAddNotification: jest.fn(),
  mockRemoveNotification: jest.fn(),
};

/**
 * Test helpers
 */
export const testHelpers = {
  /**
   * Wait for async operations to complete
   */
  waitFor: (callback, options = {}) => {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 1000;
      const startTime = Date.now();
      
      const check = () => {
        try {
          const result = callback();
          if (result) {
            resolve(result);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error('Timeout waiting for condition'));
          } else {
            setTimeout(check, 10);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      check();
    });
  },

  /**
   * Mock localStorage
   */
  mockLocalStorage: () => {
    const store = {};
    return {
      getItem: jest.fn((key) => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn((key) => {
        delete store[key];
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach(key => delete store[key]);
      }),
    };
  },

  /**
   * Mock fetch
   */
  mockFetch: (response, status = 200) => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: status >= 200 && status < 300,
        status,
        json: () => Promise.resolve(response),
        text: () => Promise.resolve(JSON.stringify(response)),
      })
    );
  },

  /**
   * Mock IntersectionObserver
   */
  mockIntersectionObserver: () => {
    global.IntersectionObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  },

  /**
   * Mock ResizeObserver
   */
  mockResizeObserver: () => {
    global.ResizeObserver = jest.fn(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  },

  /**
   * Mock matchMedia
   */
  mockMatchMedia: (matches = true) => {
    global.matchMedia = jest.fn(() => ({
      matches,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  },

  /**
   * Create mock event
   */
  createMockEvent: (type, properties = {}) => {
    const event = new Event(type);
    Object.assign(event, properties);
    return event;
  },

  /**
   * Create mock form event
   */
  createMockFormEvent: (type, target = {}) => {
    const event = new Event(type);
    event.target = target;
    event.preventDefault = jest.fn();
    event.stopPropagation = jest.fn();
    return event;
  },
};

/**
 * Test assertions
 */
export const testAssertions = {
  /**
   * Assert element has correct text content
   */
  expectTextContent: (element, expectedText) => {
    expect(element).toHaveTextContent(expectedText);
  },

  /**
   * Assert element has correct class
   */
  expectClass: (element, expectedClass) => {
    expect(element).toHaveClass(expectedClass);
  },

  /**
   * Assert element is visible
   */
  expectVisible: (element) => {
    expect(element).toBeVisible();
  },

  /**
   * Assert element is hidden
   */
  expectHidden: (element) => {
    expect(element).not.toBeVisible();
  },

  /**
   * Assert element is disabled
   */
  expectDisabled: (element) => {
    expect(element).toBeDisabled();
  },

  /**
   * Assert element is enabled
   */
  expectEnabled: (element) => {
    expect(element).toBeEnabled();
  },

  /**
   * Assert element has correct attribute
   */
  expectAttribute: (element, attribute, value) => {
    expect(element).toHaveAttribute(attribute, value);
  },

  /**
   * Assert element has correct style
   */
  expectStyle: (element, style) => {
    expect(element).toHaveStyle(style);
  },
};

/**
 * Test setup utilities
 */
export const testSetup = {
  /**
   * Setup test environment
   */
  setupTestEnvironment: () => {
    // Mock console methods to reduce noise in tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: testHelpers.mockLocalStorage(),
      writable: true,
    });

    // Mock sessionStorage
    Object.defineProperty(window, 'sessionStorage', {
      value: testHelpers.mockLocalStorage(),
      writable: true,
    });

    // Mock IntersectionObserver
    testHelpers.mockIntersectionObserver();

    // Mock ResizeObserver
    testHelpers.mockResizeObserver();

    // Mock matchMedia
    testHelpers.mockMatchMedia();

    // Mock fetch
    testHelpers.mockFetch({});
  },

  /**
   * Cleanup test environment
   */
  cleanupTestEnvironment: () => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  },

  /**
   * Reset all mocks
   */
  resetMocks: () => {
    jest.clearAllMocks();
    Object.values(mockFunctions).forEach(mockFn => {
      if (jest.isMockFunction(mockFn)) {
        mockFn.mockClear();
      }
    });
  },
};

export default {
  render: customRender,
  mockData,
  mockFunctions,
  testHelpers,
  testAssertions,
  testSetup,
};
