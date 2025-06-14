import React, { useState } from 'react';
import Header from '@/components/Header';
import UpcomingCard from '@/components/UpcomingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Send, X, Loader2, Clock } from 'lucide-react';
import { useUpcomingContent } from '@/hooks/useUpcomingContent';
import { useCreateContentDemand } from '@/hooks/useContentDemands';
import { useToast } from '@/hooks/use-toast';

const Upcoming = () => {
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestionData, setSuggestionData] = useState({
    title: '',
    type: '',
    description: ''
  });

  const { data: upcomingContent, isLoading, error } = useUpcomingContent();
  const createDemandMutation = useCreateContentDemand();
  const { toast } = useToast();

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting content suggestion:', suggestionData);

    try {
      await createDemandMutation.mutateAsync({
        title: suggestionData.title,
        content_type: suggestionData.type as 'Movie' | 'Web Series' | 'Show',
        description: suggestionData.description || undefined,
      });

      toast({
        title: "Request Submitted!",
        description: "Your content request has been submitted successfully.",
      });

      setSuggestionData({ title: '', type: '', description: '' });
      setShowSuggestionForm(false);
    } catch (error: any) {
      console.error('Error submitting suggestion:', error);

      // Check if it's the 30-minute restriction error
      if (error.message && error.message.includes('30 minutes')) {
        toast({
          title: "Too Many Requests",
          description: "You can only make one request every 30 minutes. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to submit your request. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setSuggestionData({ title: '', type: '', description: '' });
    setShowSuggestionForm(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    console.error('Error loading upcoming content:', error);
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <p className="text-foreground">Error loading upcoming content. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-lg font-thin text-foreground text-left uppercase tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
              Upcoming Releases
            </h1>

            <Button
              onClick={() => setShowSuggestionForm(true)}
              variant="outline"
              size="sm"
              className="bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300 flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Suggest Content
            </Button>
          </div>

          {showSuggestionForm && (
            <Card className="mb-6 bg-gradient-to-br from-black/90 via-dark-green/20 to-black/90 backdrop-blur-sm border border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-foreground text-lg">Request Content</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Can't find what you're looking for? Let us know what content you'd like to see added to our platform. 
                  <span className="text-amber-400">Note: Only one request per 30 minutes is allowed.</span>
                </div>
                <form onSubmit={handleSuggestionSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="suggestion-title" className="text-foreground">Content Title</Label>
                      <Input
                        id="suggestion-title"
                        value={suggestionData.title}
                        onChange={(e) => setSuggestionData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter the title of content you want"
                        className="bg-background/50 border-border/50 focus:border-primary"
                        required
                        disabled={createDemandMutation.isPending}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suggestion-type" className="text-foreground">Content Type</Label>
                      <Select 
                        value={suggestionData.type} 
                        onValueChange={(value) => setSuggestionData(prev => ({ ...prev, type: value }))}
                        disabled={createDemandMutation.isPending}
                      >
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

                  <div className="space-y-2">
                    <Label htmlFor="suggestion-description" className="text-foreground">Additional Details (Optional)</Label>
                    <Textarea
                      id="suggestion-description"
                      value={suggestionData.description}
                      onChange={(e) => setSuggestionData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Tell us more about why you want this content..."
                      className="bg-background/50 border-border/50 focus:border-primary"
                      rows={3}
                      disabled={createDemandMutation.isPending}
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleCancel}
                      className="bg-background/50 border-border/50 hover:bg-background/70"
                      disabled={createDemandMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
                      disabled={createDemandMutation.isPending}
                    >
                      {createDemandMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Submit Request
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="flex flex-col items-center space-y-4">
            {upcomingContent && upcomingContent.length > 0 ? (
              upcomingContent.map((content, index) => (
                <UpcomingCard
                  key={`${content.id}-${content.content_order}`}
                  title={content.title}
                  description={content.description || ''}
                  image={content.thumbnail_url || '/placeholder.svg'}
                  releaseDate={new Date(content.release_date)}
                  contentOrder={content.content_order}
                  priorityPosition={index + 1}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No upcoming content available at the moment.</p>
                <p className="text-sm text-muted-foreground mt-2">Check back later for new releases!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;