import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutWrapper, ScrollToTop } from './components';
import { CartProvider, UserProvider, AuthModalProvider } from './context';
import { navItemsData } from './data/mockData';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import FAQ from './pages/FAQ';
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
          <AuthModalProvider>
            <LayoutWrapper
              navbarProps={{ navItems: navItemsData }}
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
                  <Route path="/faq" element={<FAQ />} />
                </Routes>
            </LayoutWrapper>
          </AuthModalProvider>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
