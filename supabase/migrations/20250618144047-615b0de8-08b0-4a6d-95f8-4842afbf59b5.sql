-- Create storage bucket for demo videos
INSERT INTO storage.buckets (id, name, public) VALUES ('demo-videos', 'demo-videos', true);

-- Create policies for demo video uploads
CREATE POLICY "Demo videos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'demo-videos');

CREATE POLICY "Authenticated users can upload demo videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'demo-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own demo videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'demo-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own demo videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'demo-videos' AND auth.role() = 'authenticated');