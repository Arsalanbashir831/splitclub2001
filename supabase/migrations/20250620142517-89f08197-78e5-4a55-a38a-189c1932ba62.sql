
-- Create contact_messages table for storing contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
  admin_notes TEXT
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all contact messages
CREATE POLICY "Admins can view all contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Create policy for admins to update contact messages (for status/notes)
CREATE POLICY "Admins can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND is_admin = true
    )
  );

-- Allow anyone to insert contact messages (public contact form)
CREATE POLICY "Anyone can insert contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);
