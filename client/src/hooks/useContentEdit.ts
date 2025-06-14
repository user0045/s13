
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useContentForEdit = (contentId: string, contentType: string) => {
  return useQuery({
    queryKey: ['content-edit', contentId, contentType],
    queryFn: async () => {
      console.log('Fetching content for edit:', { contentId, contentType });

      // First get upload_content data
      const { data: uploadContent, error: uploadError } = await supabase
        .from('upload_content')
        .select('*')
        .eq('id', contentId)
        .single();

      if (uploadError) throw uploadError;

      let contentData = null;

      if (contentType === 'Movie') {
        const { data: movieData, error: movieError } = await supabase
          .from('movie')
          .select('*')
          .eq('content_id', uploadContent.content_id)
          .single();

        if (movieError) throw movieError;
        contentData = movieData;
      } else if (contentType === 'Web Series') {
        const { data: webSeriesData, error: webSeriesError } = await supabase
          .from('web_series')
          .select('*')
          .eq('content_id', uploadContent.content_id)
          .single();

        if (webSeriesError) throw webSeriesError;

        // Fetch seasons if they exist
        const seasons = [];
        if (webSeriesData.season_id_list && webSeriesData.season_id_list.length > 0) {
          for (const seasonId of webSeriesData.season_id_list) {
            const { data: seasonData, error: seasonError } = await supabase
              .from('season')
              .select('*')
              .eq('season_id', seasonId)
              .single();

            if (!seasonError && seasonData) {
              // Fetch episodes for this season
              const episodes = [];
              if (seasonData.episode_id_list && seasonData.episode_id_list.length > 0) {
                for (const episodeId of seasonData.episode_id_list) {
                  const { data: episodeData, error: episodeError } = await supabase
                    .from('episode')
                    .select('*')
                    .eq('episode_id', episodeId)
                    .single();

                  if (!episodeError && episodeData) {
                    episodes.push({
                      title: episodeData.title || '',
                      duration: episodeData.duration?.toString() || '',
                      description: episodeData.description || '',
                      videoUrl: episodeData.video_url || '',
                      thumbnailUrl: episodeData.thumbnail_url || ''
                    });
                  }
                }
              }

              seasons.push({
                title: seasonData.season_title || '',
                description: seasonData.season_description || '',
                releaseYear: seasonData.release_year?.toString() || '',
                ratingType: seasonData.rating_type || '',
                rating: seasonData.rating?.toString() || '',
                directors: seasonData.director || [],
                writers: seasonData.writer || [],
                cast: seasonData.cast_members || [],
                thumbnailUrl: seasonData.thumbnail_url || '',
                trailerUrl: seasonData.trailer_url || '',
                featuredIn: seasonData.feature_in || [],
                episodes: episodes.length > 0 ? episodes : [{ title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }]
              });
            }
          }
        }

        contentData = {
          ...webSeriesData,
          seasons: seasons.length > 0 ? seasons : [{ 
            title: '', 
            description: '', 
            releaseYear: '',
            ratingType: '',
            rating: '',
            directors: [],
            writers: [],
            cast: [],
            thumbnailUrl: '',
            trailerUrl: '',
            featuredIn: [],
            episodes: [{ title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }] 
          }]
        };
      } else if (contentType === 'Show') {
        const { data: showData, error: showError } = await supabase
          .from('show')
          .select('*')
          .eq('id', uploadContent.content_id)
          .single();

        if (showError) throw showError;

        // Fetch episodes if they exist
        const episodes = [];
        if (showData.episode_id_list && showData.episode_id_list.length > 0) {
          for (const episodeId of showData.episode_id_list) {
            const { data: episodeData, error: episodeError } = await supabase
              .from('episode')
              .select('*')
              .eq('episode_id', episodeId)
              .single();

            if (!episodeError && episodeData) {
              episodes.push({
                title: episodeData.title || '',
                duration: episodeData.duration?.toString() || '',
                description: episodeData.description || '',
                videoUrl: episodeData.video_url || '',
                thumbnailUrl: episodeData.thumbnail_url || ''
              });
            }
          }
        }

        contentData = {
          ...showData,
          episodes: episodes.length > 0 ? episodes : [{ title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }]
        };
      }

      return {
        uploadContent,
        contentData,
        contentType
      };
    },
    enabled: !!contentId && !!contentType
  });
};
