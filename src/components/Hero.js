import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SplitText } from '../animations';

function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <section id="hero" className="min-h-screen flex items-center bg-white -mb-8 md:-mb-12 pt-8 md:pt-0">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center md:items-center justify-between">
        <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0 md:-mt-20">
          <SplitText
            className="text-4xl md:text-6xl font-bold text-pink-800 leading-tight mt-6 md:mt-4 mb-4"
            delay={80}
            duration={0.8}
            splitType="words"
            enableScrollTrigger={!isMobile}
          >
            Your Memories, Beautifully Printed.
          </SplitText>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto md:mx-0 md-px-20">Affordable handcrafted Photocards, Instax Inspired, and Strips delivered with love.</p>
          
          <div className="flex flex-col md:flex-row items-center md:items-start justify-start gap-4 md:gap-4">
            <a 
              href="https://www.facebook.com/arprintservices/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full md:w-auto inline-block bg-pink-500 border-2 border-transparent text-white font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:bg-pink-600 transform hover:-translate-y-1 transition-all duration-300 text-center"
            >
              Order Now
            </a>
            <Link 
              to="/products"
              className="w-full md:w-auto inline-block bg-transparent border-2 border-pink-500 text-pink-600 font-bold text-lg px-12 py-4 rounded-lg shadow-lg hover:bg-pink-50 hover:border-pink-600 hover:text-pink-700 transform hover:-translate-y-1 transition-all duration-300 text-center"
            >
              View Products
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center">
          <img 
            src="/images/Hero.png" 
            alt="AR Prints Photos" 
            className="w-[95%] md:w-[90%] max-w-none md:max-w-xl lg:max-w-2xl object-contain transform hover:scale-105 transition-transform duration-300 px-0 md:px-0"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero; 