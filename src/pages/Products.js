import React from 'react';
import { useParams } from 'react-router-dom';
import DesignGallery from '../components/DesignGallery';

function Products() {
  const { category } = useParams();
  
  // Map URL slugs to category IDs
  const categoryMapping = {
    'photo-cards': 'photocard',
    'instax': 'instax',
    'photo-strips': 'strips'
  };

  const initialCategory = category ? categoryMapping[category] : null;

  return (
    <div>
      <DesignGallery initialCategory={initialCategory} />
    </div>
  );
}

export default Products; 