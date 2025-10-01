import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutWrapper, ScrollToTop } from './components';
import { CartProvider } from './context';
import { navItemsData, footerLinksData, socialLinksData } from './data/mockData';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
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
                <Route path="/about" element={<About />} />
              </Routes>
        </LayoutWrapper>
      </Router>
    </CartProvider>
  );
}

export default App;
