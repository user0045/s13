import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UpcomingCardProps {
  title: string;
  description: string;
  image: string;
  releaseDate: Date;
  contentOrder: number;
  priorityPosition?: number;
}

const UpcomingCard: React.FC<UpcomingCardProps> = ({ 
  title, 
  description, 
  image, 
  releaseDate,
  contentOrder,
  priorityPosition 
}) => {
  const navigate = useNavigate();

  // Calculate days until release
  const today = new Date();
  const timeDiff = releaseDate.getTime() - today.getTime();
  const daysUntilRelease = Math.ceil(timeDiff / (1000 * 3600 * 24));

  // Format release date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleMoreInfoClick = () => {
    const upcomingContent = {
      title,
      description,
      image,
      releaseDate,
      contentOrder,
      type: 'Upcoming',
      expectedGenre: ['Action', 'Adventure'],
      platform: 'Netflix',
      announcementDate: 'March 2024',
      source: 'Official Press Release',
      productionCompany: 'Marvel Studios',
      budget: '$200M',
      filmingStatus: 'Post-Production',
      filmingLocation: 'Atlanta, GA',
      targetAudience: 'PG-13',
      expectedRuntime: '150 min',
      posterImage: true,
      trailerAvailable: true,
      announcementDetails: description
    };

    navigate('/upcoming-more-info', { state: upcomingContent });
  };

  const handleTrailerClick = () => {
    console.log('Play trailer for:', title);
  };

  return (
    <div className="w-full max-w-4xl bg-gradient-to-r from-black/20 via-dark-green/5 to-black/20 backdrop-blur-sm border border-border/30 rounded-lg overflow-hidden hover:scale-105 transition-all duration-500 ease-out hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20 card-hover-wave">
      <div className="flex h-44">
        {/* Left side - Thumbnail (1/3 width) */}
        <div className="w-1/3 flex-shrink-0">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right side - Content (2/3 width) */}
        <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-r from-transparent via-black/20 to-black/40">
          <div>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-foreground line-clamp-2 flex-1 mr-3">
                {title}
              </h3>
              <span className="text-xs text-primary bg-primary/20 px-2 py-1 rounded-full border border-primary/30 flex-shrink-0">
                #{priorityPosition || contentOrder}
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1 bg-emerald-800/20 px-3 py-1 rounded-md border border-emerald-700/30">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-100 font-medium text-xs">{formatDate(releaseDate)}</span>
              </div>
              {daysUntilRelease > 0 && (
                <div className="flex items-center space-x-1 bg-primary/20 px-3 py-1 rounded-md border border-primary/30">
                  <Clock className="w-3 h-3 text-primary" />
                  <span className="text-primary font-medium text-xs">
                    Available in {daysUntilRelease} days
                  </span>
                </div>
              )}
            </div>

            <p className="text-sm font-light text-foreground/90 line-clamp-3 mb-4 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex space-x-3">
            <Button 
              size="sm" 
              onClick={handleTrailerClick}
              className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300 font-medium text-xs px-4 py-2"
            >
              <Play className="w-3 h-3 mr-1" />
              Trailer
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleMoreInfoClick}
              className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/30 hover:via-dark-green/5 hover:to-black/30 hover:border-primary/20 transition-all duration-300 font-medium text-xs px-4 py-2"
            >
              <Info className="w-3 h-3 mr-1" />
              More Info
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingCard;