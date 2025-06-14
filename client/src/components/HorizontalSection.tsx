
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ContentCard from './ContentCard';
import { Button } from '@/components/ui/button';

interface Content {
  id: number;
  title: string;
  rating: string;
  score: string;
  image: string;
  year?: string;
}

interface HorizontalSectionProps {
  title: string;
  contents: Content[];
  onSeeMore?: () => void;
}

const HorizontalSection: React.FC<HorizontalSectionProps> = ({ title, contents, onSeeMore }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 340;
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  return (
    <div className="mb-8 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <h2 className="section-title">{title}</h2>
        
        <div className="flex space-x-2">
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="p-2 border border-primary/30 rounded-full hover:bg-dark-green/50 hover:arrow-hover-bg transition-all duration-200 text-primary"
            >
              <ChevronLeft className="w-4 h-4 stroke-1" />
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="p-2 border border-primary/30 rounded-full hover:bg-dark-green/50 hover:arrow-hover-bg transition-all duration-200 text-primary"
            >
              <ChevronRight className="w-4 h-4 stroke-1" />
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto horizontal-scroll pb-4"
          onScroll={handleScroll}
        >
          {contents.map((content) => (
            <ContentCard key={content.id} {...content} />
          ))}
          
          {/* See More Button */}
          <div className="min-w-[320px] h-[180px] flex items-center justify-center">
            <Button
              onClick={onSeeMore}
              variant="outline"
              className="border-primary/50 hover:border-primary hover:bg-primary/10 text-primary h-8 px-4 font-thin text-sm"
            >
              See More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorizontalSection;
