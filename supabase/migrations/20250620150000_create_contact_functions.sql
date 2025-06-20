
-- Create function to insert contact messages
CREATE OR REPLACE FUNCTION public.insert_contact_message(
  contact_name TEXT,
  contact_email TEXT,
  contact_message TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.contact_messages (name, email, message)
  VALUES (contact_name, contact_email, contact_message)
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;
