
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Info, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HomeHero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const heroContent = {
    id: 1,
    title: "The Dark Crystal: Age of Resistance",
    description: "In the mystical world of Thra, three Gelfling discover the horrifying secret behind the Skeksis' power and set out on an epic journey to ignite the fires of rebellion.",
    rating: "TV-PG",
    year: "2019",
    score: "8.5",
    image: "/placeholder.svg",
    type: "Web Series",
    videoUrl: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4"
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const handlePlayClick = () => {
    navigate('/player', { state: heroContent });
  };

  const handleMoreInfoClick = () => {
    navigate('/more-info', { state: heroContent });
  };

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover hero-video"
        autoPlay
        loop
        muted={isMuted}
        playsInline
      >
        <source src={heroContent.videoUrl} type="video/mp4" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
      </video>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 content-overlay" />

      {/* Content Card */}
      <div className="absolute inset-0 flex items-center">
        <div className="container mx-auto px-6">
          <div
            className={`max-w-lg backdrop-blur-sm rounded-lg p-3 transition-all duration-700 ease-out pointer-events-auto ${
              isHovered 
                ? 'transform scale-100 opacity-100 bg-transparent backdrop-blur-md' 
                : 'transform scale-[0.6] opacity-20 bg-black/20'
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h1 className="text-xl font-thin mb-2 text-foreground animate-fade-in">
              {heroContent.title}
            </h1>
            
            <div className="flex items-center space-x-2 mb-2 text-xs text-muted-foreground animate-slide-up">
              <span className="bg-primary/20 text-primary px-2 py-1 rounded border border-primary/30 text-xs">
                {heroContent.rating}
              </span>
              <span className="font-thin">{heroContent.year}</span>
              <div className="flex items-center space-x-1">
                <span className="text-yellow-400">★</span>
                <span className="font-thin">{heroContent.score}</span>
              </div>
            </div>

            <p className="text-xs font-thin text-foreground/90 mb-4 leading-relaxed animate-slide-up">
              {heroContent.description}
            </p>

            <div className="flex justify-center space-x-3 animate-scale-in">
              <Button 
                onClick={handlePlayClick}
                className="bg-primary/10 backdrop-blur-sm border border-primary/50 text-primary hover:bg-gradient-to-br hover:from-black/60 hover:via-dark-green/10 hover:to-black/60 hover:border-primary/30 transition-all duration-300 font-medium text-sm px-6 py-2 min-w-[100px] flex-1 max-w-[120px]"
              >
                <Play className="w-4 h-4 mr-2" />
                Play
              </Button>
              <Button 
                onClick={handleMoreInfoClick}
                variant="outline" 
                className="bg-primary/5 backdrop-blur-sm border border-primary/30 text-primary hover:bg-gradient-to-br hover:from-black/30 hover:via-dark-green/5 hover:to-black/30 hover:border-primary/20 transition-all duration-300 font-medium text-sm px-6 py-2 min-w-[100px] flex-1 max-w-[120px]"
              >
                <Info className="w-4 h-4 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mute Toggle */}
      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 p-2 backdrop-blur-sm rounded-full hover:bg-card/40 transition-all duration-200"
      >
        {isMuted ? <VolumeX className="w-4 h-4 stroke-1" /> : <Volume2 className="w-4 h-4 stroke-1" />}
      </button>
    </div>
  );
};

export default HomeHero;
