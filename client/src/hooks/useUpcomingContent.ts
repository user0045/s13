
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UpcomingContent {
  id: string;
  title: string;
  description: string;
  release_date: string;
  content_type: 'Movie' | 'Web Series' | 'Show';
  thumbnail_url?: string;
  trailer_url?: string;
  content_order: number;
  genre: string[];
  cast_members: string[];
  directors: string[];
  writers: string[];
  rating_type?: string;
  created_at: string;
}

export const useUpcomingContent = () => {
  return useQuery({
    queryKey: ['upcoming-content'],
    staleTime: 0, // Always fetch fresh data
    refetchInterval: 5 * 1000, // Refetch every 5 seconds for real-time updates
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    queryFn: async () => {
      console.log('Fetching upcoming content from database...');
      const { data, error } = await supabase
        .from('upcoming_content')
        .select('*')
        .order('content_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching upcoming content:', error);
        throw error;
      }

      console.log('Fetched upcoming content:', data);
      return data as UpcomingContent[];
    },
  });
};
