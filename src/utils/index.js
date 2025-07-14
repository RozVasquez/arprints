export * from './imageUtils';
export * from './supabase';

/**
 * Formats a price value to always display with the peso sign (₱)
 * @param {string|number} price - The price value (can be a string with or without peso sign, or a number)
 * @returns {string} - Formatted price with peso sign
 */
export const formatPrice = (price) => {
  if (!price) return '';
  
  // Convert to string if it's a number
  let priceStr = String(price);
  
  // Remove any existing peso sign and extra spaces
  priceStr = priceStr.replace(/₱/g, '').trim();
  
  // If the price is just a number, format it with peso sign
  if (/^\d+(\.\d+)?$/.test(priceStr)) {
    // Ensure it has 2 decimal places
    const numPrice = parseFloat(priceStr);
    return `₱${numPrice.toFixed(2)}`;
  }
  
  // If it already has a peso sign or other formatting, just ensure it starts with ₱
  if (!priceStr.startsWith('₱')) {
    return `₱${priceStr}`;
  }
  
  return priceStr;
};

/**
 * Extracts the first number from a quantity string (e.g., '10 pcs' => 10)
 */
export function parseQuantity(qty) {
  const match = qty && qty.match(/\d+/);
  return match ? parseInt(match[0], 10) : Infinity;
}

/**
 * Extracts the numeric price from a price string (e.g., '₱60.00' => 60.00)
 */
export function parsePrice(price) {
  const match = price && price.replace(/[₱,]/g, '').match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : Infinity;
}

/**
 * Returns the option with the lowest quantity (and lowest price if tied)
 * Optionally filter by type substring
 */
export function getStartingOption(options, typeMatch = null) {
  if (!options || options.length === 0) return null;
  let filtered = options;
  if (typeMatch) {
    filtered = options.filter(opt => opt.type && opt.type.includes(typeMatch));
  }
  return filtered
    .slice()
    .sort((a, b) => {
      const qtyA = parseQuantity(a.quantity);
      const qtyB = parseQuantity(b.quantity);
      if (qtyA !== qtyB) return qtyA - qtyB;
      return parsePrice(a.price) - parsePrice(b.price);
    })[0];
} 