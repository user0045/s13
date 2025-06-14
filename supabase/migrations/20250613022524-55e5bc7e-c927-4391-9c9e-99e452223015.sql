
-- Create enum types for reusable values
CREATE TYPE content_type_enum AS ENUM ('Movie', 'Web Series', 'Show');
CREATE TYPE rating_type_enum AS ENUM ('G', 'PG', 'PG-13', 'R', 'NC-17', 'TV-Y', 'TV-Y7', 'TV-G', 'TV-PG', 'TV-14', 'TV-MA');

-- Create upload_content table
CREATE TABLE public.upload_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_type content_type_enum NOT NULL,
    genre TEXT[] DEFAULT '{}',
    content_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create upcoming_content table
CREATE TABLE public.upcoming_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_type content_type_enum NOT NULL,
    genre TEXT[] DEFAULT '{}',
    release_date DATE NOT NULL,
    content_order INTEGER,
    rating_type rating_type_enum,
    directors TEXT[] DEFAULT '{}',
    writers TEXT[] DEFAULT '{}',
    cast_members TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    description TEXT,
    trailer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create movie table
CREATE TABLE public.movie (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    description TEXT,
    release_year INTEGER,
    rating_type rating_type_enum,
    rating DECIMAL(3,1),
    duration INTEGER, -- in minutes
    director TEXT[] DEFAULT '{}',
    writer TEXT[] DEFAULT '{}',
    cast_members TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    trailer_url TEXT,
    video_url TEXT,
    feature_in TEXT[] DEFAULT '{}',
    views BIGINT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create web_series table
CREATE TABLE public.web_series (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_id_list UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create season table
CREATE TABLE public.season (
    season_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    season_description TEXT,
    release_year INTEGER,
    rating_type rating_type_enum,
    rating DECIMAL(3,1),
    director TEXT[] DEFAULT '{}',
    writer TEXT[] DEFAULT '{}',
    cast_members TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    trailer_url TEXT,
    feature_in TEXT[] DEFAULT '{}',
    episode_id_list UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create episode table
CREATE TABLE public.episode (
    episode_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    duration INTEGER, -- in minutes
    video_url TEXT,
    thumbnail_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create show table
CREATE TABLE public.show (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    content_type content_type_enum DEFAULT 'Show',
    release_year INTEGER,
    rating_type rating_type_enum,
    rating DECIMAL(3,1),
    thumbnail_url TEXT,
    trailer_url TEXT,
    genres TEXT[] DEFAULT '{}',
    directors TEXT[] DEFAULT '{}',
    writers TEXT[] DEFAULT '{}',
    cast_members TEXT[] DEFAULT '{}',
    feature_in TEXT[] DEFAULT '{}',
    episode_id_list UUID[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create demand table
CREATE TABLE public.demand (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_type content_type_enum NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    user_ip INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraints
ALTER TABLE public.upload_content 
ADD CONSTRAINT fk_upload_content_movie 
FOREIGN KEY (content_id) REFERENCES public.movie(content_id) ON DELETE CASCADE;

-- Enable Row Level Security on all tables
ALTER TABLE public.upload_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.web_series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.season ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episode ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.show ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demand ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (you can modify these based on your needs)
CREATE POLICY "Allow public read access" ON public.upload_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.upcoming_content FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.movie FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.web_series FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.season FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.episode FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.show FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.demand FOR SELECT USING (true);

-- Create policies for admin insert/update/delete (you'll need to implement authentication)
CREATE POLICY "Allow admin write access" ON public.upload_content FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON public.upcoming_content FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON public.movie FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON public.web_series FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON public.season FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON public.episode FOR ALL USING (true);
CREATE POLICY "Allow admin write access" ON public.show FOR ALL USING (true);

-- Allow anyone to insert demands (content requests)
CREATE POLICY "Allow public insert demands" ON public.demand FOR INSERT WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_upload_content_type ON public.upload_content(content_type);
CREATE INDEX idx_upcoming_content_release_date ON public.upcoming_content(release_date);
CREATE INDEX idx_movie_release_year ON public.movie(release_year);
CREATE INDEX idx_movie_views ON public.movie(views);
CREATE INDEX idx_demand_date ON public.demand(date);
CREATE INDEX idx_demand_content_type ON public.demand(content_type);

-- Create function to update views for movies
CREATE OR REPLACE FUNCTION public.increment_movie_views(movie_content_id UUID)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.movie 
    SET views = views + 1, updated_at = now()
    WHERE content_id = movie_content_id;
END;
$$;

-- Create function to get content by type
CREATE OR REPLACE FUNCTION public.get_content_by_type(content_type_filter content_type_enum)
RETURNS TABLE (
    id UUID,
    title TEXT,
    content_type content_type_enum,
    thumbnail_url TEXT,
    rating DECIMAL,
    release_year INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
    IF content_type_filter = 'Movie' THEN
        RETURN QUERY
        SELECT 
            uc.content_id as id,
            uc.title,
            uc.content_type,
            m.thumbnail_url,
            m.rating,
            m.release_year
        FROM public.upload_content uc
        JOIN public.movie m ON uc.content_id = m.content_id
        WHERE uc.content_type = 'Movie';
    ELSIF content_type_filter = 'Show' THEN
        RETURN QUERY
        SELECT 
            s.id,
            s.title,
            s.content_type,
            s.thumbnail_url,
            s.rating,
            s.release_year
        FROM public.show s;
    -- Add more conditions for Web Series when needed
    END IF;
END;
$$;
