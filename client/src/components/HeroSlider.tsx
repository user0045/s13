
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideContent {
  id: number;
  title: string;
  description: string;
  rating: string;
  year: string;
  score: string;
  image: string;
  videoUrl?: string;
  type?: string;
}

interface HeroSliderProps {
  contents: SlideContent[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ contents }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);
  const [isInfoCardHovered, setIsInfoCardHovered] = useState(false);
  const [hoveredSlide, setHoveredSlide] = useState<number | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const containerRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSliderHovered && !isInfoCardHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % contents.length);
      }, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSliderHovered, isInfoCardHovered, contents.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current && infoCardRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const infoCardRect = infoCardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const centerX = rect.width / 2;
      
      const isOverInfoCard = (
        e.clientX >= infoCardRect.left &&
        e.clientX <= infoCardRect.right &&
        e.clientY >= infoCardRect.top &&
        e.clientY <= infoCardRect.bottom
      );

      if (x < centerX) {
        setShowLeftArrow(true);
        setShowRightArrow(false);
      } else {
        setShowLeftArrow(false);
        setShowRightArrow(true);
      }
    }
  };

  const handleSliderMouseEnter = () => {
    setIsSliderHovered(true);
  };

  const handleSliderMouseLeave = () => {
    setIsSliderHovered(false);
    setHoveredSlide(null);
    setShowLeftArrow(false);
    setShowRightArrow(false);
  };

  const handleInfoCardMouseEnter = () => {
    setIsInfoCardHovered(true);
  };

  const handleInfoCardMouseLeave = () => {
    setIsInfoCardHovered(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % contents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + contents.length) % contents.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handlePlayClick = () => {
    const currentContent = contents[currentSlide];
    navigate('/player', { state: currentContent });
  };

  const handleMoreInfoClick = () => {
    const currentContent = contents[currentSlide];
    navigate('/more-info', { state: currentContent });
  };

  return (
    <div 
      ref={containerRef}
      className="relative h-[85vh] w-full overflow-hidden"
      onMouseEnter={handleSliderMouseEnter}
      onMouseLeave={handleSliderMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Slides */}
      <div className="relative h-full">
        {contents.map((content, index) => (
          <div
            key={content.id}
            className={`absolute inset-0 transition-all duration-700 ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          >
            {hoveredSlide === index ? (
              <video
                className="w-full h-full object-cover hero-video"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src={content.videoUrl || content.image} type="video/mp4" />
              </video>
            ) : (
              <img
                src={content.image}
                alt={content.title}
                className="w-full h-full object-cover hero-video"
              />
            )}
            
            <div className="absolute inset-0 content-overlay" />
            
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-6">
                <div 
                  ref={infoCardRef}
                  className={`max-w-lg backdrop-blur-sm rounded-lg p-3 transition-all duration-700 ease-out pointer-events-auto ${
                    isInfoCardHovered 
                      ? 'transform scale-100 opacity-100 bg-transparent backdrop-blur-md' 
                      : 'transform scale-[0.6] opacity-20 bg-black/20'
                  }`}
                  onMouseEnter={handleInfoCardMouseEnter}
                  onMouseLeave={handleInfoCardMouseLeave}
                >
                  <h1 className="text-xl font-thin mb-2 text-foreground animate-fade-in">
                    {content.title}
                  </h1>
                  
                  <div className="flex items-center space-x-2 mb-2 text-xs text-muted-foreground animate-slide-up">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 text-xs">
                      {content.rating}
                    </span>
                    <span className="font-thin">{content.year}</span>
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="font-thin">{content.score}</span>
                    </div>
                  </div>

                  <p className="text-xs font-thin text-foreground/90 mb-4 leading-relaxed animate-slide-up">
                    {content.description}
                  </p>

                  <div className="flex justify-center space-x-3 animate-scale-in">
                    <Button 
                      onClick={handlePlayClick}
                      className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 hover:scale-105 transition-all duration-300 font-medium text-sm px-6 py-2 min-w-[100px] flex-1 max-w-[120px]"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </Button>
                    <Button 
                      onClick={handleMoreInfoClick}
                      variant="outline" 
                      className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/30 hover:via-dark-green/5 hover:to-black/30 hover:border-primary/20 hover:scale-105 transition-all duration-300 font-medium text-sm px-6 py-2 min-w-[100px] flex-1 max-w-[120px]"
                    >
                      <Info className="w-4 h-4 mr-2" />
                      More Info
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {showLeftArrow && (
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 p-3 border border-primary/30 rounded-full hover:bg-dark-green/50 hover:arrow-hover-bg transition-all duration-200 text-primary z-20"
        >
          <ChevronLeft className="w-5 h-5 stroke-1" />
        </button>
      )}

      {showRightArrow && (
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 p-3 border border-primary/30 rounded-full hover:bg-dark-green/50 hover:arrow-hover-bg transition-all duration-200 text-primary z-20"
        >
          <ChevronRight className="w-5 h-5 stroke-1" />
        </button>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {contents.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            onMouseEnter={() => setHoveredSlide(index)}
            className={`w-12 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary' 
                : 'bg-border hover:bg-primary/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
