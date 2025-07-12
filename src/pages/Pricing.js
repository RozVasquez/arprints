import React from 'react';
import { useLocation } from 'react-router-dom';
import { PricingCardLayout } from '../components';

function Pricing() {
  const location = useLocation();
  const initialCategory = location.state?.initialCategory;

  return (
    <div>
      <PricingCardLayout initialCategory={initialCategory} />
    </div>
  );
}

export default Pricing; 