import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import MultiSelectInput from './MultiSelectInput';
import FeatureCheckboxes from './FeatureCheckboxes';
import EpisodeForm from './EpisodeForm';

interface ShowFormProps {
  title: string;
  genres: string[];
  onSuccess?: (data?: any) => void;
  initialData?: any;
}

interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const ShowForm = ({ title, genres, onSuccess, initialData }: ShowFormProps) => {
  const [formData, setFormData] = useState({
    description: '',
    releaseYear: '',
    ratingType: '',
    rating: '',
    directors: [] as string[],
    writers: [] as string[],
    cast: [] as string[],
    thumbnailUrl: '',
    trailerUrl: '',
    selectedGenres: [] as string[],
    featuredIn: [] as string[]
  });

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const { description, releaseYear, ratingType, rating, directors, writers, cast, thumbnailUrl, trailerUrl, selectedGenres, featuredIn } = formData;

  const ratingTypes = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        description: initialData.description || '',
        releaseYear: initialData.releaseYear || '',
        ratingType: initialData.ratingType || '',
        rating: initialData.ratingValue || initialData.rating || '',
        directors: initialData.directors || [],
        writers: initialData.writers || [],
        cast: initialData.cast || [],
        thumbnailUrl: initialData.thumbnailUrl || '',
        trailerUrl: initialData.trailerUrl || '',
        selectedGenres: initialData.selectedGenres || [],
        featuredIn: initialData.featuredIn || []
      });
      setEpisodes(initialData.episodes || []);
    }
  }, [initialData]);

  const addEpisode = () => {
    const newEpisode: Episode = {
      id: `episode-${episodes.length + 1}`,
      title: `Episode ${episodes.length + 1}`,
      duration: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: ''
    };
    setEpisodes([...episodes, newEpisode]);
  };

  const deleteEpisode = (episodeId: string) => {
    setEpisodes(prev => prev.filter(episode => episode.id !== episodeId));
  };

  const updateEpisode = (episodeId: string, updates: Partial<Episode>) => {
    setEpisodes(prev => prev.map(episode => 
      episode.id === episodeId ? { ...episode, ...updates } : episode
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!description.trim()) {
      alert('Please enter a description');
      return;
    }

    if (!releaseYear || parseInt(releaseYear) < 1900) {
      alert('Please enter a valid release year');
      return;
    }

    if (!ratingType) {
      alert('Please select a rating type');
      return;
    }

    if (!rating || parseFloat(rating) < 0 || parseFloat(rating) > 10) {
      alert('Please enter a valid rating (0.0 - 10.0)');
      return;
    }

    if (directors.length === 0) {
      alert('Please add at least one director');
      return;
    }

    if (writers.length === 0) {
      alert('Please add at least one writer');
      return;
    }

    if (cast.length === 0) {
      alert('Please add at least one cast member');
      return;
    }

    if (!thumbnailUrl.trim()) {
      alert('Please enter a thumbnail URL');
      return;
    }

    if (!trailerUrl.trim()) {
      alert('Please enter a trailer URL');
      return;
    }

    if (selectedGenres.length === 0) {
      alert('Please select at least one genre');
      return;
    }

    if (episodes.length === 0) {
      alert('Please add at least one episode');
      return;
    }

    // Validate each episode
    for (const episode of episodes) {
      if (!episode.title.trim()) {
        alert('Please enter a title for all episodes');
        return;
      }

      if (!episode.description.trim()) {
        alert('Please enter a description for all episodes');
        return;
      }

      if (!episode.duration || parseInt(episode.duration) <= 0) {
        alert('Please enter a valid duration for all episodes');
        return;
      }

      if (!episode.videoUrl.trim()) {
        alert('Please enter a video URL for all episodes');
        return;
      }

      if (!episode.thumbnailUrl.trim()) {
        alert('Please enter a thumbnail URL for all episodes');
        return;
      }
    }

    const formattedData = {
      description,
      releaseYear,
      ratingType,
      rating,
      directors,
      writers,
      cast,
      thumbnailUrl,
      trailerUrl,
      selectedGenres,
      featuredIn,
      episodes: episodes.map(episode => ({
        title: episode.title,
        duration: episode.duration,
        description: episode.description,
        videoUrl: episode.videoUrl,
        thumbnailUrl: episode.thumbnailUrl,
      }))
    };

    onSuccess?.(formattedData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter show description"
            className="bg-background/50 border-border/50 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="release-year">Release Year</Label>
          <Input
            id="release-year"
            type="number"
            value={formData.releaseYear}
            onChange={(e) => setFormData(prev => ({ ...prev, releaseYear: e.target.value }))}
            placeholder="2024"
            className="bg-background/50 border-border/50 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating-type">Rating Type</Label>
          <Select value={formData.ratingType} onValueChange={(value) => setFormData(prev => ({ ...prev, ratingType: value }))}>
            <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
              <SelectValue placeholder="Select rating type" />
            </SelectTrigger>
            <SelectContent>
              {ratingTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rating">Rating (0.0 - 10.0)</Label>
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="10"
            value={formData.rating}
            onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
            placeholder="8.5"
            className="bg-background/50 border-border/50 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail-url">Thumbnail URL</Label>
          <Input
            id="thumbnail-url"
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
            placeholder="https://example.com/thumbnail.jpg"
            className="bg-background/50 border-border/50 focus:border-primary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trailer-url">Trailer URL</Label>
          <Input
            id="trailer-url"
            type="url"
            value={formData.trailerUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, trailerUrl: e.target.value }))}
            placeholder="https://example.com/trailer.mp4"
            className="bg-background/50 border-border/50 focus:border-primary"
            required
          />
        </div>
      </div>

      <MultiSelectInput
        label="Genres"
        options={genres}
        selected={formData.selectedGenres}
        onChange={(selected) => setFormData(prev => ({ ...prev, selectedGenres: selected }))}
      />

      <MultiSelectInput
        label="Directors"
        options={[]}
        selected={formData.directors}
        onChange={(selected) => setFormData(prev => ({ ...prev, directors: selected }))}
        allowCustom
      />

      <MultiSelectInput
        label="Writers"
        options={[]}
        selected={formData.writers}
        onChange={(selected) => setFormData(prev => ({ ...prev, writers: selected }))}
        allowCustom
      />

      <MultiSelectInput
        label="Cast"
        options={[]}
        selected={formData.cast}
        onChange={(selected) => setFormData(prev => ({ ...prev, cast: selected }))}
        allowCustom
        placeholder="Add Cast Members"
      />

      <FeatureCheckboxes
        selected={formData.featuredIn}
        onChange={(selected) => setFormData(prev => ({ ...prev, featuredIn: selected }))}
        contentType="Show"
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Episodes</h3>
          <Button type="button" onClick={addEpisode}>
            Add Episode
          </Button>
        </div>

        {episodes.map((episode) => (
          <EpisodeForm
            key={episode.id}
            episode={episode}
            onUpdate={(updates) => updateEpisode(episode.id, updates)}
            onDelete={() => deleteEpisode(episode.id)}
          />
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={episodes.length === 0}>
        {initialData ? 'Save Changes' : 'Upload Content'}
      </Button>
    </form>
  );
};

export default ShowForm;