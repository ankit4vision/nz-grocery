// Mock Data for NZ Grocery Application
// This file contains sample data structures that will be replaced with API calls in the future

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
    image: "/src/assets/images/main-slider/6994918.jpg"
  },
  {
    id: 2,
    image: "/src/assets/images/main-slider/8486222.jpg"
  },
  {
    id: 3,
    image: "/src/assets/images/main-slider/8449377.jpg"
  },
  {
    id: 4,
    image: "/src/assets/images/main-slider/8449371.jpg"
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