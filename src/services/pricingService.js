import { supabase } from './supabase';

// Product Categories
export const getProductCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching product categories:', error);
    return { data: null, error };
  }
};

export const createProductCategory = async (categoryData) => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .insert([categoryData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating product category:', error);
    return { data: null, error };
  }
};

export const updateProductCategory = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('product_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating product category:', error);
    return { data: null, error };
  }
};

export const deleteProductCategory = async (id) => {
  try {
    const { error } = await supabase
      .from('product_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting product category:', error);
    return { error };
  }
};

// Product Types
export const getProductTypes = async (categoryId = null) => {
  try {
    let query = supabase
      .from('product_types')
      .select(`
        *,
        product_categories!inner(*)
      `)
      .order('sort_order', { ascending: true });

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching product types:', error);
    return { data: null, error };
  }
};

export const createProductType = async (typeData) => {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .insert([typeData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating product type:', error);
    return { data: null, error };
  }
};

export const updateProductType = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('product_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating product type:', error);
    return { data: null, error };
  }
};

export const deleteProductType = async (id) => {
  try {
    const { error } = await supabase
      .from('product_types')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting product type:', error);
    return { error };
  }
};

// Pricing Options
export const getPricingOptions = async (productTypeId = null) => {
  try {
    let query = supabase
      .from('pricing_options')
      .select(`
        *,
        product_types!inner(*)
      `)
      .order('sort_order', { ascending: true });

    if (productTypeId) {
      query = query.eq('product_type_id', productTypeId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching pricing options:', error);
    return { data: null, error };
  }
};

export const createPricingOption = async (optionData) => {
  try {
    const { data, error } = await supabase
      .from('pricing_options')
      .insert([optionData])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating pricing option:', error);
    return { data: null, error };
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
    return { data, error: null };
  } catch (error) {
    console.error('Error updating pricing option:', error);
    return { data: null, error };
  }
};

export const deletePricingOption = async (id) => {
  try {
    const { error } = await supabase
      .from('pricing_options')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting pricing option:', error);
    return { error };
  }
};

// Get complete pricing data for frontend
export const getCompletePricingData = async () => {
  try {
    const { data: categories, error: categoriesError } = await getProductCategories();
    if (categoriesError) throw categoriesError;

    const { data: types, error: typesError } = await getProductTypes();
    if (typesError) throw typesError;

    const { data: options, error: optionsError } = await getPricingOptions();
    if (optionsError) throw optionsError;

    // Structure the data for frontend consumption
    const structuredData = categories.map(category => ({
      ...category,
      product_types: types
        .filter(type => type.category_id === category.id)
        .map(type => ({
          ...type,
          pricing_options: options.filter(option => option.product_type_id === type.id)
        }))
    }));

    return { data: structuredData, error: null };
  } catch (error) {
    console.error('Error fetching complete pricing data:', error);
    return { data: null, error };
  }
};

// Get pricing data for a specific category
export const getPricingDataByCategory = async (categoryName) => {
  try {
    const { data: category, error: categoryError } = await supabase
      .from('product_categories')
      .select('*')
      .eq('name', categoryName)
      .single();

    if (categoryError) throw categoryError;

    const { data: types, error: typesError } = await getProductTypes(category.id);
    if (typesError) throw typesError;

    const { data: options, error: optionsError } = await getPricingOptions();
    if (optionsError) throw optionsError;

    const structuredData = {
      ...category,
      product_types: types.map(type => ({
        ...type,
        pricing_options: options.filter(option => option.product_type_id === type.id)
      }))
    };

    return { data: structuredData, error: null };
  } catch (error) {
    console.error('Error fetching pricing data by category:', error);
    return { data: null, error };
  }
};

// Get lowest price for a product type
export const getLowestPrice = (pricingOptions) => {
  if (!pricingOptions || pricingOptions.length === 0) return null;
  
  const sortedOptions = pricingOptions
    .filter(option => option.is_active !== false)
    .sort((a, b) => a.price - b.price);
  
  return sortedOptions[0] || null;
};

// Format price for display
export const formatPrice = (price) => {
  return `₱${parseFloat(price).toFixed(2)}`;
}; 