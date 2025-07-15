import React from 'react';
import Hero from '../components/Hero';
import Leverage from '../components/Leverage';
import FeaturedProducts from '../components/FeaturedProducts';
import About from '../components/About';
import FAQSection from '../components/FAQSection';

function Home() {
  return (
    <div>
      <Hero />
      <Leverage />
      <FeaturedProducts />
      <About />
      <FAQSection />
    </div>
  );
}

export default Home; 