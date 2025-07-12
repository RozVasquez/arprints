import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({ 
  children, 
  enableBlur = false,
  baseOpacity = 0.05, 
  baseRotation = 0.5, 
  blurStrength = 1.5,
  className = '' 
}) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Detect mobile device
    const isMobile = window.innerWidth < 768;
    
    // Skip animation entirely on mobile - just show content normally
    if (isMobile) {
      gsap.set(element, {
        opacity: 1,
        rotationX: 0,
        filter: 'none'
      });
      return;
    }

    // Desktop animation settings
    const startPoint = "top 85%";
    const endPoint = "top 20%";

    // Set initial state for desktop
    const initialState = {
      opacity: baseOpacity,
      rotationX: baseRotation,
    };

    if (enableBlur) {
      initialState.filter = `blur(${blurStrength}px)`;
    }

    gsap.set(element, initialState);

    // Create scroll trigger animation for desktop
    const animation = gsap.to(element, {
      opacity: 1,
      rotationX: 0,
      filter: enableBlur ? 'blur(0px)' : undefined,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: startPoint,
        end: endPoint,
        scrub: 0.5,
        toggleActions: "play none none reverse"
      }
    });

    // Handle resize events to refresh scroll triggers
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
      window.removeEventListener('resize', handleResize);
    };
  }, [enableBlur, baseOpacity, baseRotation, blurStrength]);

  return (
    <div ref={elementRef} className={`scroll-reveal-element ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal; 