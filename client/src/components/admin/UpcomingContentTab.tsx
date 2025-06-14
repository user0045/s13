import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Edit, Trash2, Plus, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import MultiSelectInput from './MultiSelectInput';
import { useUpcomingContent } from '@/hooks/useUpcomingContent';
import { useCreateUpcomingContent, useUpdateUpcomingContent, useDeleteUpcomingContent } from '@/hooks/useUpcomingContentMutations';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UpcomingContent {
  id: string;
  title: string;
  content_type: string;
  release_date: string;
  description: string;
  genre: string[];
  thumbnail_url?: string;
  trailer_url?: string;
  content_order?: number;
  rating_type?: string;
  directors?: string[];
  writers?: string[];
  cast_members?: string[];
  created_at: string;
}

const UpcomingContentTab = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<UpcomingContent | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UpcomingContent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [formData, setFormData] = useState({
    title: '',
    contentType: '',
    releaseDate: '',
    ratingType: '',
    description: '',
    thumbnailUrl: '',
    trailerUrl: '',
    contentOrder: '',
    selectedGenres: [] as string[],
    directors: [] as string[],
    writers: [] as string[],
    cast: [] as string[]
  });

  const { data: upcomingContents = [], isLoading } = useUpcomingContent();
  const createMutation = useCreateUpcomingContent();
  const updateMutation = useUpdateUpcomingContent();
  const deleteMutation = useDeleteUpcomingContent();
  const { toast } = useToast();

  // Clean up expired announcements on component mount
  React.useEffect(() => {
    const cleanupExpiredAnnouncements = async () => {
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      
      try {
        await supabase
          .from('upcoming_content')
          .delete()
          .lt('release_date', yesterdayDate.toISOString().split('T')[0]);
      } catch (error) {
        console.error('Error cleaning up expired announcements:', error);
      }
    };

    cleanupExpiredAnnouncements();
  }, []);

  const genres = [
    'Action', 'Adventure', 'Comedy', 'Crime', 'Drama', 'Fantasy', 
    'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Family',
    'Animation', 'Documentary', 'Reality'
  ];

  const ratingTypes = ['G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA'];
  const contentOrderOptions = Array.from({ length: 20 }, (_, i) => i + 1);

  // Sort announcements by creation time (latest first)
  const sortedContents = [...upcomingContents].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Pagination
  const totalPages = Math.ceil(sortedContents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContents = sortedContents.slice(startIndex, startIndex + itemsPerPage);

  const resetForm = () => {
    setFormData({
      title: '',
      contentType: '',
      releaseDate: '',
      ratingType: '',
      description: '',
      thumbnailUrl: '',
      trailerUrl: '',
      contentOrder: '',
      selectedGenres: [],
      directors: [],
      writers: [],
      cast: []
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Upcoming content data:', formData);

    // Client-side validation
    if (!formData.title.trim() || !formData.contentType || !formData.releaseDate || 
        !formData.description.trim() || !formData.thumbnailUrl.trim() || 
        !formData.trailerUrl.trim() || !formData.contentOrder || 
        !formData.selectedGenres.length || !formData.directors.length || 
        !formData.writers.length || !formData.cast.length) {
      toast({
        title: "Validation Error",
        description: "All fields are required. Please fill in all the form fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      if (editingContent) {
        await updateMutation.mutateAsync({
          id: editingContent.id,
          ...formData
        });
        setEditingContent(null);
      } else {
        await createMutation.mutateAsync(formData);
      }

      resetForm();
      setShowForm(false);
    } catch (error) {
      // Error will be handled by the mutation's onError callback
      console.error('Form submission error:', error);
    }
  };

  const handleEdit = (content: UpcomingContent) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      contentType: content.content_type,
      releaseDate: content.release_date,
      ratingType: content.rating_type || '',
      description: content.description || '',
      thumbnailUrl: content.thumbnail_url || '',
      trailerUrl: content.trailer_url || '',
      contentOrder: content.content_order?.toString() || '',
      selectedGenres: content.genre || [],
      directors: content.directors || [],
      writers: content.writers || [],
      cast: content.cast_members || []
    });
    setShowForm(true);
  };

  const handleDelete = (content: UpcomingContent) => {
    setDeleteConfirm(content);
  };

  const confirmDelete = async () => {
    if (deleteConfirm) {
      await deleteMutation.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleCancel = () => {
    resetForm();
    setEditingContent(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (showForm) {
    return (
      <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">
            {editingContent ? 'Edit Upcoming Content' : 'Announce Upcoming Content'}
          </CardTitle>
          <Button variant="outline" onClick={handleCancel} className="bg-background/50 border-border/50 hover:bg-background/70">
            Cancel
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-foreground">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter content title"
                  className="bg-background/50 border-border/50 focus:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-type" className="text-foreground">Content Type</Label>
                <Select value={formData.contentType} onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}>
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

              <div className="space-y-2">
                <Label htmlFor="release-date" className="text-foreground">Release Date</Label>
                <Input
                  id="release-date"
                  type="date"
                  value={formData.releaseDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
                  className="bg-background/50 border-border/50 focus:border-primary"
                  min={new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating-type" className="text-foreground">Rating Type</Label>
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
                <Label htmlFor="content-order" className="text-foreground">Content Order</Label>
                <Select value={formData.contentOrder} onValueChange={(value) => setFormData(prev => ({ ...prev, contentOrder: value }))}>
                  <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentOrderOptions.map((order) => (
                      <SelectItem key={order} value={order.toString()}>{order}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail-url" className="text-foreground">Thumbnail URL</Label>
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
                <Label htmlFor="trailer-url" className="text-foreground">Trailer URL</Label>
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

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter content description"
                className="bg-background/50 border-border/50 focus:border-primary"
                required
              />
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
              placeholder="Add Directors"
            />

            <MultiSelectInput
              label="Writers"
              options={[]}
              selected={formData.writers}
              onChange={(selected) => setFormData(prev => ({ ...prev, writers: selected }))}
              allowCustom
              placeholder="Add Writers"
            />

            <MultiSelectInput
              label="Cast"
              options={[]}
              selected={formData.cast}
              onChange={(selected) => setFormData(prev => ({ ...prev, cast: selected }))}
              allowCustom
              placeholder="Add Cast"
            />

            <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {editingContent ? 'Update Content' : 'Announce Content'}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">Upcoming Content</CardTitle>
          {upcomingContents.length > 0 && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {upcomingContents.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No upcoming content announced yet
              </div>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Announce First Content
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-border/30 bg-background/30 backdrop-blur-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/30 bg-primary/5 hover:bg-primary/10">
                      <TableHead className="text-muted-foreground font-semibold w-16">#</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Type</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Release Date</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Order</TableHead>
                      <TableHead className="text-muted-foreground font-semibold">Genre</TableHead>
                      <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedContents.map((content, index) => (
                      <TableRow 
                        key={content.id} 
                        className="border-border/30 hover:bg-primary/5 transition-all duration-200 group"
                      >
                        <TableCell className="font-medium text-muted-foreground">
                          {startIndex + index + 1}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          {content.title}
                        </TableCell>
                        <TableCell className="text-foreground">
                          <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                            {content.content_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-primary" />
                            {formatDate(content.release_date)}
                          </div>
                        </TableCell>
                        <TableCell className="text-foreground font-medium">
                          <Badge variant="secondary" className="bg-secondary/50">
                            #{content.content_order}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-foreground">
                          <div className="flex flex-wrap gap-1">
                            {content.genre?.slice(0, 2).map((genre) => (
                              <Badge key={genre} variant="secondary" className="text-xs bg-secondary/50">
                                {genre}
                              </Badge>
                            ))}
                            {content.genre && content.genre.length > 2 && (
                              <Badge variant="secondary" className="text-xs bg-secondary/50">
                                +{content.genre.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(content)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary transition-all duration-200 rounded-full group-hover:scale-110"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(content)}
                              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive transition-all duration-200 rounded-full group-hover:scale-110"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0 hover:bg-primary/20 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0 hover:bg-primary/20 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card/90 backdrop-blur-sm border border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Upcoming Content
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirm(null)}
              className="bg-background/50 border-border/50 hover:bg-background/70"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-destructive hover:scale-105 transition-all duration-200"
            >
              {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpcomingContentTab;