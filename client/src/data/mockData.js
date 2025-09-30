// Mock Data for NZ Grocery Application
// This file contains sample data structures that will be replaced with API calls in the future

// Import images for proper bundling
import slider1 from '../assets/images/main-slider/6994918.jpg';
import slider2 from '../assets/images/main-slider/8486222.jpg';
import slider3 from '../assets/images/main-slider/8449377.jpg';
import slider4 from '../assets/images/main-slider/8449371.jpg';

// Ads Banner Data Mock
export const adsBannerData = [
  {
    id: 1,
    title: "Cash On Delivery",
    description: "Pay when you receive your order",
    image: "🛍️💰",
    buttonText: "Save Now",
    buttonVariant: "success",
    backgroundColor: "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
  },
  {
    id: 2,
    title: "Express Delivery",
    description: "Get your groceries in 30 minutes",
    image: "🚀📦",
    buttonText: "Save Now",
    buttonVariant: "info",
    backgroundColor: "linear-gradient(135deg, #17a2b8 0%, #20c997 100%)"
  },
  {
    id: 3,
    title: "Coupon Savings",
    description: "Use digital coupons for extra savings",
    image: "✂️🎫",
    buttonText: "Free Coupon",
    buttonVariant: "warning",
    backgroundColor: "linear-gradient(135deg, #ffc107 0%, #ffd43b 100%)"
  },
  {
    id: 4,
    title: "Gift Voucher",
    description: "Perfect gifts for your loved ones",
    image: "🎁💝",
    buttonText: "Buy Now",
    buttonVariant: "primary",
    backgroundColor: "linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)"
  },
  {
    id: 5,
    title: "Free Shipping",
    description: "No delivery charges on orders above $50",
    image: "🚚🆓",
    buttonText: "Shop Now",
    buttonVariant: "success",
    backgroundColor: "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
  },
  {
    id: 6,
    title: "Fresh Daily",
    description: "Fresh produce delivered every day",
    image: "🥬🌱",
    buttonText: "Order Fresh",
    buttonVariant: "info",
    backgroundColor: "linear-gradient(135deg, #17a2b8 0%, #20c997 100%)"
  }
];

// Hero Slider Data
export const heroSlidesData = [
  {
    id: 1,
    image: slider1
  },
  {
    id: 2,
    image: slider2
  },
  {
    id: 3,
    image: slider3
  },
  {
    id: 4,
    image: slider4
  }
];

// Products Data Mock
export const productsData = [
  {
    id: 1,
    name: "Fresh Apples",
    category: "Fruits",
    price: 4.99,
    stock: 50,
    image: "🍎",
    featured: true,
    rating: 4.8
  },
  {
    id: 2,
    name: "Organic Bananas",
    category: "Fruits",
    price: 3.49,
    stock: 30,
    image: "🍌",
    featured: true,
    rating: 4.5
  }
];

// Categories Data Mock
export const categoriesData = [
  {
    id: "fruits",
    name: "Fresh Fruits",
    icon: "🍎",
    description: "Seasonal fruits from local farms",
    image: "🥭🍓🍊"
  },
  {
    id: "vegetables",
    name: "Fresh Vegetables",
    icon: "🥕",
    description: "Organic vegetables daily delivered",
    image: "🥬🥒🍅"
  },
  {
    id: "dairy",
    name: "Dairy Products",
    icon: "🥛",
    description: "Farm-fresh dairy products",
    image: "🧀🥚🍦"
  },
  {
    id: "bakery",
    name: "Bakery",
    icon: "🍞",
    description: "Artisan breads and pastries",
    image: "🥐🧁🍰"
  }
];

// Features Data Mock
export const featuresData = [
  {
    id: 1,
    icon: "🥬",
    title: "Fresh Produce",
    description: "Hand-picked fresh fruits and vegetables delivered daily from local farms.",
    variant: "success",
    link: "/produce"
  },
  {
    id: 2,
    icon: "🚚",
    title: "Fast Delivery",
    description: "Quick and reliable delivery service to your doorstep within 24 hours.",
    variant: "info",
    link: "/delivery"
  },
  {
    id: 3,
    icon: "💰",
    title: "Best Prices",
    description: "Competitive prices with regular discounts and special offers for our customers.",
    variant: "warning",
    link: "/specials"
  }
];

