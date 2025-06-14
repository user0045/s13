import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import MultiSelectInput from './MultiSelectInput';
import EpisodeForm from './EpisodeForm';
import { useToast } from '@/hooks/use-toast';

interface WebSeriesFormProps {
  title: string;
  genres: string[];
  onSuccess?: (data?: any) => void;
  initialData?: any;
}

interface Season {
  id: string;
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
  episodes: Episode[];
  featuredIn: string[];
}

interface Episode {
  id: string;
  title: string;
  duration: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const WebSeriesForm = ({ title, genres, onSuccess, initialData }: WebSeriesFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    selectedGenres: [] as string[]
  });

  const [seasons, setSeasons] = useState<Season[]>([]);

  const ratingTypes = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        selectedGenres: initialData.selectedGenres || []
      });
      setSeasons(initialData.seasons || []);
    }
  }, [initialData]);

  const addSeason = () => {
    const newSeason: Season = {
      id: `season-${seasons.length + 1}`,
      title: `Season ${seasons.length + 1}`,
      description: '',
      releaseYear: '',
      ratingType: '',
      rating: '',
      directors: [],
      writers: [],
      cast: [],
      thumbnailUrl: '',
      trailerUrl: '',
      episodes: [],
      featuredIn: []
    };
    setSeasons([...seasons, newSeason]);
  };

  const deleteSeason = (seasonId: string) => {
    setSeasons(prev => prev.filter(season => season.id !== seasonId));
  };

  const updateSeason = (seasonId: string, updates: Partial<Season>) => {
    setSeasons(prev => prev.map(season => 
      season.id === seasonId ? { ...season, ...updates } : season
    ));
  };

  const addEpisode = (seasonId: string) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;

    const newEpisode: Episode = {
      id: `episode-${season.episodes.length + 1}`,
      title: `Episode ${season.episodes.length + 1}`,
      duration: '',
      description: '',
      videoUrl: '',
      thumbnailUrl: ''
    };

    updateSeason(seasonId, {
      episodes: [...season.episodes, newEpisode]
    });
  };

  const deleteEpisode = (seasonId: string, episodeId: string) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;

    const updatedEpisodes = season.episodes.filter(episode => episode.id !== episodeId);
    updateSeason(seasonId, { episodes: updatedEpisodes });
  };

  const updateEpisode = (seasonId: string, episodeId: string, updates: Partial<Episode>) => {
    const season = seasons.find(s => s.id === seasonId);
    if (!season) return;

    const updatedEpisodes = season.episodes.map(episode =>
      episode.id === episodeId ? { ...episode, ...updates } : episode
    );

    updateSeason(seasonId, { episodes: updatedEpisodes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate at least one season with one episode
    if (seasons.length === 0 || seasons.some(season => season.episodes.length === 0)) {
      toast({
        title: "Validation Error",
        description: "At least one season with one episode is required",
        variant: "destructive"
      });
      return;
    }

    console.log('Web Series data:', { title, ...formData, seasons });
    onSuccess?.({ ...formData, seasons });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <MultiSelectInput
        label="Genres"
        options={genres}
        selected={formData.selectedGenres}
        onChange={(selected) => setFormData(prev => ({ ...prev, selectedGenres: selected }))}
      />

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Seasons</h3>
          <Button type="button" onClick={addSeason}>
            Add Season
          </Button>
        </div>

        {seasons.map((season) => (
          <Card key={season.id} className="bg-gradient-to-br from-black/90 via-dark-green/20 to-black/90 backdrop-blur-sm border border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">{season.title}</CardTitle>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => deleteSeason(season.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Season Title</Label>
                  <Input
                    value={season.title}
                    onChange={(e) => updateSeason(season.id, { title: e.target.value })}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Release Year</Label>
                  <Input
                    type="number"
                    value={season.releaseYear}
                    onChange={(e) => updateSeason(season.id, { releaseYear: e.target.value })}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Rating Type</Label>
                  <Select value={season.ratingType} onValueChange={(value) => updateSeason(season.id, { ratingType: value })}>
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
                  <Label className="text-foreground">Rating (0.0 - 10.0)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={season.rating}
                    onChange={(e) => updateSeason(season.id, { rating: e.target.value })}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Thumbnail URL</Label>
                  <Input
                    type="url"
                    value={season.thumbnailUrl}
                    onChange={(e) => updateSeason(season.id, { thumbnailUrl: e.target.value })}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Trailer URL</Label>
                  <Input
                    type="url"
                    value={season.trailerUrl}
                    onChange={(e) => updateSeason(season.id, { trailerUrl: e.target.value })}
                    className="bg-background/50 border-border/50 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Description</Label>
                <Textarea
                  value={season.description}
                  onChange={(e) => updateSeason(season.id, { description: e.target.value })}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <MultiSelectInput
                label="Directors"
                options={[]}
                selected={season.directors}
                onChange={(selected) => updateSeason(season.id, { directors: selected })}
                allowCustom
              />

              <MultiSelectInput
                label="Writers"
                options={[]}
                selected={season.writers}
                onChange={(selected) => updateSeason(season.id, { writers: selected })}
                allowCustom
              />

              <MultiSelectInput
                label="Cast"
                options={[]}
                selected={season.cast}
                onChange={(selected) => updateSeason(season.id, { cast: selected })}
                allowCustom
                placeholder="Add Cast Members"
              />

              <div className="space-y-2">
                <Label className="text-foreground">Feature In</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Home Hero', 'Home New Release', 'Home Popular', 'Type Hero', 'Type New Release', 'Type Popular'].map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`${season.id}-${feature}`}
                        checked={season.featuredIn.includes(feature)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const updatedFeaturedIn = checked
                            ? [...season.featuredIn, feature]
                            : season.featuredIn.filter(item => item !== feature);
                          updateSeason(season.id, { featuredIn: updatedFeaturedIn });
                        }}
                        className="rounded border-border"
                      />
                      <Label htmlFor={`${season.id}-${feature}`} className="text-sm font-normal text-foreground">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-foreground">Episodes</h4>
                  <Button type="button" size="sm" onClick={() => addEpisode(season.id)}>
                    Add Episode
                  </Button>
                </div>

                {season.episodes.map((episode) => (
                  <EpisodeForm
                    key={episode.id}
                    episode={episode}
                    onUpdate={(updates) => updateEpisode(season.id, episode.id, updates)}
                    onDelete={() => deleteEpisode(season.id, episode.id)}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="submit" className="w-full" disabled={seasons.length === 0}>
        {initialData ? 'Save Changes' : 'Upload Content'}
      </Button>
    </form>
  );
};

export default WebSeriesForm;