
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Play, Star } from 'lucide-react';

const MoreInfo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = location.state || {};

  const handlePlayClick = () => {
    navigate('/player', {
      state: content
    });
  };

  const getSeasonsOrEpisodes = () => {
    if (content.type === 'Movie') {
      return content.duration ? `${content.duration} min` : null;
    } else if (content.type === 'Web Series') {
      const seasons = content.seasons || 1;
      return `${seasons} Season${seasons > 1 ? 's' : ''}`;
    } else if (content.type === 'Show') {
      const episodes = content.episodes || 10;
      return `${episodes} Episode${episodes > 1 ? 's' : ''}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300">
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
                  
                  {content.type && (
                    <div>
                      <span className="bg-secondary/20 text-secondary px-3 py-1 rounded border border-secondary/30 text-sm font-medium">
                        {content.type}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 flex-wrap">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded border border-primary/30 font-medium">
                      {content.rating}
                    </span>
                    <span className="text-muted-foreground font-medium">{content.year}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-foreground font-medium">{content.score}</span>
                    </div>
                    {getSeasonsOrEpisodes() && (
                      <span className="text-muted-foreground font-medium">{getSeasonsOrEpisodes()}</span>
                    )}
                  </div>

                  <div className="flex">
                    <Button onClick={handlePlayClick} className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300 px-8 py-3">
                      <Play className="h-5 w-5 mr-2" />
                      Play
                    </Button>
                  </div>

                  {content.genre && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Genre</h3>
                      <p className="text-foreground/90">
                        {Array.isArray(content.genre) ? content.genre.join(', ') : content.genre}
                      </p>
                    </div>
                  )}

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

                  {content.description && (
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
                      <p className="text-foreground/90 leading-relaxed">
                        {content.description}
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

export default MoreInfo;
