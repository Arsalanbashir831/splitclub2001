-- Drop the existing redemption_type column and its constraint
ALTER TABLE public.deals DROP CONSTRAINT IF EXISTS deals_redemption_type_check;
ALTER TABLE public.deals DROP COLUMN IF EXISTS redemption_type;

-- Add new sharing_method column with the specified values
ALTER TABLE public.deals 
ADD COLUMN sharing_method TEXT CHECK (sharing_method IN ('login', 'invite', 'voucher', 'other'));
