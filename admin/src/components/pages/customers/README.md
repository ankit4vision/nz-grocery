# Customer Management Components

This directory contains the customer management components for the NZ Grocery Admin application.

## Components

### CustomerDetailsModal.jsx
A modal component that displays detailed information about a customer.

**Features:**
- Customer profile with avatar (initials)
- Contact information (email, phone, location)
- Order statistics (total orders, total spent)
- Account status with color-coded badges
- Address information
- Customer preferences
- Notes section
- Action buttons (Edit, Suspend/Activate)

**Props:**
- `visible` (boolean): Controls modal visibility
- `onClose` (function): Callback when modal is closed
- `customer` (object): Customer data to display
- `onEdit` (function): Callback for edit action
- `onSuspend` (function): Callback for suspend action
- `onActivate` (function): Callback for activate action

### CustomerForm.jsx
A comprehensive form component for creating and editing customers.

**Features:**
- Personal information section (name, email, phone)
- Address information section (street, city, state, postal code, country)
- Preferences section (newsletter, SMS notifications, delivery time, dietary restrictions)
- Account status management
- Notes section
- Form validation with error handling
- Support for both create and edit modes

**Props:**
- `mode` (string): 'create' or 'edit'
- `initialData` (object): Initial data for edit mode
- `onSubmit` (function): Callback when form is submitted
- `onCancel` (function): Callback when form is cancelled
- `loading` (boolean): Loading state

**Form Sections:**
1. **Personal Information**: First name, last name, email, phone
2. **Address Information**: Complete address details
3. **Preferences**: Newsletter, SMS, delivery time, dietary restrictions
4. **Additional Notes**: Free text notes field

**Validation:**
- Required fields: firstName, lastName, email, phone, street, city, postalCode
- Email format validation
- Real-time error clearing

## Usage

### CustomerDetailsModal
```jsx
import CustomerDetailsModal from './components/pages/customers/CustomerDetailsModal'

<CustomerDetailsModal
  visible={showModal}
  onClose={() => setShowModal(false)}
  customer={selectedCustomer}
  onEdit={handleEditCustomer}
  onSuspend={handleSuspendCustomer}
  onActivate={handleActivateCustomer}
/>
```

### CustomerForm
```jsx
import CustomerForm from './components/pages/customers/CustomerForm'

// Create mode
<CustomerForm
  mode="create"
  onSubmit={handleCreateCustomer}
  onCancel={handleCancel}
/>

// Edit mode
<CustomerForm
  mode="edit"
  initialData={customerData}
  onSubmit={handleUpdateCustomer}
  onCancel={handleCancel}
/>
```

## Styling

The components follow the project's design guidelines:
- Green theme colors (`text-success`, `border-success`)
- Bootstrap classes with custom enhancements
- Consistent spacing and typography
- Responsive design
- Clean layout without nested cards

## Dependencies

- React Bootstrap for UI components
- FontAwesome for icons
- React hooks for state management
- Form validation and error handling

## Data Structure

### Customer Object
```javascript
{
  id: number,
  customerId: string, // e.g., "#12345"
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  address: {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
  },
  location: {
    city: string,
    country: string
  },
  status: 'active' | 'suspended' | 'pending',
  totalOrders: number,
  totalSpent: number,
  joinedDate: string, // ISO date string
  lastOrderDate: string, // ISO date string
  avatar: string,
  notes: string,
  preferences: {
    newsletter: boolean,
    smsNotifications: boolean,
    preferredDeliveryTime: 'morning' | 'afternoon' | 'evening',
    dietaryRestrictions: string[]
  },
  createdAt: string, // ISO date string
  updatedAt: string // ISO date string
}
```

## Integration

These components are integrated with:
- Customer service API layer
- Mock data for development
- Main customer list view
- Navigation system
- Routing configuration
