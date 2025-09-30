import '@testing-library/jest-dom';
import { testSetup } from './test-utils';

// Setup test environment
testSetup.setupTestEnvironment();

// Global test setup
beforeEach(() => {
  testSetup.resetMocks();
});

afterEach(() => {
  testSetup.cleanupTestEnvironment();
});

// Global test teardown
afterAll(() => {
  testSetup.cleanupTestEnvironment();
});
