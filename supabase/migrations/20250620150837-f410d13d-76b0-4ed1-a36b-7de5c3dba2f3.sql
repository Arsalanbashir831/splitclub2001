
-- Add favorites table for users to mark deals as favorites
CREATE TABLE public.deal_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  deal_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, deal_id)
);

-- Add RLS policies for favorites
ALTER TABLE public.deal_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" 
  ON public.deal_favorites 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites" 
  ON public.deal_favorites 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.deal_favorites 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add read_by field to contact_messages to track who read the message
ALTER TABLE public.contact_messages 
ADD COLUMN read_by UUID REFERENCES auth.users(id),
ADD COLUMN read_at TIMESTAMP WITH TIME ZONE;

-- Enable realtime for favorites table
ALTER TABLE public.deal_favorites REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.deal_favorites;
