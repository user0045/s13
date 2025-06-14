import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useAllContent = () => {
  return useQuery({
    queryKey: ['all-content'],
    staleTime: 10 * 1000, // 10 seconds for more real-time updates
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    queryFn: async () => {
      console.log('Fetching all content...');

      // First, get all upload_content entries ordered by updated_at then created_at (newest first)
      const { data: uploadContent, error: uploadError } = await supabase
        .from('upload_content')
        .select('*')
        .order('updated_at', { ascending: false })
        .order('created_at', { ascending: false });

      if (uploadError) throw uploadError;

      const movies: any[] = [];
      const webSeries: any[] = [];
      const shows: any[] = [];

      // Process each upload_content entry
      for (const content of uploadContent || []) {
        if (content.content_type === 'Movie') {
          // Fetch movie details
          const { data: movieData, error: movieError } = await supabase
            .from('movie')
            .select('*')
            .eq('content_id', content.content_id)
            .single();

          if (!movieError && movieData) {
            movies.push({
              ...content,
              movie: movieData
            });
          }
        } else if (content.content_type === 'Web Series') {
          // Fetch web series details
          const { data: webSeriesData, error: webSeriesError } = await supabase
            .from('web_series')
            .select('*')
            .eq('content_id', content.content_id)
            .single();

          if (!webSeriesError && webSeriesData) {
            // Fetch seasons for this web series
            const seasons: any[] = [];
            if (webSeriesData.season_id_list && webSeriesData.season_id_list.length > 0) {
              for (const seasonId of webSeriesData.season_id_list) {
                const { data: seasonData, error: seasonError } = await supabase
                  .from('season')
                  .select('*')
                  .eq('season_id', seasonId)
                  .single();

                if (!seasonError && seasonData) {
                  // Fetch episodes for this season
                  const episodes: any[] = [];
                  if (seasonData.episode_id_list && seasonData.episode_id_list.length > 0) {
                    for (const episodeId of seasonData.episode_id_list) {
                      const { data: episodeData, error: episodeError } = await supabase
                        .from('episode')
                        .select('*')
                        .eq('episode_id', episodeId)
                        .single();

                      if (!episodeError && episodeData) {
                        episodes.push(episodeData);
                      }
                    }
                  }
                  seasons.push({
                    ...seasonData,
                    episodes
                  });
                }
              }
            }

            webSeries.push({
              ...content,
              web_series: {
                ...webSeriesData,
                seasons
              }
            });
          }
        } else if (content.content_type === 'Show') {
          // For shows, we need to fetch from the show table directly
          const { data: showData, error: showError } = await supabase
            .from('show')
            .select('*')
            .eq('id', content.content_id)
            .single();

          if (!showError && showData) {
            // Fetch episodes for this show
            const episodes: any[] = [];
            if (showData.episode_id_list && showData.episode_id_list.length > 0) {
              for (const episodeId of showData.episode_id_list) {
                const { data: episodeData, error: episodeError } = await supabase
                  .from('episode')
                  .select('*')
                  .eq('episode_id', episodeId)
                  .single();

                if (!episodeError && episodeData) {
                  episodes.push(episodeData);
                }
              }
            }

            shows.push({
              ...content,
              show: {
                ...showData,
                episodes
              }
            });
          }
        }
      }

      console.log('Fetched content:', { movies, shows, webSeries });

      return {
        movies,
        shows,
        webSeries
      };
    },
  });
};

export const useContentByFeature = (feature: string) => {
  return useQuery({
    queryKey: ['content-by-feature', feature],
    queryFn: async () => {
      console.log('Fetching content by feature:', feature);

      if (!feature) {
        return [];
      }

      try {
        // Get all upload_content entries
        const { data: uploadContent, error: uploadError } = await supabase
          .from('upload_content')
          .select('*');

        if (uploadError) {
          console.error('Error fetching upload content:', uploadError);
          throw uploadError;
        }

        const filteredContent: any[] = [];

        // Process each upload_content entry
        for (const content of uploadContent || []) {
          if (content.content_type === 'Movie') {
            // Fetch movie details
            const { data: movieData, error: movieError } = await supabase
              .from('movie')
              .select('*')
              .eq('content_id', content.content_id)
              .single();

            if (!movieError && movieData && movieData.feature_in?.includes(feature)) {
              filteredContent.push({
                ...content,
                movie: movieData
              });
            }
          } else if (content.content_type === 'Show') {
            // Fetch show details
            const { data: showData, error: showError } = await supabase
              .from('show')
              .select('*')
              .eq('id', content.content_id)
              .single();

            if (!showError && showData && showData.feature_in?.includes(feature)) {
              filteredContent.push({
                ...content,
                show: showData
              });
            }
          } else if (content.content_type === 'Web Series') {
            // Fetch web series details
            const { data: webSeriesData, error: webSeriesError } = await supabase
              .from('web_series')
              .select('*')
              .eq('content_id', content.content_id)
              .single();

            if (!webSeriesError && webSeriesData && webSeriesData.feature_in?.includes(feature)) {
              filteredContent.push({
                ...content,
                web_series: webSeriesData
              });
            }
          }
        }

        return filteredContent;
      } catch (error) {
        console.error('Error in useContentByFeature:', error);
        throw error;
      }
    },
    enabled: !!feature,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};

export const useContentByGenre = (genre: string) => {
  return useQuery({
    queryKey: ['content-by-genre', genre],
    queryFn: async () => {
      console.log('Fetching content by genre:', genre);

      if (!genre) {
        return [];
      }

      try {
        // Get upload_content entries that have the specified genre
        const { data: uploadContent, error: uploadError } = await supabase
          .from('upload_content')
          .select('*')
          .contains('genre', [genre]);

        if (uploadError) {
          console.error('Error fetching upload content by genre:', uploadError);
          throw uploadError;
        }

        const filteredContent: any[] = [];

        // Process each upload_content entry
        for (const content of uploadContent || []) {
          if (content.content_type === 'Movie') {
            // Fetch movie details
            const { data: movieData, error: movieError } = await supabase
              .from('movie')
              .select('*')
              .eq('content_id', content.content_id)
              .single();

            if (!movieError && movieData) {
              filteredContent.push({
                ...content,
                movie: movieData
              });
            }
          } else if (content.content_type === 'Show') {
            // Fetch show details
            const { data: showData, error: showError } = await supabase
              .from('show')
              .select('*')
              .eq('id', content.content_id)
              .single();

            if (!showError && showData) {
              filteredContent.push({
                ...content,
                show: showData
              });
            }
          } else if (content.content_type === 'Web Series') {
            // Fetch web series details
            const { data: webSeriesData, error: webSeriesError } = await supabase
              .from('web_series')
              .select('*')
              .eq('content_id', content.content_id)
              .single();

            if (!webSeriesError && webSeriesData) {
              filteredContent.push({
                ...content,
                web_series: webSeriesData
              });
            }
          }
        }

        return filteredContent;
      } catch (error) {
        console.error('Error in useContentByGenre:', error);
        throw error;
      }
    },
    enabled: !!genre,
    staleTime: 30 * 1000, // 30 seconds
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: 60 * 1000, // Refetch every minute
  });
};