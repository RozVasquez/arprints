import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from './ui/LoadingSpinner';

function FeaturedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Hardcoded product categories with manual images
  const productCategories = [
    {
      id: 'photocards',
      title: 'Photo Cards',
      description: 'High-quality printed photo cards with premium finishes',
      categoryImage: '/images/designs/Covers/Cards.png',
      slug: 'photo-cards'
    },
    {
      id: 'instax',
      title: 'Instax',
      description: 'Instax Inspired Prints with vibrant colors',
      categoryImage: '/images/designs/Covers/Instax.png',
      slug: 'instax'
    },
    {
      id: 'strips',
      title: 'Photo Strips',
      description: 'Classic and Designed Photo Strips for memories',
      categoryImage: '/images/designs/Covers/Strips.png',
      slug: 'photo-strips'
    }
  ];

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || productCategories.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productCategories.length);
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, productCategories.length]);

  // Navigation functions
  const goToSlide = useCallback((index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 5 seconds of inactivity
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, []);

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % productCategories.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, [productCategories.length]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + productCategories.length) % productCategories.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  }, [productCategories.length]);

  return (
    <section id="featured-products" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our most popular printing services, each crafted with attention to detail and premium materials.
        </p>
        
        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel */}
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {productCategories.map((category, index) => (
                <div key={category.id} className="w-full flex-shrink-0">
                  <Link
                    to={`/products/${category.slug}`}
                    className="block group"
                  >
                    <div className="relative">
                      {/* Image */}
                      <div className="relative w-full aspect-[16/9] overflow-hidden">
                        <img
                          src={category.categoryImage}
                          alt={category.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading={index === currentSlide ? "eager" : "lazy"}
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      </div>
                      
                      {/* Content Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-8 text-white hidden md:block">
                        <h3 className="text-2xl md:text-3xl font-bold mb-3">{category.title}</h3>
                        <p className="text-lg opacity-90 mb-4">{category.description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          {productCategories.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={goToPrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-red-600 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 hover:text-red-600 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {productCategories.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {productCategories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* View All Products & See Pricing Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-10">
          <Link
            to="/pricing"
            className="inline-flex items-center text-red-600 font-medium text-base px-8 py-3 bg-transparent border border-red-500 hover:bg-red-50 hover:text-red-700 transform hover:-translate-y-1 transition-all duration-300 rounded-lg"
            style={{ fontSize: '14px' }}
          >
            See Pricing
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center text-white font-medium text-base px-8 py-3 rounded-lg shadow-sm border bg-red-500 hover:bg-red-500 hover:text-white transform hover:-translate-y-1 transition-all duration-300"
            style={{ fontSize: '14px' }}
          >
            View All Products
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts; 