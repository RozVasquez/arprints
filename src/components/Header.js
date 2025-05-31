import React from 'react';

function Header() {
  return (
    <header id="header" className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <a href="#hero" className="text-2xl font-bold text-pink-600">AR Prints</a>
        <nav className="hidden md:flex space-x-8">
          <a href="#hero" className="text-gray-600 hover:text-pink-600 transition duration-300">Home</a>
          <a href="#about" className="text-gray-600 hover:text-pink-600 transition duration-300">About</a>
          <a href="#pricing" className="text-gray-600 hover:text-pink-600 transition duration-300">Pricing</a>
          <a href="#footer" className="text-gray-600 hover:text-pink-600 transition duration-300">Contact</a>
        </nav>
      </div>
    </header>
  );
}

export default Header; 