// Stats Data Mock
export const statsData = [
  {
    id: 1,
    title: "Products",
    value: 500,
    change: 12,
    changeType: "positive",
    icon: "📦",
    variant: "primary"
  },
  {
    id: 2,
    title: "Happy Customers",
    value: 1000,
    change: 8,
    changeType: "positive",
    icon: "😊",
    variant: "success"
  },
  {
    id: 3,
    title: "Customer Support",
    value: "24/7",
    change: null,
    icon: "🛟",
    variant: "info"
  },
  {
    id: 4,
    title: "Average Rating",
    value: "5★",
    change: null,
    icon: "⭐",
    variant: "warning"
  }
];

// Specials Data Mock
export const specialsData = [
  {
    id: 1,
    title: "Weekly Specials",
    description: "Amazing deals on fresh produce this week",
    discount: "20%",
    image: "🥬💰",
    validUntil: "End of week",
    link: "/weekly-specials"
  },
  {
    id: 2,
    title: "Organic Collection",
    description: "Premium organic products at special prices",
    discount: "15%",
    image: "🌱⭐",
    validUntil: "Limited time",
    link: "/organic"
  }
];

// Value Section Categories Data
export const valueCategoriesData = [
  {
    id: 1,
    title: "Fruit & Veg",
    description: "Save at least 20%* with The Fruit & Veg T&Cs apply",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop&crop=center",
    badge: "-20%",
    badgeType: "discount",
    link: "/fruit-veg"
  },
  {
    id: 2,
    title: "Poultry, Meat & Seafood",
    description: "Check out this week's deals",
    image: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=400&h=300&fit=crop&crop=center",
    badge: "Special",
    badgeType: "special",
    link: "/meat-seafood"
  },
  {
    id: 3,
    title: "Home Essential",
    description: "Check out this week's deals",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
    badge: "-50% Off",
    badgeType: "discount",
    link: "/home-essential"
  },
  {
    id: 4,
    title: "Health & Wellness",
    description: "Feel your best from inside out",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop&crop=center",
    badge: "1/2 Price",
    badgeType: "half-price",
    link: "/health-wellness"
  },
  {
    id: 5,
    title: "Dairy & Eggs",
    description: "Fresh dairy products at unbeatable prices",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&h=300&fit=crop&crop=center",
    badge: "-30%",
    badgeType: "discount",
    link: "/dairy-eggs"
  },
  {
    id: 6,
    title: "Bakery & Bread",
    description: "Artisan breads and fresh pastries daily",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop&crop=center",
    badge: "Fresh",
    badgeType: "special",
    link: "/bakery"
  },
  {
    id: 7,
    title: "Pantry Staples",
    description: "Essential pantry items for your kitchen",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&crop=center",
    badge: "-25%",
    badgeType: "discount",
    link: "/pantry"
  },
  {
    id: 8,
    title: "Frozen Foods",
    description: "Quality frozen meals and ingredients",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center",
    badge: "Deal",
    badgeType: "special",
    link: "/frozen"
  }
];

