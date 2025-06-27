-- Add foreign key constraints to deal_favorites table with CASCADE delete
ALTER TABLE public.deal_favorites 
ADD CONSTRAINT deal_favorites_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.deal_favorites 
ADD CONSTRAINT deal_favorites_deal_id_fkey 
FOREIGN KEY (deal_id) REFERENCES public.deals(id) ON DELETE CASCADE; 