-- Add coordinates columns to trips table
ALTER TABLE trips
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;

-- Add an index for spatial queries
CREATE INDEX IF NOT EXISTS idx_trips_coordinates 
ON trips (latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL; 