// Price Section Products Data
export const priceSectionData = [
  {
    id: 1,
    name: "Fresh Organic Bananas, 1kg",
    currentPrice: "2.50",
    originalPrice: "5.00",
    image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
    link: "/bananas"
  },
  {
    id: 2,
    name: "Premium Ground Coffee, 250g",
    currentPrice: "4.50",
    originalPrice: "9.00",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&crop=center",
    link: "/ground-coffee"
  },
  {
    id: 3,
    name: "Fresh Whole Milk, 2L",
    currentPrice: "3.00",
    originalPrice: "6.00",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop&crop=center",
    link: "/whole-milk"
  },
  {
    id: 4,
    name: "Artisan Sourdough Bread",
    currentPrice: "3.50",
    originalPrice: "7.00",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center",
    link: "/sourdough-bread"
  },
  {
    id: 5,
    name: "Fresh Strawberries, 500g",
    currentPrice: "3.00",
    originalPrice: "6.00",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&crop=center",
    link: "/strawberries"
  },
  {
    id: 6,
    name: "Greek Yogurt, 1kg",
    currentPrice: "4.50",
    originalPrice: "9.00",
    image: "https://images.unsplash.com/photo-1571212056062-08f0d6dac43a?w=300&h=300&fit=crop&crop=center",
    link: "/greek-yogurt"
  },
  {
    id: 7,
    name: "Premium Olive Oil, 500ml",
    currentPrice: "6.50",
    originalPrice: "13.00",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=300&fit=crop&crop=center",
    link: "/olive-oil"
  },
  {
    id: 8,
    name: "Fresh Avocados, 4 pack",
    currentPrice: "4.00",
    originalPrice: "8.00",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop&crop=center",
    link: "/avocados"
  },
  {
    id: 9,
    name: "Organic Honey, 500g",
    currentPrice: "7.50",
    originalPrice: "15.00",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop&crop=center",
    link: "/organic-honey"
  },
  {
    id: 10,
    name: "Fresh Spinach, 200g",
    currentPrice: "2.00",
    originalPrice: "4.00",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop&crop=center",
    link: "/spinach"
  },
  {
    id: 11,
    name: "Premium Salmon Fillet, 500g",
    currentPrice: "12.00",
    originalPrice: "24.00",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=300&fit=crop&crop=center",
    link: "/salmon"
  },
  {
    id: 12,
    name: "Fresh Cherry Tomatoes, 250g",
    currentPrice: "2.50",
    originalPrice: "5.00",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop&crop=center",
    link: "/cherry-tomatoes"
  },
  {
    id: 13,
    name: "Organic Quinoa, 1kg",
    currentPrice: "8.00",
    originalPrice: "16.00",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&crop=center",
    link: "/quinoa"
  },
  {
    id: 14,
    name: "Fresh Blueberries, 300g",
    currentPrice: "4.00",
    originalPrice: "8.00",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&h=300&fit=crop&crop=center",
    link: "/blueberries"
  },
  {
    id: 15,
    name: "Premium Almonds, 500g",
    currentPrice: "9.50",
    originalPrice: "19.00",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center",
    link: "/almonds"
  }
];

// Product Categories Data for Products Page
export const productCategoriesData = [
  {
    id: 'all-vegetable',
    name: 'All Vegetable',
    image: '🥬',
    count: 45,
    subcategories: ['Leafy Greens', 'Root Vegetables', 'Cruciferous', 'Nightshades']
  },
  {
    id: 'grapes',
    name: 'Grapes',
    image: '🍇',
    count: 8,
    subcategories: ['Red Grapes', 'Green Grapes', 'Black Grapes']
  },
  {
    id: 'onion-potato',
    name: 'Onion & Potato',
    image: '🧅',
    count: 12,
    subcategories: ['Onions', 'Potatoes', 'Garlic', 'Shallots']
  },
  {
    id: 'watermelons',
    name: 'Watermelons',
    image: '🍉',
    count: 5,
    subcategories: ['Seedless', 'Mini', 'Traditional']
  },
  {
    id: 'asian-exotic',
    name: 'Asian & Exotic Fruit',
    image: '🥥',
    count: 15,
    subcategories: ['Dragon Fruit', 'Mango', 'Lychee', 'Rambutan']
  },
  {
    id: 'avocados',
    name: 'Avocados',
    image: '🥑',
    count: 6,
    subcategories: ['Hass', 'Fuerte', 'Reed']
  },
  {
    id: 'citrus-fruit',
    name: 'Citrus Fruit',
    image: '🍊',
    count: 10,
    subcategories: ['Oranges', 'Lemons', 'Limes', 'Grapefruit']
  },
  {
    id: 'berries',
    name: 'Berries',
    image: '🫐',
    count: 8,
    subcategories: ['Strawberries', 'Blueberries', 'Raspberries', 'Blackberries']
  },
  {
    id: 'stone-fruit',
    name: 'Stone Fruit',
    image: '🍑',
    count: 7,
    subcategories: ['Peaches', 'Plums', 'Apricots', 'Cherries']
  },
  {
    id: 'tropical',
    name: 'Tropical Fruit',
    image: '🍍',
    count: 9,
    subcategories: ['Pineapple', 'Bananas', 'Coconut', 'Papaya']
  }
];

