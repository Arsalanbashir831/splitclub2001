-- Enable RLS on deals table if not already enabled
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- Enable RLS on profiles table if not already enabled  
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for deals table (checking if they exist first)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Deals are viewable by everyone') THEN
        CREATE POLICY "Deals are viewable by everyone" ON public.deals FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Users can create their own deals') THEN
        CREATE POLICY "Users can create their own deals" ON public.deals FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Users can update their own deals') THEN
        CREATE POLICY "Users can update their own deals" ON public.deals FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'deals' AND policyname = 'Users can delete their own deals') THEN
        CREATE POLICY "Users can delete their own deals" ON public.deals FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create policies for profiles table
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Profiles are viewable by everyone') THEN
        CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
        CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert their own profile') THEN
        CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;