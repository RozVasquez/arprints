import { supabase } from './supabase';

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