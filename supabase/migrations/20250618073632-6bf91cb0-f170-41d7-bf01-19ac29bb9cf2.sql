-- Fix RLS policy for profiles table to ensure users can only insert their own profile
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create deals table for the deal sharing functionality
CREATE TABLE public.deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cinema', 'gym', 'restaurant', 'vouchers', 'discounts', 'subscriptions')),
  source TEXT,
  redemption_type TEXT CHECK (redemption_type IN ('voucher_code', 'barcode', 'pdf', 'qr')),
  voucher_data TEXT, -- encrypted voucher data
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_location_bound BOOLEAN DEFAULT false,
  location_details TEXT,
  is_for_sale BOOLEAN DEFAULT false,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  usage_notes TEXT,
  tags TEXT[],
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'claimed', 'expired', 'removed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on deals table
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deals
CREATE POLICY "Users can view all active deals" 
ON public.deals 
FOR SELECT 
USING (status = 'active');

CREATE POLICY "Users can create their own deals" 
ON public.deals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own deals" 
ON public.deals 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own deals" 
ON public.deals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create claims table to track who claimed which deals
CREATE TABLE public.deal_claims (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(deal_id, user_id)
);

-- Enable RLS on deal_claims table
ALTER TABLE public.deal_claims ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for deal_claims
CREATE POLICY "Users can view their own claims" 
ON public.deal_claims 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own claims" 
ON public.deal_claims 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Deal owners can view claims on their deals" 
ON public.deal_claims 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.deals 
    WHERE deals.id = deal_claims.deal_id 
    AND deals.user_id = auth.uid()
  )
);