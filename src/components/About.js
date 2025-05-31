import React from 'react';

function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Handcrafted with Love <span className="text-pink-500">❤️</span></h2>
        <div className="w-24 h-1 bg-pink-500 mx-auto mb-8 rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          We create photo cards, photo strips, and Instax-style prints that preserve your favorite moments. Whether it's a birthday, concert, or just your pet looking extra cute — we've got the perfect finish.
        </p>
      </div>
    </section>
  );
}

export default About; 