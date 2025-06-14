
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MovieForm from './MovieForm';
import WebSeriesForm from './WebSeriesForm';
import ShowForm from './ShowForm';
import { useUploadMovie, useUploadWebSeries, useUploadShow } from '@/hooks/useContentUpload';
import { useToast } from '@/hooks/use-toast';

type ContentType = 'Movie' | 'Web Series' | 'Show' | '';

const UploadContentTab = () => {
  const { toast } = useToast();
  const [contentType, setContentType] = useState<ContentType>('');
  const [title, setTitle] = useState('');

  const uploadMovie = useUploadMovie();
  const uploadWebSeries = useUploadWebSeries();
  const uploadShow = useUploadShow();

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Family',
    'Animation', 'Documentary', 'Reality'
  ];

  const handleFormSuccess = (formData: any) => {
    // Validate required fields
    if (!title.trim()) {
      toast({ title: "Validation Error", description: "Please enter a title", variant: "destructive" });
      return;
    }
    
    if (!contentType) {
      toast({ title: "Validation Error", description: "Please select a content type", variant: "destructive" });
      return;
    }
    
    console.log('Form submitted with data:', { title, contentType, ...formData });
    
    if (contentType === 'Movie') {
      uploadMovie.mutate({ title, ...formData });
    } else if (contentType === 'Web Series') {
      uploadWebSeries.mutate({ title, ...formData });
    } else if (contentType === 'Show') {
      uploadShow.mutate({ title, ...formData });
    }
    
    // Reset form after successful submission
    setContentType('');
    setTitle('');
  };

  const renderContentForm = () => {
    switch (contentType) {
      case 'Movie':
        return <MovieForm title={title} genres={genres} onSuccess={handleFormSuccess} />;
      case 'Web Series':
        return <WebSeriesForm title={title} genres={genres} onSuccess={handleFormSuccess} />;
      case 'Show':
        return <ShowForm title={title} genres={genres} onSuccess={handleFormSuccess} />;
      default:
        return null;
    }
  };

  const isLoading = uploadMovie.isPending || uploadWebSeries.isPending || uploadShow.isPending;

  return (
    <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
      <CardHeader>
        <CardTitle className="text-foreground">Upload New Content</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              className="bg-background/50 border-border/50 focus:border-primary"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content-type" className="text-foreground">Content Type</Label>
            <Select value={contentType} onValueChange={(value: ContentType) => setContentType(value)} disabled={isLoading}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Movie">Movie</SelectItem>
                <SelectItem value="Web Series">Web Series</SelectItem>
                <SelectItem value="Show">Show</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {renderContentForm()}
      </CardContent>
    </Card>
  );
};

export default UploadContentTab;
