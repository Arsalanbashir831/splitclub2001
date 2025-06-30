-- Add contact and location fields to profiles
ALTER TABLE profiles ADD COLUMN contact text;
ALTER TABLE profiles ADD COLUMN location text; 