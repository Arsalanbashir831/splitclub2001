
-- Create storage bucket for deal images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'deal-images',
  'deal-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for voucher files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'voucher-files',
  'voucher-files',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
) ON CONFLICT (id) DO NOTHING;

-- Drop existing policies if they exist, then recreate them
DROP POLICY IF EXISTS "Anyone can view deal images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload deal images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own deal images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own deal images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view voucher files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload voucher files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own voucher files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own voucher files" ON storage.objects;

-- Create storage policies for deal images
CREATE POLICY "Anyone can view deal images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'deal-images');

CREATE POLICY "Authenticated users can upload deal images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deal-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own deal images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'deal-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own deal images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'deal-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create storage policies for voucher files
CREATE POLICY "Anyone can view voucher files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'voucher-files');

CREATE POLICY "Authenticated users can upload voucher files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'voucher-files' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own voucher files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'voucher-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own voucher files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'voucher-files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add voucher_file_url column to deals table to store voucher file URLs
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS voucher_file_url TEXT;
