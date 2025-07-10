import { useMemo } from 'react';
import productData from '../data/products';

export const usePricing = (selectedCategory, activeSubtype) => {
  const compactPricing = useMemo(() => {
    if (selectedCategory === 'instax') {
      const instaxData = productData.instaxInspired.items;
      
      if (activeSubtype === 'plain') {
        // Classic pricing - get common pricing
        const squareClassic = instaxData[0]?.options.filter(opt => opt.type.includes('Classic White'))[0];
        const wideClassic = instaxData[1]?.options.filter(opt => opt.type.includes('Classic White'))[0];
        const miniClassic = instaxData[2]?.options.filter(opt => opt.type.includes('Classic White'))[0];
        return [
          { name: 'Mini', price: miniClassic?.price, quantity: miniClassic?.quantity },
          { name: 'Square', price: squareClassic?.price, quantity: squareClassic?.quantity },
          { name: 'Wide', price: wideClassic?.price, quantity: wideClassic?.quantity }
        ].filter(item => item.price);
      } else if (activeSubtype === 'designed') {
        // Designed pricing
        const squareDesign = instaxData[0]?.options.filter(opt => opt.type.includes('Instax Design'))[0];
        const wideDesign = instaxData[1]?.options.filter(opt => opt.type.includes('Instax Design'))[0];
        const miniDesign = instaxData[2]?.options.filter(opt => opt.type.includes('Instax Design'))[0];
        return [
          { name: 'Mini', price: miniDesign?.price, quantity: miniDesign?.quantity },
          { name: 'Square', price: squareDesign?.price, quantity: squareDesign?.quantity },
          { name: 'Wide', price: wideDesign?.price, quantity: wideDesign?.quantity }
        ].filter(item => item.price);
      }
    } else if (selectedCategory === 'strips') {
      const stripsData = productData.photoStrips.items;
      
      if (activeSubtype === 'plain') {
        // Classic pricing
        const classicStrip = stripsData[0]?.options.filter(opt => opt.type.includes('Classic'))[0];
        const classicMini = stripsData[1]?.options.filter(opt => opt.type.includes('Classic'))[0];
        return [
          { name: 'Classic Strip', price: classicStrip?.price, quantity: classicStrip?.quantity },
          { name: 'Mini Strip', price: classicMini?.price, quantity: classicMini?.quantity }
        ].filter(item => item.price);
      } else if (activeSubtype === 'designed') {
        // Designed pricing
        const designStrip = stripsData[0]?.options.filter(opt => opt.type.includes('with Design'))[0];
        const designMini = stripsData[1]?.options.filter(opt => opt.type.includes('with Design'))[0];
        return [
          { name: 'Design Strip', price: designStrip?.price, quantity: designStrip?.quantity },
          { name: 'Mini Design', price: designMini?.price, quantity: designMini?.quantity }
        ].filter(item => item.price);
      }
    }
    
    return [];
  }, [selectedCategory, activeSubtype]);

  return { compactPricing };
}; 