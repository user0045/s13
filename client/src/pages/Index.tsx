import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HomeHero from '@/components/HomeHero';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { data: allContent, isLoading: allContentLoading } = useAllContent();
  const { data: heroContent } = useContentByFeature('Home Hero');
  const { data: newReleases } = useContentByFeature('Home New Release');
  const { data: popular } = useContentByFeature('Home Popular');
  const { data: actionContent } = useContentByGenre('Action');
  const { data: comedyContent } = useContentByGenre('Comedy');
  const { data: dramaContent } = useContentByGenre('Drama');

  if (allContentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading content...</div>
      </div>
    );
  }

  // Transform database content to display format
  const transformContent = (contentArray: any[]) => {
    return contentArray?.map(content => {
      let contentData;
      let type = 'movie';

      if (content.content_type === 'Movie') {
        contentData = content.movie;
        type = 'movie';
      } else if (content.content_type === 'Show') {
        contentData = content.show;
        type = 'series';
      } else if (content.content_type === 'Web Series') {
        contentData = content.web_series;
        type = 'series';
      }

      return {
        id: content.id,
        title: content.title,
        rating: contentData?.rating_type || 'PG-13',
        score: contentData?.rating?.toString() || '8.0',
        image: contentData?.thumbnail_url || content.thumbnail_url,
        year: contentData?.release_year?.toString() || content.created_at?.split('-')[0],
        description: contentData?.description || content.description,
        type
      };
    }) || [];
  };

  const sections = [
    { title: 'New Releases', contents: transformContent(newReleases) },
    { title: 'Popular Now', contents: transformContent(popular) },
    { title: 'Action & Adventure', contents: transformContent(actionContent) },
    { title: 'Comedy', contents: transformContent(comedyContent) },
    { title: 'Drama', contents: transformContent(dramaContent) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HomeHero content={transformContent(heroContent || [])} />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {sections.map((section) => (
          section.contents.length > 0 && (
            <HorizontalSection
              key={section.title}
              title={section.title}
              contents={section.contents}
              onSeeMore={() => handleSeeMore(section.title, section.contents)}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default Index;