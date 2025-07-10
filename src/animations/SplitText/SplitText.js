import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './SplitText.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Fallback SplitText implementation
class FallbackSplitText {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.words = [];
    this.chars = [];
    this.lines = [];
    
    this.split();
  }
  
  split() {
    if (!this.element) return;
    
    const text = this.element.textContent;
    const { type = 'words' } = this.options;
    
    // Clear existing content
    this.element.innerHTML = '';
    
    if (type.includes('words')) {
      this.splitByWords(text);
    } else if (type.includes('chars')) {
      this.splitByChars(text);
    }
  }
  
  splitByWords(text) {
    const words = text.split(' ');
    
    words.forEach((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      span.style.overflow = 'hidden';
      span.className = 'split-word';
      
      // Add space after word (except last)
      if (index < words.length - 1) {
        span.textContent += ' ';
      }
      
      this.element.appendChild(span);
      this.words.push(span);
    });
  }
  
  splitByChars(text) {
    const chars = text.split('');
    
    chars.forEach(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
      span.style.display = 'inline-block';
      span.className = 'split-char';
      
      this.element.appendChild(span);
      this.chars.push(span);
    });
  }
  
  revert() {
    if (this.element && this.originalText) {
      this.element.innerHTML = this.originalText;
    }
  }
}

// Try to use commercial SplitText, fall back to our implementation
const getSplitTextClass = () => {
  // Check if commercial GSAP SplitText is available
  if (typeof window !== 'undefined' && window.SplitText) {
    return window.SplitText;
  }
  
  // Use our fallback implementation
  return FallbackSplitText;
};

const SplitText = ({ 
  children, 
  delay = 80,
  duration = 0.8,
  splitType = 'words',
  className = '',
  enableScrollTrigger = true 
}) => {
  const elementRef = useRef(null);
  const splitInstanceRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const SplitTextClass = getSplitTextClass();
    
    // Create split text instance
    splitInstanceRef.current = new SplitTextClass(element, {
      type: splitType
    });

    const targets = splitType.includes('words') 
      ? splitInstanceRef.current.words 
      : splitInstanceRef.current.chars;

    if (!targets || targets.length === 0) return;

    // Set initial state for animation
    gsap.set(targets, {
      rotationX: -90,
      opacity: 0,
      transformOrigin: '50% 50% -50px',
      transformStyle: 'preserve-3d'
    });

    // Create animation
    const animation = gsap.to(targets, {
      rotationX: 0,
      opacity: 1,
      duration: duration,
      delay: delay / 1000, // Convert ms to seconds
      stagger: delay / 1000,
      ease: 'power2.out',
      transformOrigin: '50% 50% -50px'
    });

    // Add scroll trigger if enabled
    if (enableScrollTrigger) {
      ScrollTrigger.create({
        trigger: element,
        start: 'top 85%',
        onEnter: () => animation.restart(),
        onLeave: () => animation.reverse(),
        onEnterBack: () => animation.restart(),
        onLeaveBack: () => animation.reverse()
      });
    }

    // Cleanup function
    return () => {
      animation.kill();
      if (splitInstanceRef.current && splitInstanceRef.current.revert) {
        splitInstanceRef.current.revert();
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [delay, duration, splitType, enableScrollTrigger]);

  return (
    <div ref={elementRef} className={`split-text-container ${className}`}>
      {children}
    </div>
  );
};

export default SplitText; 