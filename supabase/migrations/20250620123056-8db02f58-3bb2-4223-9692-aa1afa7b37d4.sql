
-- Add image support and GDPR compliance to deals table
ALTER TABLE public.deals 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS image_file_name TEXT;

-- Create user consent tracking table for GDPR compliance
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL DEFAULT false,
  consent_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT,
  UNIQUE(user_id, consent_type)
);

-- Enable RLS on user_consents
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_consents
DROP POLICY IF EXISTS "Users can view their own consents" ON public.user_consents;
CREATE POLICY "Users can view their own consents" 
  ON public.user_consents 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own consents" ON public.user_consents;
CREATE POLICY "Users can create their own consents" 
  ON public.user_consents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own consents" ON public.user_consents;
CREATE POLICY "Users can update their own consents" 
  ON public.user_consents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create storage bucket for deal images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'deal-images',
  'deal-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for deal images
DROP POLICY IF EXISTS "Anyone can view deal images" ON storage.objects;
CREATE POLICY "Anyone can view deal images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'deal-images');

DROP POLICY IF EXISTS "Authenticated users can upload deal images" ON storage.objects;
CREATE POLICY "Authenticated users can upload deal images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deal-images' 
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "Users can update their own deal images" ON storage.objects;
CREATE POLICY "Users can update their own deal images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'deal-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "Users can delete their own deal images" ON storage.objects;
CREATE POLICY "Users can delete their own deal images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'deal-images' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Add RLS policies for deals table
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active deals" ON public.deals;
CREATE POLICY "Anyone can view active deals" 
  ON public.deals 
  FOR SELECT 
  USING (status = 'active');

DROP POLICY IF EXISTS "Users can create their own deals" ON public.deals;
CREATE POLICY "Users can create their own deals" 
  ON public.deals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own deals" ON public.deals;
CREATE POLICY "Users can update their own deals" 
  ON public.deals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own deals" ON public.deals;
CREATE POLICY "Users can delete their own deals" 
  ON public.deals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add RLS policies for deal_claims table
ALTER TABLE public.deal_claims ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view claims for their deals" ON public.deal_claims;
CREATE POLICY "Users can view claims for their deals" 
  ON public.deal_claims 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.deals 
      WHERE deals.id = deal_claims.deal_id 
      AND deals.user_id = auth.uid()
    )
    OR deal_claims.user_id = auth.uid()
  );

DROP POLICY IF EXISTS "Users can create deal claims" ON public.deal_claims;
CREATE POLICY "Users can create deal claims" 
  ON public.deal_claims 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_deals_updated_at ON public.deals;
CREATE TRIGGER update_deals_updated_at 
  BEFORE UPDATE ON public.deals 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
