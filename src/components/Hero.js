import React from 'react';

function Hero() {
  return (
    <section id="hero" className="min-h-screen flex items-center bg-gradient-to-br from-pink-100 via-purple-100 to-violet-200">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mb-4">Your Memories, Beautifully Printed.</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">Affordable handcrafted Photocards, Instax Inspired, and Strips delivered with love.</p>
        <a 
          href="https://www.facebook.com/profile.php?id=61576666357859" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-pink-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-pink-600 transform hover:-translate-y-1 transition-all duration-300"
        >
          Order Now
        </a>
      </div>
    </section>
  );
}

export default Hero; 