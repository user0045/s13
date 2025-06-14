
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Film, Tv, Calendar, Search, X, Monitor } from 'lucide-react';
import { mockContent } from '@/data/mockContent';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Hide header on admin page
  if (location.pathname === '/admin') {
    return null;
  }

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Movies', path: '/movies', icon: Film },
    { name: 'Web Series', path: '/web-series', icon: Tv },
    { name: 'Shows', path: '/tv-shows', icon: Monitor },
    { name: 'Upcoming', path: '/upcoming', icon: Calendar },
  ];

  // Filter content based on search query
  const searchResults = searchQuery.length > 0 ? 
    mockContent.filter(content => 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (content.description && content.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (content.genre && Array.isArray(content.genre) && content.genre.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())))
    ).slice(0, 5) : [];

  const handleSearchItemClick = (content: any) => {
    navigate('/more-info', { state: content });
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            StreamFlix
          </Link>
          
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-8">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 text-sm font-medium transition-all duration-200 hover:text-primary ${
                    location.pathname === item.path
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="relative">
            {!isSearchOpen ? (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5 stroke-1" />
              </button>
            ) : (
              <div className="flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search content..."
                    className="w-64 bg-background/80 border border-border/50 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    autoFocus
                  />
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-background/90 backdrop-blur-md border border-border/50 rounded-lg max-h-64 overflow-y-auto z-50">
                      {searchResults.map((content, index) => (
                        <div
                          key={content.id || index}
                          onClick={() => handleSearchItemClick(content)}
                          className="px-4 py-3 text-sm text-foreground hover:bg-card/50 cursor-pointer border-b border-border/30 last:border-b-0 flex items-center space-x-3"
                        >
                          <img 
                            src={content.image} 
                            alt={content.title}
                            className="w-10 h-6 object-cover rounded"
                          />
                          <div className="flex-1">
                            <div className="font-medium">{content.title}</div>
                            <div className="text-xs text-muted-foreground">
                              {content.type} • {content.year}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className="ml-2 p-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4 stroke-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
