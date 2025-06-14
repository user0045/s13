
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import MultiSelectInput from './MultiSelectInput';
import FeatureCheckboxes from './FeatureCheckboxes';
import { useUpdateContent } from '@/hooks/useContentMutations';
import { useContentForEdit } from '@/hooks/useContentEdit';
import { Loader2, Plus, Trash2 } from 'lucide-react';

interface Content {
  id: string;
  title: string;
  type: 'Movie' | 'Web Series' | 'Show';
  releaseYear: string;
  ratingType: string;
  rating: string;
  description: string;
  selectedGenres: string[];
  featuredIn: string[];
  thumbnailUrl: string;
  trailerUrl: string;
  videoUrl?: string;
  directors: string[];
  writers: string[];
  cast: string[];
  duration?: string;
  views?: number;
  seasons?: any[];
  episodes?: any[];
}

interface EditContentDialogProps {
  content: Content;
  open: boolean;
  onClose: () => void;
  onSave: (content: Content) => void;
}

const EditContentDialog: React.FC<EditContentDialogProps> = ({
  content,
  open,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState<any>({
    description: '',
    releaseYear: '',
    ratingType: '',
    rating: '',
    directors: [],
    writers: [],
    cast: [],
    thumbnailUrl: '',
    trailerUrl: '',
    selectedGenres: [],
    featuredIn: [],
    duration: '',
    videoUrl: '',
    seasons: [{ 
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
    }],
    episodes: [{ title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }]
  });

  const { data: contentEditData, isLoading: loadingContent } = useContentForEdit(content.id, content.type);
  const updateMutation = useUpdateContent();

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Family',
    'Animation', 'Documentary', 'Reality'
  ];

  const ratingTypes = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];

  useEffect(() => {
    if (contentEditData && open) {
      const { uploadContent, contentData } = contentEditData;
      
      // Set title from upload_content
      setTitle(uploadContent.title || '');
      
      if (content.type === 'Movie') {
        setFormData({
          description: contentData?.description || '',
          releaseYear: contentData?.release_year?.toString() || '',
          ratingType: contentData?.rating_type || '',
          rating: contentData?.rating?.toString() || '',
          directors: contentData?.director || [],
          writers: contentData?.writer || [],
          cast: contentData?.cast_members || [],
          thumbnailUrl: contentData?.thumbnail_url || '',
          trailerUrl: contentData?.trailer_url || '',
          selectedGenres: uploadContent.genre || [],
          featuredIn: contentData?.feature_in || [],
          duration: contentData?.duration?.toString() || '',
          videoUrl: contentData?.video_url || '',
          seasons: [],
          episodes: []
        });
      } else if (content.type === 'Web Series') {
        setFormData({
          description: '',
          releaseYear: '',
          ratingType: '',
          rating: '',
          directors: [],
          writers: [],
          cast: [],
          thumbnailUrl: '',
          trailerUrl: '',
          selectedGenres: uploadContent.genre || [],
          featuredIn: [],
          duration: '',
          videoUrl: '',
          seasons: contentData?.seasons || [{ 
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
          }],
          episodes: []
        });
      } else if (content.type === 'Show') {
        setFormData({
          description: contentData?.description || '',
          releaseYear: contentData?.release_year?.toString() || '',
          ratingType: contentData?.rating_type || '',
          rating: contentData?.rating?.toString() || '',
          directors: contentData?.directors || [],
          writers: contentData?.writers || [],
          cast: contentData?.cast_members || [],
          thumbnailUrl: contentData?.thumbnail_url || '',
          trailerUrl: contentData?.trailer_url || '',
          selectedGenres: uploadContent.genre || [],
          featuredIn: contentData?.feature_in || [],
          duration: '',
          videoUrl: '',
          seasons: [],
          episodes: contentData?.episodes || [{ title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }]
        });
      }
    }
  }, [contentEditData, content.type, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateMutation.mutateAsync({
        id: content.id,
        title,
        type: content.type,
        originalType: content.type,
        ...formData
      });
      onSave({ ...content, title, ...formData });
      onClose();
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Season management functions
  const addSeason = () => {
    setFormData((prev: any) => ({
      ...prev,
      seasons: [...prev.seasons, { 
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
    }));
  };

  const removeSeason = (seasonIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      seasons: prev.seasons.filter((_: any, index: number) => index !== seasonIndex)
    }));
  };

  const updateSeason = (seasonIndex: number, field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      seasons: prev.seasons.map((season: any, index: number) => 
        index === seasonIndex ? { ...season, [field]: value } : season
      )
    }));
  };

  // Episode management functions
  const addEpisode = (seasonIndex?: number) => {
    if (seasonIndex !== undefined) {
      // Adding episode to a season
      setFormData((prev: any) => ({
        ...prev,
        seasons: prev.seasons.map((season: any, index: number) => 
          index === seasonIndex 
            ? { ...season, episodes: [...season.episodes, { title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }] }
            : season
        )
      }));
    } else {
      // Adding episode to a show
      setFormData((prev: any) => ({
        ...prev,
        episodes: [...prev.episodes, { title: '', duration: '', description: '', videoUrl: '', thumbnailUrl: '' }]
      }));
    }
  };

  const removeEpisode = (episodeIndex: number, seasonIndex?: number) => {
    if (seasonIndex !== undefined) {
      // Removing episode from a season
      setFormData((prev: any) => ({
        ...prev,
        seasons: prev.seasons.map((season: any, index: number) => 
          index === seasonIndex 
            ? { ...season, episodes: season.episodes.filter((_: any, idx: number) => idx !== episodeIndex) }
            : season
        )
      }));
    } else {
      // Removing episode from a show
      setFormData((prev: any) => ({
        ...prev,
        episodes: prev.episodes.filter((_: any, index: number) => index !== episodeIndex)
      }));
    }
  };

  const updateEpisode = (episodeIndex: number, field: string, value: any, seasonIndex?: number) => {
    if (seasonIndex !== undefined) {
      // Updating episode in a season
      setFormData((prev: any) => ({
        ...prev,
        seasons: prev.seasons.map((season: any, sIndex: number) => 
          sIndex === seasonIndex 
            ? { 
                ...season, 
                episodes: season.episodes.map((episode: any, eIndex: number) => 
                  eIndex === episodeIndex ? { ...episode, [field]: value } : episode
                )
              }
            : season
        )
      }));
    } else {
      // Updating episode in a show
      setFormData((prev: any) => ({
        ...prev,
        episodes: prev.episodes.map((episode: any, index: number) => 
          index === episodeIndex ? { ...episode, [field]: value } : episode
        )
      }));
    }
  };

  const renderContentForm = () => {
    switch (content.type) {
      case 'Movie':
        return (
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary min-h-[100px]"
                required
              />
            </div>

            {/* Release Year, Rating Type, Rating Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="releaseYear" className="text-foreground">Release Year</Label>
                <Input
                  id="releaseYear"
                  type="number"
                  value={formData.releaseYear}
                  onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingType" className="text-foreground">Rating Type</Label>
                <Select value={formData.ratingType} onValueChange={(value) => handleInputChange('ratingType', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingTypes.map(rating => (
                      <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating" className="text-foreground">Rating Score</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Duration and Video URL for Movie */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoUrl" className="text-foreground">Video URL</Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Multi-select inputs */}
            <div className="space-y-4">
              <MultiSelectInput
                label="Genres"
                placeholder="Select genres"
                options={genres}
                selected={formData.selectedGenres}
                onChange={(values) => handleInputChange('selectedGenres', values)}
              />

              <MultiSelectInput
                label="Directors"
                placeholder="Add directors"
                options={[]}
                selected={formData.directors}
                onChange={(values) => handleInputChange('directors', values)}
                allowCustom={true}
              />

              <MultiSelectInput
                label="Writers"
                placeholder="Add writers"
                options={[]}
                selected={formData.writers}
                onChange={(values) => handleInputChange('writers', values)}
                allowCustom={true}
              />

              <MultiSelectInput
                label="Cast Members"
                placeholder="Add Cast Members"
                options={[]}
                selected={formData.cast}
                onChange={(values) => handleInputChange('cast', values)}
                allowCustom={true}
              />
            </div>

            {/* Thumbnail and Trailer URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-foreground">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailerUrl" className="text-foreground">Trailer URL</Label>
                <Input
                  id="trailerUrl"
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <FeatureCheckboxes
              selected={formData.featuredIn}
              onChange={(values) => handleInputChange('featuredIn', values)}
            />
          </div>
        );

      case 'Web Series':
        return (
          <div className="space-y-6">
            {/* Basic description and genres */}
            <div className="space-y-4">
              <MultiSelectInput
                label="Genres"
                placeholder="Select genres"
                options={genres}
                selected={formData.selectedGenres}
                onChange={(values) => handleInputChange('selectedGenres', values)}
              />
            </div>

            {/* Seasons Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-lg font-semibold">Seasons</Label>
                <Button type="button" onClick={addSeason} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Season
                </Button>
              </div>

              {formData.seasons.map((season: any, seasonIndex: number) => (
                <div key={seasonIndex} className="border border-border/50 rounded-lg p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground font-medium text-lg">Season {seasonIndex + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeSeason(seasonIndex)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Season Title and Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Season Title</Label>
                      <Input
                        value={season.title}
                        onChange={(e) => updateSeason(seasonIndex, 'title', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Season Description</Label>
                      <Textarea
                        value={season.description}
                        onChange={(e) => updateSeason(seasonIndex, 'description', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Season Release Year, Rating Type, Rating Score */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Release Year</Label>
                      <Input
                        type="number"
                        value={season.releaseYear}
                        onChange={(e) => updateSeason(seasonIndex, 'releaseYear', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Rating Type</Label>
                      <Select value={season.ratingType} onValueChange={(value) => updateSeason(seasonIndex, 'ratingType', value)}>
                        <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {ratingTypes.map(rating => (
                            <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Rating Score</Label>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={season.rating}
                        onChange={(e) => updateSeason(seasonIndex, 'rating', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Season Multi-select inputs */}
                  <div className="space-y-4">
                    <MultiSelectInput
                      label="Directors"
                      placeholder="Add directors"
                      options={[]}
                      selected={season.directors}
                      onChange={(values) => updateSeason(seasonIndex, 'directors', values)}
                      allowCustom={true}
                    />

                    <MultiSelectInput
                      label="Writers"
                      placeholder="Add writers"
                      options={[]}
                      selected={season.writers}
                      onChange={(values) => updateSeason(seasonIndex, 'writers', values)}
                      allowCustom={true}
                    />

                    <MultiSelectInput
                      label="Cast Members"
                      placeholder="Add Cast Members"
                      options={[]}
                      selected={season.cast}
                      onChange={(values) => updateSeason(seasonIndex, 'cast', values)}
                      allowCustom={true}
                    />
                  </div>

                  {/* Season Thumbnail and Trailer URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Thumbnail URL</Label>
                      <Input
                        type="url"
                        value={season.thumbnailUrl}
                        onChange={(e) => updateSeason(seasonIndex, 'thumbnailUrl', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Trailer URL</Label>
                      <Input
                        type="url"
                        value={season.trailerUrl}
                        onChange={(e) => updateSeason(seasonIndex, 'trailerUrl', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  <FeatureCheckboxes
                    selected={season.featuredIn}
                    onChange={(values) => updateSeason(seasonIndex, 'featuredIn', values)}
                  />

                  {/* Episodes Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-foreground font-medium">Episodes</Label>
                      <Button
                        type="button"
                        onClick={() => addEpisode(seasonIndex)}
                        size="sm"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Episode
                      </Button>
                    </div>

                    {season.episodes.map((episode: any, episodeIndex: number) => (
                      <div key={episodeIndex} className="border border-border/30 rounded-md p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-foreground font-medium">Episode {episodeIndex + 1}</span>
                          <Button
                            type="button"
                            onClick={() => removeEpisode(episodeIndex, seasonIndex)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-sm text-foreground">Episode Title</Label>
                            <Input
                              value={episode.title}
                              onChange={(e) => updateEpisode(episodeIndex, 'title', e.target.value, seasonIndex)}
                              className="bg-background/50 border-border/50 focus:border-primary"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-sm text-foreground">Duration (minutes)</Label>
                            <Input
                              type="number"
                              value={episode.duration}
                              onChange={(e) => updateEpisode(episodeIndex, 'duration', e.target.value, seasonIndex)}
                              className="bg-background/50 border-border/50 focus:border-primary"
                              required
                            />
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <Label className="text-sm text-foreground">Episode Description</Label>
                            <Textarea
                              value={episode.description}
                              onChange={(e) => updateEpisode(episodeIndex, 'description', e.target.value, seasonIndex)}
                              className="bg-background/50 border-border/50 focus:border-primary"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-sm text-foreground">Video URL</Label>
                            <Input
                              type="url"
                              value={episode.videoUrl}
                              onChange={(e) => updateEpisode(episodeIndex, 'videoUrl', e.target.value, seasonIndex)}
                              className="bg-background/50 border-border/50 focus:border-primary"
                              required
                            />
                          </div>

                          <div className="space-y-1">
                            <Label className="text-sm text-foreground">Episode Thumbnail URL</Label>
                            <Input
                              type="url"
                              value={episode.thumbnailUrl}
                              onChange={(e) => updateEpisode(episodeIndex, 'thumbnailUrl', e.target.value, seasonIndex)}
                              className="bg-background/50 border-border/50 focus:border-primary"
                              required
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Show':
        return (
          <div className="space-y-6">
            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="bg-background/50 border-border/50 focus:border-primary min-h-[100px]"
                required
              />
            </div>

            {/* Release Year, Rating Type, Rating Score */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="releaseYear" className="text-foreground">Release Year</Label>
                <Input
                  id="releaseYear"
                  type="number"
                  value={formData.releaseYear}
                  onChange={(e) => handleInputChange('releaseYear', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ratingType" className="text-foreground">Rating Type</Label>
                <Select value={formData.ratingType} onValueChange={(value) => handleInputChange('ratingType', value)}>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    {ratingTypes.map(rating => (
                      <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating" className="text-foreground">Rating Score</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            {/* Multi-select inputs */}
            <div className="space-y-4">
              <MultiSelectInput
                label="Genres"
                placeholder="Select genres"
                options={genres}
                selected={formData.selectedGenres}
                onChange={(values) => handleInputChange('selectedGenres', values)}
              />

              <MultiSelectInput
                label="Directors"
                placeholder="Add directors"
                options={[]}
                selected={formData.directors}
                onChange={(values) => handleInputChange('directors', values)}
                allowCustom={true}
              />

              <MultiSelectInput
                label="Writers"
                placeholder="Add writers"
                options={[]}
                selected={formData.writers}
                onChange={(values) => handleInputChange('writers', values)}
                allowCustom={true}
              />

              <MultiSelectInput
                label="Cast Members"
                placeholder="Add Cast Members"
                options={[]}
                selected={formData.cast}
                onChange={(values) => handleInputChange('cast', values)}
                allowCustom={true}
              />
            </div>

            {/* Thumbnail and Trailer URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thumbnailUrl" className="text-foreground">Thumbnail URL</Label>
                <Input
                  id="thumbnailUrl"
                  type="url"
                  value={formData.thumbnailUrl}
                  onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trailerUrl" className="text-foreground">Trailer URL</Label>
                <Input
                  id="trailerUrl"
                  type="url"
                  value={formData.trailerUrl}
                  onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>
            </div>

            <FeatureCheckboxes
              selected={formData.featuredIn}
              onChange={(values) => handleInputChange('featuredIn', values)}
            />

            {/* Episodes Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-foreground text-lg font-semibold">Episodes</Label>
                <Button type="button" onClick={() => addEpisode()} size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Episode
                </Button>
              </div>

              {formData.episodes.map((episode: any, episodeIndex: number) => (
                <div key={episodeIndex} className="border border-border/50 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground font-medium">Episode {episodeIndex + 1}</h4>
                    <Button
                      type="button"
                      onClick={() => removeEpisode(episodeIndex)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground">Episode Title</Label>
                      <Input
                        value={episode.title}
                        onChange={(e) => updateEpisode(episodeIndex, 'title', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={episode.duration}
                        onChange={(e) => updateEpisode(episodeIndex, 'duration', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-foreground">Episode Description</Label>
                      <Textarea
                        value={episode.description}
                        onChange={(e) => updateEpisode(episodeIndex, 'description', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Video URL</Label>
                      <Input
                        type="url"
                        value={episode.videoUrl}
                        onChange={(e) => updateEpisode(episodeIndex, 'videoUrl', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-foreground">Episode Thumbnail URL</Label>
                      <Input
                        type="url"
                        value={episode.thumbnailUrl}
                        onChange={(e) => updateEpisode(episodeIndex, 'thumbnailUrl', e.target.value)}
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loadingContent) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="bg-card/90 backdrop-blur-sm border border-border/50 max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading content data...</span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card/90 backdrop-blur-sm border border-border/50 max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <div className="flex items-center justify-between pr-8">
            <DialogTitle className="text-lg font-thin text-left uppercase tracking-[0.2em]" style={{ fontFamily: 'serif', color: '#038A6A' }}>
              Edit Content
            </DialogTitle>
            <DialogDescription className="sr-only">
              Edit content form for {content.type} - {content.title}
            </DialogDescription>
            <Badge variant="outline" className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 text-sm font-semibold rounded-full border-primary/30">
              {content.type}
            </Badge>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title field (not changeable content type) */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-primary"
              required
            />
          </div>

          {renderContentForm()}

          <div className="flex justify-end space-x-2 pt-4 border-t border-border/30">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="bg-background/50 border-border/50 hover:bg-background/70"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={updateMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Updating...
                </>
              ) : (
                'Update Content'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditContentDialog;
