
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Play, Calendar, Clock } from 'lucide-react';

const UpcomingMoreInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = location.state || {};

  const handleTrailerClick = () => {
    console.log('Play trailer for:', content.title);
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/30 hover:via-dark-green/5 hover:to-black/30 hover:border-primary/20 transition-all duration-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>

          <Card className="bg-gradient-to-br from-black/90 via-dark-green/20 to-black/90 backdrop-blur-sm border border-border/50 wave-transition">
            <CardHeader>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="w-full aspect-[16/9] relative p-6">
                    <img src={content.image || '/placeholder.svg'} alt={content.title} className="w-full h-full object-cover rounded-lg" />
                  </div>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  <h1 className="text-3xl font-thin text-foreground">
                    {content.title}
                  </h1>
                  
                  <div className="flex items-center space-x-4 flex-wrap">
                    {content.ratingType && (
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 text-xs font-medium">
                        {content.ratingType}
                      </span>
                    )}
                    {content.contentType && (
                      <span className="bg-secondary/20 text-secondary px-3 py-1 rounded border border-secondary/30 text-sm font-medium">
                        {content.contentType}
                      </span>
                    )}
                    {content.releaseDate && (
                      <div className="flex items-center space-x-2 bg-emerald-800/20 px-3 py-1 rounded-md border border-emerald-700/30">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-100 font-medium text-sm">
                          {new Date(content.releaseDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {content.description && (
                    <div>
                      <p className="text-foreground/90 leading-relaxed text-lg">
                        {content.description || content.announcementDetails}
                      </p>
                    </div>
                  )}

                  <div className="flex">
                    <Button onClick={handleTrailerClick} className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300 px-8 py-3">
                      <Play className="h-5 w-5 mr-2" />
                      Trailer
                    </Button>
                  </div>

                  {content.directors && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Directors</h3>
                      <p className="text-foreground/90">
                        {Array.isArray(content.directors) ? content.directors.join(', ') : content.directors}
                      </p>
                    </div>
                  )}

                  {content.writers && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Writers</h3>
                      <p className="text-foreground/90">
                        {Array.isArray(content.writers) ? content.writers.join(', ') : content.writers}
                      </p>
                    </div>
                  )}

                  {content.cast && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Cast</h3>
                      <p className="text-foreground/90">
                        {Array.isArray(content.cast) ? content.cast.join(', ') : content.cast}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UpcomingMoreInfo;
