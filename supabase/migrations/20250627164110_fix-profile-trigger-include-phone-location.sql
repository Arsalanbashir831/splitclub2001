-- Fix the handle_new_user trigger function to include phone and location fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, avatar_url, phone, location)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email), 
        NEW.raw_user_meta_data ->> 'avatar_url',
        NEW.raw_user_meta_data ->> 'phone',
        NEW.raw_user_meta_data ->> 'location'
    );
    RETURN NEW;
END;
$function$;

-- Also update the create_profile_for_new_user function for consistency
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $function$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, avatar_url, phone, location)
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email), 
        NEW.raw_user_meta_data ->> 'avatar_url',
        NEW.raw_user_meta_data ->> 'phone',
        NEW.raw_user_meta_data ->> 'location'
    );
    RETURN NEW;
END;
$function$; 