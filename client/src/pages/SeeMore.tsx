
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import ContentCard from '@/components/ContentCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const SeeMore = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title, contents } = location.state || { title: 'Content', contents: [] };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Add top padding to account for fixed header */}
      <div className="pt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="bg-transparent border border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-lg font-thin text-foreground text-left uppercase tracking-[0.2em]" style={{ fontFamily: 'serif' }}>
              {title}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {contents.map((content: any) => (
              <div key={content.id} className="w-full">
                <ContentCard {...content} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeeMore;
