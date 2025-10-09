# Product Management Components

## AddProductWizard

A comprehensive multi-step form for adding new products to the store. The wizard follows the design specifications with a step-indicator layout and includes all necessary product information.

### Features

- **5-Step Process**: Basic Info → Attributes → Variants → Images → Review
- **Step Navigation**: Visual step indicator with progress tracking
- **Form Validation**: Step-by-step validation with error handling
- **Data Persistence**: Form data maintained across steps
- **Image Management**: Drag-and-drop image upload with primary image selection
- **Variant Management**: Support for multiple product variants and bulk pricing
- **Review & Submit**: Final review before product creation

### Components

#### Main Components
- `AddProductWizard.jsx` - Main wizard container with step management
- `StepIndicator.jsx` - Visual step progress indicator

#### Step Components
- `steps/BasicInfoStep.jsx` - Product name, category, SKU, description
- `steps/AttributesStep.jsx` - Dietary info, dimensions, nutritional data
- `steps/VariantsStep.jsx` - Product variants and bulk pricing
- `steps/ImageStep.jsx` - Image upload and management
- `steps/ReviewStep.jsx` - Final review and submission

### Usage

```jsx
import AddProductWizard from './components/pages/products/AddProductWizard'

// The wizard is automatically routed to /add-product
// Access via navigation or direct URL
```

### Form Data Structure

```javascript
{
  basicInfo: {
    name: '',
    category: '',
    profitMargin: '',
    description: '',
    sku: '',
    gstRate: ''
  },
  attributes: {
    dietaryInfo: {
      organic: false,
      glutenFree: false,
      vegan: false,
      dairyFree: false
    },
    weight: '',
    dimensions: '',
    expiryDate: '',
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    }
  },
  variants: {
    bulkPricing: [],
    productVariants: [...]
  },
  images: {
    uploadedImages: [],
    primaryImageIndex: 0
  }
}
```

### Navigation

- **Previous/Next**: Navigate between steps with validation
- **Step Click**: Click on completed steps to navigate back
- **Save Draft**: Save progress at any step
- **Create Product**: Final submission after review

### Validation Rules

- **Basic Info**: Name, category, and SKU are required
- **Variants**: At least one valid variant required
- **Images**: At least one image required
- **Attributes**: All fields are optional

### Integration

The wizard integrates with:
- `productService.js` for API calls
- React Router for navigation
- Bootstrap for styling
- FontAwesome for icons
- Project's design system and theme