// Comprehensive Products Data for Products Page
export const productsListingData = [
  {
    id: 1,
    name: 'Fresh Organic Apples',
    unit: 'kg',
    currentPrice: '2.49',
    originalPrice: '3.40',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center',
    rating: 4.8,
    reviews: 124,
    discount: 27,
    isFavorite: false,
    category: 'citrus-fruit',
    subcategory: 'Apples',
    brand: 'Organic Valley',
    inStock: true,
    stockCount: 45,
    allergens: ['None'],
    dietary: ['Organic', 'Vegan'],
    healthRating: 5,
    soldBy: 'Farm Fresh',
    description: 'Crisp and sweet organic apples, perfect for snacking or baking.'
  },
  {
    id: 2,
    name: 'Strawberries',
    unit: 'pack',
    currentPrice: '3.49',
    originalPrice: '4.00',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&crop=center',
    rating: 4.6,
    reviews: 89,
    discount: 13,
    isFavorite: true,
    category: 'berries',
    subcategory: 'Strawberries',
    brand: 'Berry Fresh',
    inStock: true,
    stockCount: 32,
    allergens: ['None'],
    dietary: ['Vegan'],
    healthRating: 5,
    soldBy: 'Local Farms',
    description: 'Sweet and juicy strawberries, perfect for desserts and smoothies.'
  },
  {
    id: 3,
    name: 'Grapes',
    unit: 'kg',
    currentPrice: '4.49',
    originalPrice: '5.50',
    image: 'https://images.unsplash.com/photo-1537640538966-79f369143b8f?w=300&h=300&fit=crop&crop=center',
    rating: 4.7,
    reviews: 156,
    discount: 19,
    isFavorite: false,
    category: 'grapes',
    subcategory: 'Red Grapes',
    brand: 'Vineyard Select',
    inStock: true,
    stockCount: 28,
    allergens: ['None'],
    dietary: ['Vegan'],
    healthRating: 4,
    soldBy: 'Premium Grapes Co',
    description: 'Sweet and seedless red grapes, great for snacking.'
  },
  {
    id: 4,
    name: 'Organic Tomatoes',
    unit: 'kg',
    currentPrice: '1.79',
    originalPrice: '2.20',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop&crop=center',
    rating: 4.5,
    reviews: 203,
    discount: 19,
    isFavorite: false,
    category: 'all-vegetable',
    subcategory: 'Nightshades',
    brand: 'Garden Fresh',
    inStock: true,
    stockCount: 67,
    allergens: ['None'],
    dietary: ['Organic', 'Vegan'],
    healthRating: 5,
    soldBy: 'Organic Farms',
    description: 'Fresh organic tomatoes, perfect for salads and cooking.'
  },
  {
    id: 5,
    name: 'Free Range Eggs',
    unit: 'dozen',
    currentPrice: '5.49',
    originalPrice: '6.80',
    image: 'https://images.unsplash.com/photo-1518569656558-1f25e69d93d5?w=300&h=300&fit=crop&crop=center',
    rating: 4.9,
    reviews: 312,
    discount: 19,
    isFavorite: true,
    category: 'dairy',
    subcategory: 'Eggs',
    brand: 'Farm Fresh Eggs',
    inStock: true,
    stockCount: 24,
    allergens: ['Eggs'],
    dietary: ['Free Range'],
    healthRating: 4,
    soldBy: 'Local Farms',
    description: 'Fresh free-range eggs from happy hens.'
  },
  {
    id: 6,
    name: 'Fresh Bananas',
    unit: 'kg',
    currentPrice: '1.29',
    originalPrice: '1.60',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center',
    rating: 4.4,
    reviews: 178,
    discount: 19,
    isFavorite: false,
    category: 'tropical',
    subcategory: 'Bananas',
    brand: 'Tropical Fresh',
    inStock: true,
    stockCount: 89,
    allergens: ['None'],
    dietary: ['Vegan'],
    healthRating: 4,
    soldBy: 'Banana Co',
    description: 'Sweet and ripe bananas, perfect for breakfast.'
  },
  {
    id: 7,
    name: 'Greek Yogurt',
    unit: 'pack',
    currentPrice: '3.99',
    originalPrice: '4.90',
    image: 'https://images.unsplash.com/photo-1571212056062-08f0d6dac43a?w=300&h=300&fit=crop&crop=center',
    rating: 4.6,
    reviews: 145,
    discount: 19,
    isFavorite: false,
    category: 'dairy',
    subcategory: 'Yogurt',
    brand: 'Greek Gods',
    inStock: true,
    stockCount: 36,
    allergens: ['Milk'],
    dietary: ['High Protein'],
    healthRating: 4,
    soldBy: 'Dairy Fresh',
    description: 'Creamy Greek yogurt with live cultures.'
  },
  {
    id: 8,
    name: 'Organic Carrots',
    unit: 'kg',
    currentPrice: '1.99',
    originalPrice: '2.20',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&h=300&fit=crop&crop=center',
    rating: 4.7,
    reviews: 198,
    discount: 19,
    isFavorite: true,
    category: 'all-vegetable',
    subcategory: 'Root Vegetables',
    brand: 'Garden Fresh',
    inStock: true,
    stockCount: 54,
    allergens: ['None'],
    dietary: ['Organic', 'Vegan'],
    healthRating: 5,
    soldBy: 'Organic Farms',
    description: 'Fresh organic carrots, great for snacking and cooking.'
  },
  {
    id: 9,
    name: 'Fresh Cheese',
    unit: 'kg',
    currentPrice: '6.49',
    originalPrice: '8.00',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300&h=300&fit=crop&crop=center',
    rating: 4.8,
    reviews: 87,
    discount: 19,
    isFavorite: false,
    category: 'dairy',
    subcategory: 'Cheese',
    brand: 'Artisan Cheese Co',
    inStock: true,
    stockCount: 19,
    allergens: ['Milk'],
    dietary: ['Artisan'],
    healthRating: 3,
    soldBy: 'Cheese Masters',
    description: 'Aged artisan cheese with rich flavor.'
  },
  {
    id: 10,
    name: 'Organic Spinach',
    unit: 'pack',
    currentPrice: '2.99',
    originalPrice: '3.70',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop&crop=center',
    rating: 4.5,
    reviews: 134,
    discount: 19,
    isFavorite: false,
    category: 'all-vegetable',
    subcategory: 'Leafy Greens',
    brand: 'Garden Fresh',
    inStock: true,
    stockCount: 41,
    allergens: ['None'],
    dietary: ['Organic', 'Vegan'],
    healthRating: 5,
    soldBy: 'Organic Farms',
    description: 'Fresh organic spinach, perfect for salads and smoothies.'
  },
  {
    id: 11,
    name: 'Fresh Butter',
    unit: 'pack',
    currentPrice: '4.49',
    originalPrice: '5.50',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=300&h=300&fit=crop&crop=center',
    rating: 4.7,
    reviews: 92,
    discount: 19,
    isFavorite: false,
    category: 'dairy',
    subcategory: 'Butter',
    brand: 'Farm Fresh',
    inStock: true,
    stockCount: 27,
    allergens: ['Milk'],
    dietary: ['Natural'],
    healthRating: 3,
    soldBy: 'Dairy Fresh',
    description: 'Rich and creamy farm-fresh butter.'
  },
  {
    id: 12,
    name: 'Organic Onions',
    unit: 'kg',
    currentPrice: '1.49',
    originalPrice: '1.70',
    image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=300&h=300&fit=crop&crop=center',
    rating: 4.6,
    reviews: 167,
    discount: 19,
    isFavorite: false,
    category: 'onion-potato',
    subcategory: 'Onions',
    brand: 'Garden Fresh',
    inStock: true,
    stockCount: 73,
    allergens: ['None'],
    dietary: ['Organic', 'Vegan'],
    healthRating: 4,
    soldBy: 'Organic Farms',
    description: 'Fresh organic onions, essential for cooking.'
  }
];

