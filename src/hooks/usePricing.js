import { useMemo } from 'react';
import productData from '../data/products';
import { getStartingOption, formatPrice } from '../utils';

export const usePricing = (selectedCategory, activeSubtype) => {
  const compactPricing = useMemo(() => {
    if (selectedCategory === 'instax') {
      const instaxData = productData.instaxInspired.items;
      const miniClassic = getStartingOption(instaxData[0]?.options, 'Classic White');
      const squareClassic = getStartingOption(instaxData[1]?.options, 'Classic White');
      const wideClassic = getStartingOption(instaxData[2]?.options, 'Classic White');
      return [
        { name: 'Mini', price: formatPrice(miniClassic?.price), quantity: miniClassic?.quantity },
        { name: 'Square', price: formatPrice(squareClassic?.price), quantity: squareClassic?.quantity },
        { name: 'Wide', price: formatPrice(wideClassic?.price), quantity: wideClassic?.quantity }
      ].filter(item => item.price);
    } else if (selectedCategory === 'strips') {
      const stripsData = productData.photoStrips.items;
      const classicStrip = getStartingOption(stripsData[0]?.options, 'Classic');
      const classicMini = getStartingOption(stripsData[1]?.options, 'Classic');
      return [
        { name: 'Classic Strip', price: formatPrice(classicStrip?.price), quantity: classicStrip?.quantity },
        { name: 'Mini Strip', price: formatPrice(classicMini?.price), quantity: classicMini?.quantity }
      ].filter(item => item.price);
    } else if (selectedCategory === 'photocards' || selectedCategory === 'photocard') {
      const photocardData = productData.photocards.items;
      // For each card type, get its lowest price option
      return photocardData.map(card => {
        const starting = card.options.reduce((min, curr) => {
          const getNumericPrice = (price) => {
            if (!price) return Infinity;
            const match = String(price).replace(/₱|,/g, '').match(/\d+(\.\d+)?/);
            return match ? parseFloat(match[0]) : Infinity;
          };
          return getNumericPrice(curr.price) < getNumericPrice(min.price) ? curr : min;
        }, card.options[0]);
        return {
          name: card.name,
          price: formatPrice(starting.price),
          quantity: starting.quantity
        };
      }).filter(item => item.price);
    }
    return [];
  }, [selectedCategory]);
  return { compactPricing };
}; 