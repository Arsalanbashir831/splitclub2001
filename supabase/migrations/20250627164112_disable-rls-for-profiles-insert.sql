-- Temporarily disable RLS for profiles table INSERT to allow signup to work
-- This is a temporary fix until we can properly configure the trigger function

-- Drop all existing policies on profiles table
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Trigger function can insert profiles" ON public.profiles;

-- Disable RLS temporarily for INSERT operations
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS but with more permissive policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can insert profiles" 
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