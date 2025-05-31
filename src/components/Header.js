import React, { useState } from 'react';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header id="header" className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#hero" className="text-2xl font-bold text-pink-600">AR Prints</a>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a href="#hero" className="text-pink-600 hover:text-pink-300 transition duration-300">Home</a>
          <a href="#about" className="text-pink-600 hover:text-pink-300 transition duration-300">About</a>
          <a href="#pricing" className="text-pink-600 hover:text-pink-300 transition duration-300">Pricing</a>
          <a href="#footer" className="text-pink-600 hover:text-pink-300 transition duration-300">Contact</a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-pink-600 focus:outline-none transform transition-transform duration-300 hover:scale-110"
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
          <a 
            href="#hero" 
            className="py-2 px-6 text-center text-pink-600 hover:bg-pink-50 transition duration-300"
            onClick={toggleMobileMenu}
          >
            Home
          </a>
          <a 
            href="#about" 
            className="py-2 px-6 text-center text-pink-600 hover:bg-pink-50 transition duration-300"
            onClick={toggleMobileMenu}
          >
            About
          </a>
          <a 
            href="#pricing" 
            className="py-2 px-6 text-center text-pink-600 hover:bg-pink-50 transition duration-300"
            onClick={toggleMobileMenu}
          >
            Pricing
          </a>
          <a 
            href="#footer" 
            className="py-2 px-6 text-center text-pink-600 hover:bg-pink-50 transition duration-300"
            onClick={toggleMobileMenu}
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export default Header; 