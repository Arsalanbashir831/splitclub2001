-- Fix RLS policy for profiles table to allow trigger function to insert profiles during signup
-- The trigger function runs with SECURITY DEFINER, so it should be able to bypass RLS

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create new INSERT policy that allows both users and the trigger function
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id OR 
  (auth.role() = 'service_role' AND user_id IS NOT NULL)
);

-- Also add a policy to allow the trigger function to insert profiles
CREATE POLICY "Trigger function can insert profiles" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

-- Ensure the trigger function has the right permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT ALL ON public.profiles TO postgres; 