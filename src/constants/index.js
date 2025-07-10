/**
 * Application constants and configuration
 */

// Layout breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 200,
  SLOW: 300,
  EXTRA_SLOW: 500
};

// Image configuration
export const IMAGE_CONFIG = {
  PRIORITY_LOAD_COUNT: 4,
  LAZY_LOAD_THRESHOLD: 50, // pixels
  ASPECT_RATIOS: {
    SQUARE: 1,
    CARD: 4/3,
    WIDE: 16/9
  }
};

// Gallery configuration
export const GALLERY_CONFIG = {
  IMAGES_PER_ROW: {
    MOBILE: 1,
    TABLET: 2,
    DESKTOP: 3,
    LARGE: 4
  },
  MODAL_ZOOM: {
    MIN: 0.5,
    MAX: 4,
    STEP: 0.5
  }
};

// Product categories
export const CATEGORIES = {
  PHOTOCARD: 'photocard',
  INSTAX: 'instax', 
  STRIPS: 'strips'
};

// Pricing types
export const PRICING_TYPES = {
  PLAIN: 'plain',
  DESIGNED: 'designed'
};

// Contact information
export const CONTACT = {
  BUSINESS_NAME: 'AR Prints',
  MESSAGE_CTA: 'Message AR Prints'
}; 