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
