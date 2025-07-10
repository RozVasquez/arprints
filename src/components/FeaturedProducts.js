import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlobImage from './BlobImage';
import galleryData from '../data/galleryData';

function FeaturedProducts() {
  const [autoHoverIndex, setAutoHoverIndex] = useState(0);
  const [isUserHovering, setIsUserHovering] = useState(false);
  // Product categories with their details and URL slugs
  const productCategories = [
    {
      id: 'photocard',
      title: 'Photo Cards',
      description: 'High-quality printed photo cards',
      categoryImage: galleryData.photocard.categoryImage,
      slug: 'photo-cards'
    },
    {
      id: 'instax',
      title: 'Instax',
      description: 'Instax Inspired Prints',
      categoryImage: galleryData.instax.categoryImage,
      slug: 'instax'
    },
    {
      id: 'strips',
      title: 'Photo Strips',
      description: 'Classic and Designed Photo Strips',
      categoryImage: galleryData.strips.categoryImage,
      slug: 'photo-strips'
    }
  ];

  // Auto-hover animation for category cards
  useEffect(() => {
    if (!isUserHovering) {
      const interval = setInterval(() => {
        setAutoHoverIndex((prevIndex) => 
          (prevIndex + 1) % productCategories.length
        );
      }, 2000); // Change every 2 seconds

      return () => clearInterval(interval);
    }
  }, [isUserHovering, productCategories.length]);

  return (
    <section id="featured-products" className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Featured Products</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our most popular printing services, each crafted with attention to detail and premium materials.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {productCategories.map((category, index) => (
            <Link
              key={category.id}
              to={`/products/${category.slug}`}
              className={`group cursor-pointer transform transition-all duration-500 hover:-translate-y-2 hover:scale-105 ${
                autoHoverIndex === index && !isUserHovering ? '-translate-y-2 scale-105' : ''
              }`}
              onMouseEnter={() => setIsUserHovering(true)}
              onMouseLeave={() => setIsUserHovering(false)}
            >
              <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                {/* Image Container */}
                <div className="relative w-full aspect-[16/9] overflow-hidden rounded-t-xl">
                  <BlobImage
                    src={category.categoryImage}
                    alt={category.title}
                    className={`w-full h-full transition-transform duration-500 ${
                      autoHoverIndex === index && !isUserHovering ? 'scale-110' : 'group-hover:scale-110'
                    }`}
                    priority={true}
                  />
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-pink-600 transition-all duration-500 rounded-t-xl ${
                    autoHoverIndex === index && !isUserHovering ? 'bg-opacity-20' : 'bg-opacity-0 group-hover:bg-opacity-20'
                  }`}></div>
                </div>
                
                {/* Content */}
                <div className="p-6 rounded-b-xl">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{category.title}</h3>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* View All Products Button */}
        <div className="text-center mt-10">
          <Link
            to="/products"
            className="inline-flex items-center text-pink-500 font-medium text-base px-8 py-3 rounded-lg shadow-sm border border-pink-500 hover:bg-pink-500 hover:text-white transform hover:-translate-y-1 transition-all duration-300"
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