// Filter Options Data
export const filterOptionsData = {
  sortBy: [
    { value: 'relevance', label: 'Sort by Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'newest', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' }
  ],
  soldBy: [
    { value: 'all', label: 'All Sellers' },
    { value: 'farm-fresh', label: 'Farm Fresh' },
    { value: 'organic-farms', label: 'Organic Farms' },
    { value: 'local-farms', label: 'Local Farms' },
    { value: 'premium-grapes-co', label: 'Premium Grapes Co' },
    { value: 'dairy-fresh', label: 'Dairy Fresh' }
  ],
  brand: [
    { value: 'all', label: 'All Brands' },
    { value: 'organic-valley', label: 'Organic Valley' },
    { value: 'berry-fresh', label: 'Berry Fresh' },
    { value: 'vineyard-select', label: 'Vineyard Select' },
    { value: 'garden-fresh', label: 'Garden Fresh' },
    { value: 'farm-fresh-eggs', label: 'Farm Fresh Eggs' }
  ],
  allergens: [
    { value: 'none', label: 'No Allergens' },
    { value: 'eggs', label: 'Eggs' },
    { value: 'milk', label: 'Milk' },
    { value: 'nuts', label: 'Nuts' },
    { value: 'soy', label: 'Soy' },
    { value: 'gluten', label: 'Gluten' }
  ],
  dietary: [
    { value: 'organic', label: 'Organic' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'high-protein', label: 'High Protein' }
  ],
  healthRating: [
    { value: 'all', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' }
  ]
};

// Breadcrumb Data
export const breadcrumbData = {
  'fruit-veg': [
    { label: 'Home', path: '/' },
    { label: 'Fruit & Veg', path: '/products/fruit-veg' }
  ],
  'fruit': [
    { label: 'Home', path: '/' },
    { label: 'Fruit & Veg', path: '/products/fruit-veg' },
    { label: 'Fruit', path: '/products/fruit-veg/fruit' }
  ],
  'vegetables': [
    { label: 'Home', path: '/' },
    { label: 'Fruit & Veg', path: '/products/fruit-veg' },
    { label: 'Vegetables', path: '/products/fruit-veg/vegetables' }
  ]
};

// Featured Products Data
export const featuredProductsData = [
  {
    id: 1,
    name: "Fresh Organic Apples",
    unit: "kg",
    currentPrice: "4.99",
    originalPrice: "6.99",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
    rating: 4.8,
    reviews: 124,
    discount: 29,
    isFavorite: false
  },
  {
    id: 2,
    name: "Premium Ground Coffee",
    unit: "kg",
    currentPrice: "12.99",
    originalPrice: "16.99",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop&crop=center",
    rating: 4.9,
    reviews: 89,
    discount: 24,
    isFavorite: true
  },
  {
    id: 3,
    name: "Fresh Strawberries",
    unit: "kg",
    currentPrice: "5.99",
    originalPrice: "7.99",
    image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=300&h=300&fit=crop&crop=center",
    rating: 4.7,
    reviews: 156,
    discount: 25,
    isFavorite: false
  },
  {
    id: 4,
    name: "Greek Yogurt",
    unit: "kg",
    currentPrice: "6.99",
    originalPrice: "8.99",
    image: "https://images.unsplash.com/photo-1571212056062-08f0d6dac43a?w=300&h=300&fit=crop&crop=center",
    rating: 4.6,
    reviews: 203,
    discount: 22,
    isFavorite: false
  },
  {
    id: 5,
    name: "Fresh Avocados",
    unit: "pack",
    currentPrice: "7.99",
    originalPrice: "9.99",
    image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=300&h=300&fit=crop&crop=center",
    rating: 4.5,
    reviews: 78,
    discount: 20,
    isFavorite: true
  },
  {
    id: 6,
    name: "Organic Honey",
    unit: "kg",
    currentPrice: "9.99",
    originalPrice: "12.99",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&h=300&fit=crop&crop=center",
    rating: 4.8,
    reviews: 145,
    discount: 23,
    isFavorite: false
  },
  {
    id: 7,
    name: "Fresh Spinach",
    unit: "kg",
    currentPrice: "3.99",
    originalPrice: "4.99",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=300&fit=crop&crop=center",
    rating: 4.4,
    reviews: 92,
    discount: 20,
    isFavorite: false
  },
  {
    id: 8,
    name: "Premium Salmon Fillet",
    unit: "kg",
    currentPrice: "18.99",
    originalPrice: "24.99",
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&h=300&fit=crop&crop=center",
    rating: 4.9,
    reviews: 67,
    discount: 24,
    isFavorite: true
  },
  {
    id: 9,
    name: "Fresh Cherry Tomatoes",
    unit: "kg",
    currentPrice: "4.99",
    originalPrice: "6.49",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=300&h=300&fit=crop&crop=center",
    rating: 4.6,
    reviews: 118,
    discount: 23,
    isFavorite: false
  },
  {
    id: 10,
    name: "Organic Quinoa",
    unit: "kg",
    currentPrice: "11.99",
    originalPrice: "14.99",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop&crop=center",
    rating: 4.7,
    reviews: 84,
    discount: 20,
    isFavorite: false
  },
  {
    id: 11,
    name: "Fresh Blueberries",
    unit: "kg",
    currentPrice: "6.99",
    originalPrice: "8.99",
    image: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=300&h=300&fit=crop&crop=center",
    rating: 4.8,
    reviews: 156,
    discount: 22,
    isFavorite: true
  },
  {
    id: 12,
    name: "Premium Almonds",
    unit: "kg",
    currentPrice: "14.99",
    originalPrice: "18.99",
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop&crop=center",
    rating: 4.9,
    reviews: 203,
    discount: 21,
    isFavorite: false
  }
];