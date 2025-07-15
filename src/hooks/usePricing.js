import { useState, useEffect } from 'react';
import { getPricingDataByCategory, getLowestPrice, formatPrice } from '../services/pricingService';

export const usePricing = (categoryName = null, activeSubtype = null) => {
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoryName) {
      loadPricingData(categoryName);
    }
  }, [categoryName]);

  const loadPricingData = async (category) => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error } = await getPricingDataByCategory(category);
      if (error) throw error;
      
      setPricingData(data);
    } catch (err) {
      setError(err.message);
      console.error('Error loading pricing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartingPrice = (productTypeName) => {
    if (!pricingData || !pricingData.product_types) return null;
    
    const productType = pricingData.product_types.find(type => 
      type.name.toLowerCase().includes(productTypeName.toLowerCase()) ||
      productTypeName.toLowerCase().includes(type.name.toLowerCase())
    );
    
    if (!productType || !productType.pricing_options) return null;
    
    const lowestPrice = getLowestPrice(productType.pricing_options);
    return lowestPrice ? formatPrice(lowestPrice.price) : null;
  };

  const getPricingForType = (productTypeName) => {
    if (!pricingData || !pricingData.product_types) return null;
    
    const productType = pricingData.product_types.find(type => 
      type.name.toLowerCase().includes(productTypeName.toLowerCase()) ||
      productTypeName.toLowerCase().includes(type.name.toLowerCase())
    );
    
    return productType ? productType.pricing_options : null;
  };

  // Generate compact pricing data for display
  // If activeSubtype is provided, filter to show only that type's pricing
  // Otherwise, show all types (for overview)
  const compactPricing = pricingData?.product_types
    ?.filter(type => {
      if (!activeSubtype) return true; // Show all if no subtype selected
      
      // Match the subtype name with the product type name
      const typeName = type.name.toLowerCase();
      const subtypeName = activeSubtype.toLowerCase();
      
      // Direct match
      const directMatch = typeName.includes(subtypeName) || subtypeName.includes(typeName);
      if (directMatch) return true;
      
      // Smart mapping for common cases
      const subtypeMappings = {
        'plain': ['matte', 'glossy', 'standard', 'classic'],
        'designed': ['design', '3d', 'glittered'],
        'colored': ['colored', 'color'],
        'classic': ['classic', 'standard'],
        'mini': ['mini', 'small'],
        'wide': ['wide', 'large']
      };
      
      // Check if subtype has a mapping
      const mappedTypes = subtypeMappings[subtypeName] || [];
      const hasMappedMatch = mappedTypes.some(mappedType => 
        typeName.includes(mappedType)
      );
      
      if (hasMappedMatch) return true;
      
      // If no match found, don't show any pricing to avoid confusion
      return false;
    })
    ?.map(type => {
      const lowestPrice = getLowestPrice(type.pricing_options || []);
      return {
        name: type.name,
        quantity: type.pricing_options?.[0]?.quantity || '',
        price: lowestPrice ? formatPrice(lowestPrice.price) : 'Contact for pricing'
      };
    }) || [];

  return {
    pricingData,
    loading,
    error,
    getStartingPrice,
    getPricingForType,
    compactPricing,
    reload: () => categoryName && loadPricingData(categoryName)
  };
}; 