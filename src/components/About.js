import React from 'react';
import { ScrollReveal } from '../animations';

function About() {
  return (
    <>
      <section id="about" className="py-20 pb-16 bg-white">
        <div className="container mx-auto px-6 mt-20 text-center">
          <ScrollReveal enableBlur={true} baseOpacity={0.2} baseRotation={2} blurStrength={3}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Handcrafted with Love <span className="text-red-500">❤️</span></h2>
          </ScrollReveal>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-8 rounded-full"></div>
          <ScrollReveal enableBlur={true} baseOpacity={0.05} baseRotation={0.5} blurStrength={1.5}>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg pb-16">
              We create photo cards, photo strips, and Instax-style prints that preserve your favorite moments. Whether it's a birthday, concert, or just your pet looking extra cute — we've got the perfect finish.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}

export default About; 