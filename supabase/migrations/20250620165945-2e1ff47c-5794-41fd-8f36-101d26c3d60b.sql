
-- Add a max_claims column to deals table to track how many users can claim each deal
ALTER TABLE public.deals ADD COLUMN max_claims INTEGER DEFAULT 5;

-- Add RLS policies for deal_claims table (only if not already enabled)
ALTER TABLE public.deal_claims ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view claims for deals they own or claims they made
CREATE POLICY "Users can view relevant deal claims" ON public.deal_claims
FOR SELECT USING (
  auth.uid() = user_id OR 
  auth.uid() IN (SELECT user_id FROM public.deals WHERE id = deal_claims.deal_id)
);

-- Policy to allow authenticated users to claim deals
CREATE POLICY "Users can claim deals" ON public.deal_claims
FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to delete their own claims
CREATE POLICY "Users can delete their own claims" ON public.deal_claims
FOR DELETE USING (auth.uid() = user_id);

-- Create a function to get available slots for a deal
CREATE OR REPLACE FUNCTION get_available_slots(deal_id_param UUID)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
  SELECT COALESCE(
    (SELECT max_claims FROM public.deals WHERE id = deal_id_param), 
    5
  ) - COALESCE(
    (SELECT COUNT(*) FROM public.deals WHERE id = deal_id_param), 
    0
  );
$$;
