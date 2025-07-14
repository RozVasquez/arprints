import { supabase } from './supabase';

// Helper function to format price with peso sign
const formatPrice = (price) => {
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

// Product Categories
export const getProductCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    throw error;
  }
};

// Create a new product category with auto-incremented sort_order
export async function createProductCategory({ name, title, description = '', color = 'gray', is_active = true }) {
  // Get the current max sort_order
  const { data: maxOrderData, error: maxOrderError } = await supabase
    .from('product_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1);

  if (maxOrderError) throw maxOrderError;
  const nextSortOrder = maxOrderData && maxOrderData.length > 0 ? (maxOrderData[0].sort_order || 0) + 1 : 1;

  // Insert the new category
  const { data, error } = await supabase
    .from('product_categories')
    .insert([
      { name, title, description, color, sort_order: nextSortOrder, is_active }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export const updateProductCategory = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product category:', error);
    throw error;
  }
};

export const deleteProductCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product category:', error);
    throw error;
  }
};

// Products
export const getProducts = async (categoryId = null) => {
  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          title,
          color
        )
      `)
      .order('sort_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        product_categories (
          id,
          name,
          title,
          color
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Pricing Options
export const getPricingOptions = async (productId = null) => {
  try {
    let query = supabase
      .from('pricing_options')
      .select(`
        *,
        products!pricing_options_product_id_fkey (
          id,
          product_id,
          name,
          description,
          color
        )
      `)
      .order('sort_order', { ascending: true });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching pricing options:', error);
    throw error;
  }
};

export const createPricingOption = async (pricingData) => {
  try {
    const { data, error } = await supabase
      .from('pricing_options')
      .insert([pricingData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating pricing option:', error);
    throw error;
  }
};

export const updatePricingOption = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('pricing_options')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating pricing option:', error);
    throw error;
  }
};

export const deletePricingOption = async (id) => {
  try {
    const { error } = await supabase
      .from('pricing_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting pricing option:', error);
    throw error;
  }
};

// Get complete pricing data (for the pricing page)
export const getCompletePricingData = async () => {
  try {
    // Get all categories with their products and pricing options
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select(`
        *,
        products (
          *,
          pricing_options (*)
        )
      `)
      .order('sort_order', { ascending: true });

    if (categoriesError) throw categoriesError;

    // Transform data to match the original products.js structure
    const transformedData = {};
    
    categories.forEach(category => {
      if (category.products && category.products.length > 0) {
        transformedData[category.name] = {
          title: category.title,
          items: category.products
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map(product => ({
              id: product.product_id,
              name: product.name,
              description: product.description,
              color: product.color,
              options: (product.pricing_options?.slice() || [])
                .sort((a, b) => {
                  // Extract number from quantity string
                  const getQty = q => parseInt((q || '').match(/\d+/)?.[0] || '0', 10);
                  return getQty(a.quantity) - getQty(b.quantity);
                })
                .map(option => ({
                  type: option.type,
                  quantity: option.quantity,
                  price: formatPrice(option.price)
                }))
            }))
        };
      }
    });

    return transformedData;
  } catch (error) {
    console.error('Error fetching complete pricing data:', error);
    throw error;
  }
};

// Bulk operations for easier management
export const createProductWithPricing = async (productData, pricingOptions) => {
  try {
    // First create the product
    const product = await createProduct(productData);
    
    // Then create all pricing options for this product
    const pricingData = pricingOptions.map(option => ({
      ...option,
      product_id: product.id
    }));

    const { data: pricingDataResult, error: pricingError } = await supabase
      .from('pricing_options')
      .insert(pricingData)
      .select();

    if (pricingError) throw pricingError;

    return {
      product,
      pricingOptions: pricingDataResult
    };
  } catch (error) {
    console.error('Error creating product with pricing:', error);
    throw error;
  }
};

export const updateProductWithPricing = async (productId, productUpdates, pricingOptions) => {
  try {
    // Update the product
    const updatedProduct = await updateProduct(productId, productUpdates);
    
    // Delete existing pricing options
    await supabase
      .from('pricing_options')
      .delete()
      .eq('product_id', productId);

    // Create new pricing options
    const pricingData = pricingOptions.map(option => ({
      ...option,
      product_id: productId
    }));

    const { data: pricingDataResult, error: pricingError } = await supabase
      .from('pricing_options')
      .insert(pricingData)
      .select();

    if (pricingError) throw pricingError;

    return {
      product: updatedProduct,
      pricingOptions: pricingDataResult
    };
  } catch (error) {
    console.error('Error updating product with pricing:', error);
    throw error;
  }
}; 

// Get all products with their pricing options
export const getProductsWithPricing = async () => {
  try {
    // Fetch all products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });
    if (productsError) throw productsError;

    // Fetch all pricing options
    const { data: pricingOptions, error: pricingError } = await supabase
      .from('pricing_options')
      .select('*');
    if (pricingError) throw pricingError;

    // Map pricing options to products
    const productMap = products.map(product => {
      const pricing = pricingOptions.filter(opt => opt.product_id === product.id);
      return {
        ...product,
        folderName: product.folderName || product.name, // fallback if folderName not present
        pricing,
      };
    });
    return productMap;
  } catch (error) {
    console.error('Error fetching products with pricing:', error);
    throw error;
  }
}; 