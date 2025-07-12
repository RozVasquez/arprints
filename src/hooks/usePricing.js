import { useMemo } from 'react';
import productData from '../data/products';

export const usePricing = (selectedCategory, activeSubtype) => {
  const compactPricing = useMemo(() => {
    if (selectedCategory === 'instax') {
      const instaxData = productData.instaxInspired.items;
      
      // Always show classic pricing for all instax subtypes as starting prices
        const squareClassic = instaxData[0]?.options.filter(opt => opt.type.includes('Classic White'))[0];
        const wideClassic = instaxData[1]?.options.filter(opt => opt.type.includes('Classic White'))[0];
        const miniClassic = instaxData[2]?.options.filter(opt => opt.type.includes('Classic White'))[0];
        return [
          { name: 'Mini', price: miniClassic?.price, quantity: miniClassic?.quantity },
          { name: 'Square', price: squareClassic?.price, quantity: squareClassic?.quantity },
          { name: 'Wide', price: wideClassic?.price, quantity: wideClassic?.quantity }
        ].filter(item => item.price);
      
    } else if (selectedCategory === 'strips') {
      const stripsData = productData.photoStrips.items;
      
      // Always show classic pricing for all strips subtypes as starting prices
        const classicStrip = stripsData[0]?.options.filter(opt => opt.type.includes('Classic'))[0];
        const classicMini = stripsData[1]?.options.filter(opt => opt.type.includes('Classic'))[0];
        return [
          { name: 'Classic Strip', price: classicStrip?.price, quantity: classicStrip?.quantity },
          { name: 'Mini Strip', price: classicMini?.price, quantity: classicMini?.quantity }
        ].filter(item => item.price);
    }
    
    return [];
  }, [selectedCategory]);

  return { compactPricing };
}; 