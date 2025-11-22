import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutWrapper, ScrollToTop } from './components';
import { CartProvider, UserProvider } from './context';
import { navItemsData, footerLinksData, socialLinksData } from './data/mockData';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentSuccess from './pages/PaymentSuccess';
import OrderDetails from './pages/OrderDetails';
import UserDashboard from './pages/UserDashboard';

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <LayoutWrapper
            navbarProps={{ navItems: navItemsData }}
            footerProps={{ links: footerLinksData, socialLinks: socialLinksData }}
          >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/order/:orderId" element={<OrderDetails />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/about" element={<About />} />
                </Routes>
          </LayoutWrapper>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
