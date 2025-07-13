import { supabase, FEEDBACK_STORAGE_BUCKET } from './supabase';

// Helper function to get feedback image URL
const getFeedbackImageUrl = (path) => {
  if (!path) return null;
  
  // If path is already a full URL, return it
  if (path.startsWith('http')) {
    return path;
  }
  
  // If path is a local path, return it
  if (path.startsWith('/')) {
    return path;
  }
  
  // Otherwise, construct Supabase URL
  const { data } = supabase.storage
    .from(FEEDBACK_STORAGE_BUCKET)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const getFeedbacks = async () => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return [];
  }
};

export const getPublicFeedbacks = async () => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6); // Limit to 6 for display

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching public feedbacks:', error);
    return [];
  }
};

export const insertFeedback = async (feedbackData) => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .insert([feedbackData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error inserting feedback:', error);
    return { success: false, error };
  }
};

export const updateFeedback = async (id, updates) => {
  try {
    const { data, error } = await supabase
      .from('feedbacks')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('Error updating feedback:', error);
    return { success: false, error };
  }
};

export const deleteFeedback = async (id) => {
  try {
    const { error } = await supabase
      .from('feedbacks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting feedback:', error);
    return { success: false, error };
  }
};

// Export the helper function
export { getFeedbackImageUrl }; 