import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { getUserIP } from '@/utils/ipUtils';

export const useContentDemands = () => {
  return useQuery({
    queryKey: ['content-demands'],
    queryFn: async () => {
      console.log('Fetching content demands from database...');
      const { data, error } = await supabase
        .from('demand')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching content demands:', error);
        throw error;
      }

      console.log('Fetched content demands:', data);
      console.log('Sample demand record structure:', data?.[0]);
      return data;
    },
  });
};

export const useCreateContentDemand = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (demandData: {
      title: string;
      content_type: 'Movie' | 'Web Series' | 'Show';
      description?: string;
    }) => {
      console.log('Creating content demand:', demandData);

      // Get user IP
      const userIP = await getUserIP();

      // Check if user has made a request in the last 30 minutes
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
      const { data: recentRequests, error: checkError } = await supabase
        .from('demand')
        .select('id')
        .eq('user_ip', userIP)
        .gte('created_at', thirtyMinutesAgo)
        .limit(1);

      if (checkError) {
        console.error('Error checking recent requests:', checkError);
        throw checkError;
      }

      if (recentRequests && recentRequests.length > 0) {
        throw new Error('You can only make one request every 30 minutes. Please try again later.');
      }

      const { data, error } = await supabase
        .from('demand')
        .insert([{
          title: demandData.title,
          content_type: demandData.content_type,
          description: demandData.description,
          user_ip: userIP,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating content demand:', error);
        throw error;
      }

      console.log('Created content demand:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['content-demands'] });
    },
  });
};

export const useDeleteDemand = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting demand with id:', id);
      
      // First check if the record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('demand')
        .select('id')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('Error checking record existence:', checkError);
        throw new Error('Record not found or database error');
      }

      if (!existingRecord) {
        throw new Error('Record not found');
      }

      // Now delete the record
      const { data, error } = await supabase
        .from('demand')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }

      // Check if any rows were actually deleted
      if (!data || data.length === 0) {
        throw new Error('No rows were deleted');
      }

      console.log('Delete result:', data);
      return id;
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Request deleted successfully!" });
      queryClient.invalidateQueries({ queryKey: ['content-demands'] });
    },
    onError: (error: any) => {
      console.error('Error deleting demand:', error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to delete request", 
        variant: "destructive" 
      });
    },
  });
};