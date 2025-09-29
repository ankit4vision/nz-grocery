import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LayoutWrapper } from './components';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';

function App() {
  const navItems = [
    { path: '/products', label: 'Browse products' },
    { path: '/specials', label: 'Specials & catalogue' },
    { path: '/recipes', label: 'Recipes & Ideas' },
    { path: '/value', label: 'Get more value' },
    { path: '/shop', label: 'Ways to Shop' },
    { path: '/help', label: 'Help' }
  ];

  const footerLinks = [
    {
      title: 'Quick Links',
      items: [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Products' },
        { href: '/about', label: 'About' }
      ]
    },
    {
      title: 'Support',
      items: [
        { href: '/contact', label: 'Contact Us' },
        { href: '/help', label: 'Help Center' },
        { href: '/faq', label: 'FAQ' }
      ]
    }
  ];

  const socialLinks = [
    { href: '#', icon: '📘' },
    { href: '#', icon: '📷' },
    { href: '#', icon: '🐦' }
  ];

  return (
    <Router>
      <LayoutWrapper
        navbarProps={{ navItems }}
        footerProps={{ links: footerLinks, socialLinks }}
      >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<About />} />
            </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
