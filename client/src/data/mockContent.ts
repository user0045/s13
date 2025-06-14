export interface Content {
  id: number;
  title: string;
  rating: string;
  score: string;
  image: string;
  year: string;
  type: 'movie' | 'series' | 'tv';
  genre: string[];
  description: string;
}

export const mockContent: Content[] = [
  {
    id: 1,
    title: "Stranger Things",
    rating: "TV-14",
    score: "8.7",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400",
    year: "2016",
    type: "series",
    genre: ["Sci-Fi", "Horror", "Drama"],
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments."
  },
  {
    id: 2,
    title: "The Dark Knight",
    rating: "PG-13",
    score: "9.0",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    year: "2008",
    type: "movie",
    genre: ["Action", "Crime", "Drama"],
    description: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham into anarchy."
  },
  {
    id: 3,
    title: "Breaking Bad",
    rating: "TV-MA",
    score: "9.5",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400",
    year: "2008",
    type: "series",
    genre: ["Crime", "Drama", "Thriller"],
    description: "A chemistry teacher turned methamphetamine manufacturer partners with a former student."
  },
  {
    id: 4,
    title: "Inception",
    rating: "PG-13",
    score: "8.8",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
    year: "2010",
    type: "movie",
    genre: ["Sci-Fi", "Action", "Thriller"],
    description: "A thief who steals corporate secrets through dream-sharing technology."
  },
  {
    id: 5,
    title: "The Crown",
    rating: "TV-MA",
    score: "8.6",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
    year: "2016",
    type: "series",
    genre: ["Drama", "Biography"],
    description: "The reign of Queen Elizabeth II from the 1940s to modern times."
  },
  {
    id: 6,
    title: "Avengers: Endgame",
    rating: "PG-13",
    score: "8.4",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400",
    year: "2019",
    type: "movie",
    genre: ["Action", "Adventure", "Sci-Fi"],
    description: "The Avengers assemble once more to reverse Thanos' actions."
  },
  {
    id: 7,
    title: "The Witcher",
    rating: "TV-MA",
    score: "8.2",
    image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?w=400",
    year: "2019",
    type: "series",
    genre: ["Fantasy", "Adventure", "Drama"],
    description: "Geralt of Rivia, a monster hunter, struggles to find his place in a world."
  },
  {
    id: 8,
    title: "Parasite",
    rating: "R",
    score: "8.6",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    year: "2019",
    type: "movie",
    genre: ["Thriller", "Drama", "Comedy"],
    description: "A poor family schemes to become employed by a wealthy family."
  },
  {
    id: 9,
    title: "Money Heist",
    rating: "TV-MA",
    score: "8.3",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400",
    year: "2017",
    type: "series",
    genre: ["Crime", "Drama", "Thriller"],
    description: "An unusual group of robbers attempt to carry out the most perfect robbery."
  },
  {
    id: 10,
    title: "Joker",
    rating: "R",
    score: "8.4",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
    year: "2019",
    type: "movie",
    genre: ["Crime", "Drama", "Thriller"],
    description: "A failed comedian is driven insane and turns to a life of crime."
  },
  {
    id: 11,
    title: "Game of Thrones",
    rating: "TV-MA",
    score: "9.3",
    image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400",
    year: "2011",
    type: "series",
    genre: ["Fantasy", "Drama", "Adventure"],
    description: "Nine noble families fight for control over the mythical lands of Westeros."
  }
];

export const getContentByGenre = (genre: string): Content[] => {
  return mockContent.filter(content => 
    content.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
  );
};

export const getContentByType = (type: 'movie' | 'series' | 'tv'): Content[] => {
  return mockContent.filter(content => content.type === type);
};

export const getNewReleases = (): Content[] => {
  return mockContent.filter(content => parseInt(content.year) >= 2019);
};

export const getPopular = (): Content[] => {
  return mockContent.filter(content => parseFloat(content.score) >= 8.5);
};

// Mock data for upcoming content
export const getUpcomingContent = () => [
  {
    id: '1',
    title: 'Avatar 3',
    description: 'The next chapter in the Avatar saga continues the story of the Sully family.',
    releaseDate: '2024-12-20',
    contentType: 'Movie' as const,
    thumbnailUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400',
    trailerUrl: 'https://example.com/avatar3-trailer',
    contentOrder: 1,
    genre: ['Sci-Fi', 'Adventure'],
    castMembers: ['Sam Worthington', 'Zoe Saldana'],
    directors: ['James Cameron'],
    writers: ['James Cameron'],
    ratingType: 'PG-13'
  },
];