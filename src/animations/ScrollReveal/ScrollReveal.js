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

    // Set initial state
    const initialState = {
      opacity: baseOpacity,
      rotationX: baseRotation,
    };

    if (enableBlur) {
      initialState.filter = `blur(${blurStrength}px)`;
    }

    gsap.set(element, initialState);

    // Create scroll trigger animation
    const animation = gsap.to(element, {
      opacity: 1,
      rotationX: 0,
      filter: enableBlur ? 'blur(0px)' : undefined,
      duration: 1.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        end: "top 20%",
        scrub: 0.5,
        toggleActions: "play none none reverse"
      }
    });

    // Cleanup function
    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === element) {
          trigger.kill();
        }
      });
    };
  }, [enableBlur, baseOpacity, baseRotation, blurStrength]);

  return (
    <div ref={elementRef} className={`scroll-reveal-element ${className}`}>
      {children}
    </div>
  );
};

export default ScrollReveal; 