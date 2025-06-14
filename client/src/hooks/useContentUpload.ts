import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BaseContentData {
  title: string;
  description: string;
  releaseYear: string;
  ratingType: string;
  rating: string;
  directors: string[];
  writers: string[];
  cast: string[];
  thumbnailUrl: string;
  trailerUrl: string;
  selectedGenres: string[];
  featuredIn: string[];
}

interface MovieData extends BaseContentData {
  duration: string;
  videoUrl: string;
}

interface WebSeriesData extends BaseContentData {
  seasons: Array<{
    title: string;
    description: string;
    episodes: Array<{
      title: string;
      duration: string;
      description: string;
      videoUrl: string;
      thumbnailUrl: string;
    }>;
  }>;
}

interface ShowData extends BaseContentData {
  episodes: Array<{
    title: string;
    duration: string;
    description: string;
    videoUrl: string;
    thumbnailUrl: string;
  }>;
}

export const useUploadMovie = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: MovieData) => {
      console.log("Uploading movie:", data);

      // First, create the movie record
      const { data: movieResult, error: movieError } = await supabase
        .from("movie")
        .insert([
          {
            description: data.description,
            release_year: parseInt(data.releaseYear),
            rating_type: data.ratingType as any,
            rating: parseFloat(data.rating),
            duration: parseInt(data.duration),
            director: data.directors,
            writer: data.writers,
            cast_members: data.cast,
            thumbnail_url: data.thumbnailUrl,
            trailer_url: data.trailerUrl,
            video_url: data.videoUrl,
            feature_in: data.featuredIn,
          },
        ])
        .select()
        .single();

      if (movieError) throw movieError;

      // Then, create the upload_content record with the movie's content_id
      const { data: uploadResult, error: uploadError } = await supabase
        .from("upload_content")
        .insert([
          {
            title: data.title,
            content_type: "Movie" as any,
            genre: data.selectedGenres,
            content_id: movieResult.content_id,
          },
        ])
        .select()
        .single();

      if (uploadError) throw uploadError;

      return { movie: movieResult, upload: uploadResult };
    },
    onSuccess: () => {
      // Invalidate all content-related queries for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['all-content'] });
      queryClient.invalidateQueries({ queryKey: ['content-by-feature'] });
      queryClient.invalidateQueries({ queryKey: ['content-by-genre'] });
      toast({
        title: "Success",
        description: "Movie uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (error) => {
      console.error("Error uploading movie:", error);
      toast({
        title: "Error",
        description: "Failed to upload movie",
        variant: "destructive",
      });
    },
  });
};

