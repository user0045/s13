
-- Add season_title column to season table
ALTER TABLE public.season 
ADD COLUMN IF NOT EXISTS season_title TEXT;
