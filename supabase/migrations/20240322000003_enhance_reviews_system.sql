-- Add visibility tracking columns to reviews table
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT FALSE;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS visibility_date TIMESTAMP WITH TIME ZONE;

-- Create function to check review visibility
CREATE OR REPLACE FUNCTION check_review_visibility()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if both parties have reviewed each other for the same trip
  IF EXISTS (
    SELECT 1 FROM reviews 
    WHERE trip_id = NEW.trip_id 
    AND reviewer_id = NEW.reviewee_id 
    AND reviewee_id = NEW.reviewer_id
  ) THEN
    -- Both parties have reviewed, make both reviews visible
    UPDATE reviews 
    SET is_visible = TRUE, visibility_date = NOW()
    WHERE trip_id = NEW.trip_id 
    AND ((reviewer_id = NEW.reviewer_id AND reviewee_id = NEW.reviewee_id)
         OR (reviewer_id = NEW.reviewee_id AND reviewee_id = NEW.reviewer_id));
  ELSE
    -- Set visibility date for 14-day timer
    NEW.visibility_date = NEW.created_at + INTERVAL '14 days';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for review visibility
DROP TRIGGER IF EXISTS review_visibility_trigger ON reviews;
CREATE TRIGGER review_visibility_trigger
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_review_visibility();

-- Create function to make reviews visible after 14 days
CREATE OR REPLACE FUNCTION make_reviews_visible_after_14_days()
RETURNS void AS $$
BEGIN
  UPDATE reviews 
  SET is_visible = TRUE
  WHERE is_visible = FALSE 
  AND visibility_date IS NOT NULL 
  AND visibility_date <= NOW();
END;
$$ LANGUAGE plpgsql;

-- Create view for visible reviews only
CREATE OR REPLACE VIEW visible_reviews AS
SELECT * FROM reviews 
WHERE is_visible = TRUE;
