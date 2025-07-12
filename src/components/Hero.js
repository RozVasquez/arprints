import React from 'react';
import { SplitText } from '../animations';

function Hero() {
  return (
    <section id="hero" className="h-screen flex items-center bg-white -mb-8 md:-mb-12">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center md:items-center justify-between">
        <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0 md:-mt-20">
          <SplitText
            className="text-4xl md:text-6xl font-bold text-gray-800 leading-tight mt-4 mb-4"
            delay={80}
            duration={0.8}
            splitType="words"
            enableScrollTrigger={true}
          >
            Your Memories, Beautifully Printed.
          </SplitText>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto md:mx-0">Affordable handcrafted Photocards, Instax Inspired, and Strips delivered with love.</p>
          <a 
            href="https://www.facebook.com/profile.php?id=61576666357859" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-block bg-pink-500 text-white font-bold text-lg px-8 py-4 rounded-lg shadow-lg hover:bg-pink-600 transform hover:-translate-y-1 transition-all duration-300"
          >
            Order Now
          </a>
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