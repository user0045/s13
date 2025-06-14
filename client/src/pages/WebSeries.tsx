
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';

const WebSeries = () => {
  const navigate = useNavigate();
  const { data: allContent, isLoading: allContentLoading } = useAllContent();
  const { data: heroContent } = useContentByFeature('Home Hero');
  const { data: newReleases } = useContentByFeature('Home New Release');
  const { data: popular } = useContentByFeature('Home Popular');
  const { data: actionContent } = useContentByGenre('Action');
  const { data: comedyContent } = useContentByGenre('Comedy');
  const { data: crimeContent } = useContentByGenre('Crime');
  const { data: dramaContent } = useContentByGenre('Drama');
  const { data: horrorContent } = useContentByGenre('Horror');
  const { data: familyContent } = useContentByGenre('Family');
  const { data: thrillerContent } = useContentByGenre('Thriller');
  const { data: sciFiContent } = useContentByGenre('Sci-Fi');

  if (allContentLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading web series...</div>
      </div>
    );
  }

  const webSeries = allContent?.webSeries || [];

  // Filter web series for hero content
  const heroWebSeries = heroContent?.filter(content => content.content_type === 'Web Series').map(content => ({
    id: content.id,
    title: content.title,
    description: content.web_series?.description || content.description,
    rating: content.web_series?.rating_type || 'TV-MA',
    year: content.web_series?.release_year?.toString() || content.created_at?.split('-')[0],
    score: content.web_series?.rating?.toString() || '8.0',
    image: content.web_series?.thumbnail_url || content.thumbnail_url,
    videoUrl: content.web_series?.seasons?.[0]?.episodes?.[0]?.video_url
  })) || [];

  // Filter web series for sections
  const getWebSeriesFromContent = (contentArray: any[]) => {
    return contentArray?.filter(content => content.content_type === 'Web Series').map(content => ({
      id: content.id,
      title: content.title,
      rating: content.web_series?.rating_type || 'TV-MA',
      score: content.web_series?.rating?.toString() || '8.0',
      image: content.web_series?.thumbnail_url || content.thumbnail_url,
      year: content.web_series?.release_year?.toString() || content.created_at?.split('-')[0],
      description: content.web_series?.description || content.description,
      type: 'series'
    })) || [];
  };

  const sections = [
    { title: 'New Releases', contents: getWebSeriesFromContent(newReleases) },
    { title: 'Popular', contents: getWebSeriesFromContent(popular) },
    { title: 'Action & Adventure', contents: getWebSeriesFromContent(actionContent) },
    { title: 'Comedy', contents: getWebSeriesFromContent(comedyContent) },
    { title: 'Crime', contents: getWebSeriesFromContent(crimeContent) },
    { title: 'Drama', contents: getWebSeriesFromContent(dramaContent) },
    { title: 'Horror', contents: getWebSeriesFromContent(horrorContent) },
    { title: 'Family', contents: getWebSeriesFromContent(familyContent) },
    { title: 'Thriller', contents: getWebSeriesFromContent(thrillerContent) },
    { title: 'Sci-Fi', contents: getWebSeriesFromContent(sciFiContent) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {heroWebSeries.length > 0 && <HeroSlider contents={heroWebSeries} />}
      
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

export default WebSeries;