export const useUploadWebSeries = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: WebSeriesData) => {
      console.log("Uploading web series:", data);

      const seasonIds: string[] = [];

      // Process each season
      for (const seasonData of data.seasons) {
        const episodeIds: string[] = [];

        // First, create episodes for this season
        for (const episodeData of seasonData.episodes) {
          const { data: episodeResult, error: episodeError } = await supabase
            .from("episode")
            .insert([
              {
                title: episodeData.title,
                duration: parseInt(episodeData.duration),
                description: episodeData.description,
                video_url: episodeData.videoUrl,
                thumbnail_url: episodeData.thumbnailUrl,
              },
            ])
            .select()
            .single();

          if (episodeError) {
            console.error("Episode error:", episodeError);
            throw episodeError;
          }
          episodeIds.push(episodeResult.episode_id);
        }

        // Then, create the season with episode IDs and season-specific data
        const { data: seasonResult, error: seasonError } = await supabase
          .from("season")
          .insert([
            {
              season_title: seasonData.title,
              season_description: seasonData.description,
              release_year: parseInt(seasonData.releaseYear || data.releaseYear),
              rating_type: (seasonData.ratingType || data.ratingType) as any,
              rating: parseFloat(seasonData.rating || data.rating),
              director: seasonData.directors || data.directors,
              writer: seasonData.writers || data.writers,
              cast_members: seasonData.cast || data.cast,
              thumbnail_url: seasonData.thumbnailUrl || data.thumbnailUrl,
              trailer_url: seasonData.trailerUrl || data.trailerUrl,
              feature_in: seasonData.featuredIn || data.featuredIn,
              episode_id_list: episodeIds,
            },
          ])
          .select()
          .single();

        if (seasonError) {
          console.error("Season error:", seasonError);
          throw seasonError;
        }
        seasonIds.push(seasonResult.season_id);
      }

      // Create the web series record with season IDs
      const { data: webSeriesResult, error: webSeriesError } = await supabase
        .from("web_series")
        .insert([
          {
            season_id_list: seasonIds,
          },
        ])
        .select()
        .single();

      if (webSeriesError) throw webSeriesError;

      console.log("Web series result:", webSeriesResult);

      // Finally, create the upload_content record with web series content_id
      const { data: uploadResult, error: uploadError } = await supabase
        .from("upload_content")
        .insert([
          {
            title: data.title,
            content_type: "Web Series" as any,
            genre: data.selectedGenres,
            content_id: webSeriesResult.content_id,
          },
        ])
        .select()
        .single();

      console.log("Upload result:", uploadResult);
      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw uploadError;
      }

      return { webSeries: webSeriesResult, upload: uploadResult };
    },
    onSuccess: () => {
      // Invalidate all content-related queries for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['all-content'] });
      queryClient.invalidateQueries({ queryKey: ['content-by-feature'] });
      queryClient.invalidateQueries({ queryKey: ['content-by-genre'] });
      toast({
        title: "Success",
        description: "Web series uploaded successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (error) => {
      console.error("Error uploading web series:", error);
      toast({
        title: "Error",
        description: "Failed to upload web series",
        variant: "destructive",
      });
    },
  });
};

export const useUploadShow = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: ShowData) => {
      console.log("Uploading show:", data);

      const episodeIds: string[] = [];

      // First, create all episodes in the episode table
      for (const episodeData of data.episodes) {
        const { data: episodeResult, error: episodeError } = await supabase
          .from("episode")
          .insert([
            {
              title: episodeData.title,
              duration: parseInt(episodeData.duration),
              description: episodeData.description,
              video_url: episodeData.videoUrl,
              thumbnail_url: episodeData.thumbnailUrl,
            },
          ])
          .select()
          .single();

        if (episodeError) throw episodeError;
        episodeIds.push(episodeResult.episode_id);
      }

      // Then, create the show record in the show table with all episode IDs (no genres here)
      const { data: showResult, error: showError } = await supabase
        .from("show")
        .insert([
          {
            title: data.title,
            description: data.description,
            content_type: "Show" as any,
            release_year: parseInt(data.releaseYear),
            rating_type: data.ratingType as any,
            rating: parseFloat(data.rating),
            thumbnail_url: data.thumbnailUrl,
            trailer_url: data.trailerUrl,
            directors: data.directors,
            writers: data.writers,
            cast_members: data.cast,
            feature_in: data.featuredIn,
            episode_id_list: episodeIds,
          },
        ])
        .select()
        .single();

      console.log("Show result:", showResult);

      if (showError) throw showError;

      // Finally, create the upload_content record with show id
      const { data: uploadResult, error: uploadError } = await supabase
        .from("upload_content")
        .insert([
          {
            title: data.title,
            content_type: "Show" as any,
            genre: data.selectedGenres,
            content_id: showResult.id,
          },
        ])
        .select()
        .single();

      console.log("Show upload result:", uploadResult);
      if (uploadError) {
        console.error("Show upload error:", uploadError);
        throw uploadError;
      }

      return { show: showResult, upload: uploadResult };
    },
    onSuccess: () => {
      // Invalidate all content-related queries for immediate UI updates
      queryClient.invalidateQueries({ queryKey: ['all-content'] });
      queryClient.invalidateQueries({ queryKey: ['content-by-feature'] });
      queryClient.invalidateQueries({ queryKey: ['content-by-genre'] });
      toast({ title: "Success", description: "Show uploaded successfully!" });
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
    onError: (error) => {
      console.error("Error uploading show:", error);
      toast({
        title: "Error",
        description: "Failed to upload show",
        variant: "destructive",
      });
    },
  });
};