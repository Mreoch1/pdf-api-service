-- Function to increment free tier usage
CREATE OR REPLACE FUNCTION increment_free_tier(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE user_metadata
  SET free_tier_used = free_tier_used + 1
  WHERE user_metadata.user_id = increment_free_tier.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

