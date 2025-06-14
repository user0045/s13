
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';

const TvShows = () => {
  const navigate = useNavigate();
  const { data: allContent, isLoading: allContentLoading } = useAllContent();
  const { data: heroContent } = useContentByFeature('Home Hero');
  const { data: newReleases } = useContentByFeature('Home New Release');
  const { data: popular } = useContentByFeature('Home Popular');
  const { data: actionContent } = useContentByGenre('Action');
  const { data: comedyContent } = useContentByGenre('Comedy');
  const { data: crimeContent } = useContentByGenre('Crime');
  const { data: dramaContent } = useContentByGenre('Drama');
  const { data: realityContent } = useContentByGenre('Reality');

  if (allContentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading TV shows...</div>
      </div>
    );
  }

  const shows = allContent?.shows || [];

  // Filter shows for hero content
  const heroShows = heroContent?.filter(content => content.content_type === 'Show').map(content => ({
    id: content.id,
    title: content.title,
    description: content.show?.description || content.description,
    rating: content.show?.rating_type || 'TV-14',
    year: content.show?.release_year?.toString() || content.created_at?.split('-')[0],
    score: content.show?.rating?.toString() || '8.0',
    image: content.show?.thumbnail_url || content.thumbnail_url,
    videoUrl: content.show?.episodes?.[0]?.video_url
  })) || [];

  // Filter shows for sections
  const getShowsFromContent = (contentArray: any[]) => {
    return contentArray?.filter(content => content.content_type === 'Show').map(content => ({
      id: content.id,
      title: content.title,
      rating: content.show?.rating_type || 'TV-14',
      score: content.show?.rating?.toString() || '8.0',
      image: content.show?.thumbnail_url || content.thumbnail_url,
      year: content.show?.release_year?.toString() || content.created_at?.split('-')[0],
      description: content.show?.description || content.description,
      type: 'series'
    })) || [];
  };

  const sections = [
    { title: 'New Releases', contents: getShowsFromContent(newReleases) },
    { title: 'Popular', contents: getShowsFromContent(popular) },
    { title: 'Entertainment', contents: getShowsFromContent(comedyContent) },
    { title: 'Reality Shows', contents: getShowsFromContent(realityContent) },
    { title: 'Family Drama', contents: getShowsFromContent(dramaContent) },
    { title: 'Action & Adventure', contents: getShowsFromContent(actionContent) },
    { title: 'Crime', contents: getShowsFromContent(crimeContent) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {heroShows.length > 0 && <HeroSlider contents={heroShows} />}
      
      <div className="container mx-auto px-6 py-4 space-y-4">
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

export default TvShows;
