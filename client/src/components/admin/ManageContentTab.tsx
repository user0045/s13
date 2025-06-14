
import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Film, Tv, Calendar, Star, ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import EditContentDialog from './EditContentDialog';
import { useAllContent } from '@/hooks/useContentQueries';
import { useDeleteContent } from '@/hooks/useContentMutations';

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
  content_id?: string;
  upload_content_data?: any;
}

type SortOrder = 'asc' | 'desc' | 'none';

const ManageContentTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');
  const [deleteConfirm, setDeleteConfirm] = useState<Content | null>(null);
  const [editContent, setEditContent] = useState<Content | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortByViews, setSortByViews] = useState<SortOrder>('none');
  const itemsPerPage = 20;

  const { data: contentData, isLoading, error } = useAllContent();
  const deleteMutation = useDeleteContent();

  const contentTypes = ['Movie', 'Web Series', 'Show'];

  // Transform the database data to match our Content interface
  const transformedContents = useMemo(() => {
    if (!contentData) return [];

    const contents: Content[] = [];

    // Process movies
    contentData.movies?.forEach((movieItem) => {
      if (movieItem.movie) {
        contents.push({
          id: movieItem.id,
          title: movieItem.title,
          type: movieItem.content_type as 'Movie' | 'Web Series' | 'Show',
          releaseYear: movieItem.movie.release_year?.toString() || '',
          ratingType: movieItem.movie.rating_type || '',
          rating: movieItem.movie.rating?.toString() || '',
          description: movieItem.movie.description || '',
          selectedGenres: movieItem.genre || [],
          featuredIn: movieItem.movie.feature_in || [],
          thumbnailUrl: movieItem.movie.thumbnail_url || '',
          trailerUrl: movieItem.movie.trailer_url || '',
          videoUrl: movieItem.movie.video_url || '',
          directors: movieItem.movie.director || [],
          writers: movieItem.movie.writer || [],
          cast: movieItem.movie.cast_members || [],
          duration: movieItem.movie.duration?.toString() || '',
          views: movieItem.movie.views || 0,
          // Add upload_content data for edit functionality
          content_id: movieItem.content_id,
          upload_content_data: movieItem,
        });
      }
    });

    // Process shows
    contentData.shows?.forEach((showItem) => {
      if (showItem.show) {
        contents.push({
          id: showItem.id,
          title: showItem.title,
          type: showItem.content_type as 'Movie' | 'Web Series' | 'Show',
          releaseYear: showItem.show.release_year?.toString() || '',
          ratingType: showItem.show.rating_type || '',
          rating: showItem.show.rating?.toString() || '',
          description: showItem.show.description || '',
          selectedGenres: showItem.genre || [],
          featuredIn: showItem.show.feature_in || [],
          thumbnailUrl: showItem.show.thumbnail_url || '',
          trailerUrl: showItem.show.trailer_url || '',
          directors: showItem.show.directors || [],
          writers: showItem.show.writers || [],
          cast: showItem.show.cast_members || [],
          views: 0, // Shows don't have views in the current schema
          // Add upload_content data for edit functionality
          content_id: showItem.content_id,
          upload_content_data: showItem,
        });
      }
    });

    // Process web series
    contentData.webSeries?.forEach((webSeriesItem) => {
      if (webSeriesItem.web_series) {
        // Get year and rating from the first season if available
        const firstSeason = webSeriesItem.web_series.seasons?.[0];
        const releaseYear = firstSeason?.release_year?.toString() || '';
        const rating = firstSeason?.rating?.toString() || '';
        const ratingType = firstSeason?.rating_type || '';

        contents.push({
          id: webSeriesItem.id,
          title: webSeriesItem.title,
          type: webSeriesItem.content_type as 'Movie' | 'Web Series' | 'Show',
          releaseYear: releaseYear,
          ratingType: ratingType,
          rating: rating,
          description: firstSeason?.season_description || '',
          selectedGenres: webSeriesItem.genre || [],
          featuredIn: firstSeason?.feature_in || [],
          thumbnailUrl: firstSeason?.thumbnail_url || '',
          trailerUrl: firstSeason?.trailer_url || '',
          directors: firstSeason?.director || [],
          writers: firstSeason?.writer || [],
          cast: firstSeason?.cast_members || [],
          views: 0,
          seasons: webSeriesItem.web_series.seasons || [],
          // Add upload_content data for edit functionality
          content_id: webSeriesItem.content_id,
          upload_content_data: webSeriesItem,
        });
      }
    });

    // Sort contents by creation/update time (newest first)
    contents.sort((a, b) => {
      const aTime = a.upload_content_data?.updated_at || a.upload_content_data?.created_at || '';
      const bTime = b.upload_content_data?.updated_at || b.upload_content_data?.created_at || '';
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return contents;
  }, [contentData]);

  const filteredContents = useMemo(() => {
    let filtered = transformedContents.filter(content => {
      const searchMatch = content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.rating.includes(searchTerm);
      const typeMatch = contentTypeFilter === 'all' ? true : content.type === contentTypeFilter;
      return searchMatch && typeMatch;
    });

    // Apply sorting
    if (sortByViews !== 'none') {
      filtered = [...filtered].sort((a, b) => {
        const aViews = a.views || 0;
        const bViews = b.views || 0;
        return sortByViews === 'desc' ? bViews - aViews : aViews - bViews;
      });
    }

    return filtered;
  }, [transformedContents, searchTerm, contentTypeFilter, sortByViews]);

  // Pagination
  const totalPages = Math.ceil(filteredContents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContents = filteredContents.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const totalMovies = transformedContents.filter(c => c.type === 'Movie').length;
  const totalSeries = transformedContents.filter(c => c.type === 'Web Series').length;
  const totalShows = transformedContents.filter(c => c.type === 'Show').length;
  const totalViews = transformedContents.reduce((sum, c) => sum + (c.views || 0), 0);

  const handleEdit = useCallback((content: Content) => {
    setEditContent(content);
  }, []);

  const handleEditSave = useCallback((updatedContent: Content) => {
    setEditContent(null);
  }, []);

  const handleDelete = useCallback((content: Content) => {
    setDeleteConfirm(content);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (deleteConfirm) {
      try {
        // Determine the content_id based on the content type and data structure
        let contentId = '';

        // Find the original upload_content entry to get the content_id
        const originalContent = contentData?.movies?.find(m => m.id === deleteConfirm.id) ||
                               contentData?.shows?.find(s => s.id === deleteConfirm.id) ||
                               contentData?.webSeries?.find(w => w.id === deleteConfirm.id);

        if (originalContent) {
          contentId = originalContent.content_id;
        }

        await deleteMutation.mutateAsync({
          id: deleteConfirm.id,
          contentId: contentId,
          contentType: deleteConfirm.type
        });
        setDeleteConfirm(null);
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  }, [deleteConfirm, deleteMutation, contentData]);

  const handleSortByViews = () => {
    if (sortByViews === 'none') {
      setSortByViews('desc');
    } else if (sortByViews === 'desc') {
      setSortByViews('asc');
    } else {
      setSortByViews('none');
    }
    setCurrentPage(1);
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatTotalViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(0)}K`;
    }
    return views.toString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading content...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              Error loading content: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Movies</CardTitle>
            <Film className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalMovies}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Web Series</CardTitle>
            <Tv className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalSeries}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">TV Shows</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalShows}</div>
          </CardContent>
        </Card>

        <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatTotalViews(totalViews)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Content Library Table */}
      <Card className="bg-card/40 backdrop-blur-sm border border-border/30">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <CardTitle className="text-foreground">Content Library</CardTitle>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-background/50 border-border/30"
                />
              </div>
              <Select value={contentTypeFilter} onValueChange={setContentTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background/50 border-border/30">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {contentTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/30 bg-background/30 backdrop-blur-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/30 bg-primary/5 hover:bg-primary/10">
                  <TableHead className="text-muted-foreground font-semibold w-16">#</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Title</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Type</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Year</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Rating</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">Genre</TableHead>
                  <TableHead className="text-muted-foreground font-semibold">
                    <Button
                      variant="ghost"
                      onClick={handleSortByViews}
                      className="h-auto p-0 font-semibold text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      Views
                      {sortByViews === 'none' && <ArrowUpDown className="h-3 w-3" />}
                      {sortByViews === 'desc' && <ArrowDown className="h-3 w-3" />}
                      {sortByViews === 'asc' && <ArrowUp className="h-3 w-3" />}
                    </Button>
                  </TableHead>
                  <TableHead className="text-muted-foreground font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedContents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No content found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedContents.map((content, index) => (
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
                          {content.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{content.releaseYear || 'N/A'}</TableCell>
                      <TableCell className="text-foreground">
                        {content.rating ? (
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span>{content.rating}</span>
                          </div>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-foreground">
                        <div className="flex flex-wrap gap-1">
                          {content.selectedGenres.slice(0, 2).map((genre) => (
                            <Badge key={genre} variant="secondary" className="text-xs bg-secondary/50">
                              {genre}
                            </Badge>
                          ))}
                          {content.selectedGenres.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-secondary/50">
                              +{content.selectedGenres.length - 2}
                            </Badge>
                          )}
                          {content.selectedGenres.length === 0 && (
                            <span className="text-muted-foreground text-xs">No genres</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground font-medium">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3 text-primary" />
                          <span>{formatViews(content.views || 0)}</span>
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
                  ))
                )}
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
        </CardContent>
      </Card>

      {/* Edit Content Dialog */}
      {editContent && (
        <EditContentDialog
          content={editContent}
          open={!!editContent}
          onClose={() => setEditContent(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-card/90 backdrop-blur-sm border border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-destructive" />
              Delete Content
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Are you sure you want to delete "{deleteConfirm?.title}"? This action cannot be undone and will permanently remove this content from your library.
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
    </div>
  );
};

export default ManageContentTab;
