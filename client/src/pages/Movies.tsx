
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import HorizontalSection from '@/components/HorizontalSection';
import { useAllContent, useContentByFeature, useContentByGenre } from '@/hooks/useContentQueries';

const Movies = () => {
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
        <div className="text-foreground">Loading movies...</div>
      </div>
    );
  }

  const movies = allContent?.movies || [];

  // Filter movies for hero content
  const heroMovies = heroContent?.filter(content => content.content_type === 'Movie').map(content => ({
    id: content.id,
    title: content.title,
    description: content.movie?.description || content.description,
    rating: content.movie?.rating_type || 'PG-13',
    year: content.movie?.release_year?.toString() || content.created_at?.split('-')[0],
    score: content.movie?.rating?.toString() || '8.0',
    image: content.movie?.thumbnail_url || content.thumbnail_url,
    videoUrl: content.movie?.video_url
  })) || [];

  // Filter movies for sections
  const getMoviesFromContent = (contentArray: any[]) => {
    return contentArray?.filter(content => content.content_type === 'Movie').map(content => ({
      id: content.id,
      title: content.title,
      rating: content.movie?.rating_type || 'PG-13',
      score: content.movie?.rating?.toString() || '8.0',
      image: content.movie?.thumbnail_url || content.thumbnail_url,
      year: content.movie?.release_year?.toString() || content.created_at?.split('-')[0],
      description: content.movie?.description || content.description,
      type: 'movie'
    })) || [];
  };

  const sections = [
    { title: 'New Releases', contents: getMoviesFromContent(newReleases) },
    { title: 'Popular', contents: getMoviesFromContent(popular) },
    { title: 'Action & Adventure', contents: getMoviesFromContent(actionContent) },
    { title: 'Comedy', contents: getMoviesFromContent(comedyContent) },
    { title: 'Crime', contents: getMoviesFromContent(crimeContent) },
    { title: 'Drama', contents: getMoviesFromContent(dramaContent) },
    { title: 'Horror', contents: getMoviesFromContent(horrorContent) },
    { title: 'Family', contents: getMoviesFromContent(familyContent) },
    { title: 'Thriller', contents: getMoviesFromContent(thrillerContent) },
    { title: 'Sci-Fi', contents: getMoviesFromContent(sciFiContent) },
  ];

  const handleSeeMore = (title: string, contents: any[]) => {
    navigate('/see-more', { state: { title, contents } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {heroMovies.length > 0 && <HeroSlider contents={heroMovies} />}
      
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

export default Movies;
