-- Fix RLS policies for profiles table to allow profile creation during signup
-- The issue is that during signup, the user is not fully authenticated yet

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Trigger function can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;

-- Create new policies that allow profile creation during signup
CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Allow profile creation during signup" 
ON public.profiles 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile" 
ON public.profiles 
FOR DELETE 
USING (auth.uid() = user_id); 