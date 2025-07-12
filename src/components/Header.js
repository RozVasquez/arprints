import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to determine if a link is active
  const isActive = (path) => {
    if (path === '/products') {
      // Products link is active for /products and any /products/* route
      return location.pathname === '/products' || location.pathname.startsWith('/products/');
    }
    return location.pathname === path;
  };

  // Function to get link classes based on active state
  const getLinkClasses = (path, isMobile = false) => {
    const baseClasses = isMobile 
      ? "py-2 px-6 text-center transition duration-300 block"
      : "py-2 px-3 transition duration-300 flex items-center";
    
    const activeClasses = isMobile
      ? "text-pink-600 bg-pink-50 font-semibold"
      : "text-pink-600 font-semibold";
    
    const inactiveClasses = isMobile
      ? "text-pink-600 hover:bg-pink-50"
      : "text-pink-600 hover:text-pink-300";
    
    return `${baseClasses} ${isActive(path) ? activeClasses : inactiveClasses}`;
  };

  return (
    <header id="header" className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm bg-white/10">
      <div className="container mx-auto px-6 py-4 flex items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/AR-01.png" 
              alt="AR Prints Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-2xl font-bold text-pink-600">AR Prints</span>
          </Link>
        </div>
        
        {/* Centered Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8 flex-1 justify-center">
          <Link to="/" className={getLinkClasses('/')}>
            Home
          </Link>
          <Link to="/products" className={getLinkClasses('/products')}>
            Products
          </Link>
          <Link to="/pricing" className={getLinkClasses('/pricing')}>
            Pricing
          </Link>
        </nav>

        {/* Order Now Button */}
        <div className="hidden md:flex flex-shrink-0">
          <a 
            href="https://www.facebook.com/profile.php?id=61576666357859" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition duration-300 font-medium"
          >
            Order Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-pink-600 focus:outline-none transform transition-transform duration-300 hover:scale-110 ml-auto"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
        } bg-white shadow-lg`}
      >
        <nav className="flex flex-col py-4">
          <Link 
            to="/" 
            className={getLinkClasses('/', true)}
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link 
            to="/products" 
            className={getLinkClasses('/products', true)}
            onClick={toggleMobileMenu}
          >
            Products
          </Link>
          <Link 
            to="/pricing" 
            className={getLinkClasses('/pricing', true)}
            onClick={toggleMobileMenu}
          >
            Pricing
          </Link>
          <a 
            href="https://www.facebook.com/profile.php?id=61576666357859" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mx-6 my-2 py-2 px-4 text-center bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition duration-300 font-medium"
            onClick={toggleMobileMenu}
          >
            Order Now
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header; 