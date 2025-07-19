import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '../animations';
import FeedbackImageViewer from './FeedbackImageViewer';
import { getPublicFeedbacks, getFeedbackImageUrl } from '../services/feedbackService';
import LoadingSpinner from './ui/LoadingSpinner';

function FeedbackSection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  
  // Load feedbacks on component mount
  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        setLoading(true);
        const data = await getPublicFeedbacks();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error loading feedbacks:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadFeedbacks();
  }, []);

  // Track window size for desktop/mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to get initials from name
  const getInitials = (name) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  };

  const HeartIcon = () => (
    <svg className="w-5 h-5 fill-red-500 text-red-500" viewBox="0 0 24 24">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );

  // Handle feedback click
  const handleFeedbackClick = (feedback) => {
    if (feedback.image_path) {
      setSelectedImage(getFeedbackImageUrl(feedback.image_path));
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedImage(null);
  };

  // Show loading state
  if (loading) {
    return (
      <section className="w-full py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <LoadingSpinner size="lg" className="mb-4" />
            <p className="text-gray-600">Loading feedbacks...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="w-full py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Feedbacks</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Show no feedbacks state
  if (feedbacks.length === 0) {
    return (
      <section className="w-full py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              What Our Customers Say
            </h2>
            <p className="text-gray-600">No feedbacks available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="feedback" className="w-full py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <ScrollReveal enableBlur={true} baseOpacity={0.2} baseRotation={2} blurStrength={3}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              What Our Customers Say
            </h2>
          </ScrollReveal>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-8 rounded-full"></div>
          <ScrollReveal enableBlur={true} baseOpacity={0.05} baseRotation={0.5} blurStrength={1.5}>
            <p className="max-w-2xl mx-auto text-gray-600 text-lg">
              Hear from our happy customers who love their <br /> beautifully printed memories.
            </p>
          </ScrollReveal>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-start">
          {feedbacks.map((feedback, index) => (
            <ScrollReveal 
              key={feedback.id} 
              enableBlur={true} 
              baseOpacity={0.1} 
              baseRotation={1} 
              blurStrength={2}
            >
              <div 
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center h-full flex flex-col min-h-[280px] cursor-pointer group"
                onClick={() => handleFeedbackClick(feedback)}
              >
                {/* Avatar */}
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 font-semibold text-lg">{getInitials(feedback.name)}</span>
                </div>
                
                {/* Hearts */}
                <div className="flex items-center justify-center mb-4">
                  {[...Array(feedback.hearts)].map((_, i) => (
                    <HeartIcon key={i} />
                  ))}
                </div>
                
                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{feedback.name}</h3>
                
                {/* Description */}
                <p className="text-gray-600 flex-grow leading-relaxed text-sm break-words hyphens-auto overflow-wrap-anywhere">
                  "{feedback.text}"
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Feedback Image Viewer Modal */}
      <FeedbackImageViewer 
        selectedImage={selectedImage} 
        onClose={closeModal} 
      />
    </section>
  );
}

export default FeedbackSection; 