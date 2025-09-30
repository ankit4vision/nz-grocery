import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import '../../styles/components/layout-elements/layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Navbar expand="lg" className="layout-navbar navbar-dark">
        <Container>
          <Navbar.Brand href="/" className="text-white">
            🛒 NZ Grocery Store
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <LinkContainer to="/">
                <Nav.Link className="text-white">Home</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/products">
                <Nav.Link className="text-white">Products</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/about">
                <Nav.Link className="text-white">About</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      
      <main className="layout-main">
        {children}
      </main>
      
      <footer className="layout-footer">
        <Container>
          <p>&copy; 2024 NZ Grocery Store. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default Layout;
