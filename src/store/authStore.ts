import { create } from 'zustand';
import { AuthState, User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AuthStore extends AuthState {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string, phone?: string, location?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => { unsubscribe: () => void };
  setSession: (session: Session | null) => void;
  refreshUserProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  session: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    try {
      // Clean up existing state
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      // Attempt global sign out first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Check if email is confirmed
      if (data.user && !data.user.email_confirmed_at) {
        return { error: 'Please verify your email before logging in.' };
      }

      if (data.session) {
        get().setSession(data.session);
        
        // Check for redirect after login
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          sessionStorage.removeItem('redirectAfterLogin');
          window.location.href = redirectPath;
        } else {
          window.location.href = '/deals';
        }
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred' };
    }
  },

  signUp: async (email: string, password: string, displayName?: string, phone?: string, location?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
            phone,
            location
          }
        }
      });
      
      if (error) {
        return { error: error.message };
      }
      
      // The profile will be created by the database trigger with the metadata
      // If the trigger doesn't work, we'll create it when the user first logs in
      
      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred' };
    }
  },

  signOut: async () => {
    try {
      // Clean up auth state
      localStorage.removeItem('supabase.auth.token');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      // Attempt global sign out
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Ignore errors
      }

      set({ user: null, isAuthenticated: false, session: null });
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  },

  setSession: (session: Session | null) => {
    
    if (session?.user) {
      // Fetch user profile data with proper error handling
      setTimeout(async () => {
        try {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (profileError) {
            if (profileError.code === 'PGRST116') {
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  user_id: session.user.id,
                  display_name: session.user.user_metadata?.display_name || session.user.email,
                  phone: session.user.user_metadata?.phone || null,
                  location: session.user.user_metadata?.location || null,
                  is_admin: false
                })
                .select()
                .single();

              if (createError) {
                set({ 
                  user: null, 
                  isAuthenticated: false, 
                  session: null, 
                  loading: false 
                });
                return;
              }
              
              const user: User = {
                id: session.user.id,
                email: session.user.email!,
                name: newProfile.display_name || session.user.email!,
                avatar: newProfile.avatar_url,
                isAdmin: newProfile.is_admin || false,
                phone: newProfile.phone,
                location: newProfile.location,
              };

              set({ 
                user, 
                isAuthenticated: true, 
                session, 
                loading: false 
              });
            } else {
              set({ 
                user: null, 
                isAuthenticated: false, 
                session: null, 
                loading: false 
              });
            }
            return;
          }

          // Profile exists, check if we need to update it with metadata
          const needsUpdate = (
            !profile.phone && session.user.user_metadata?.phone ||
            !profile.location && session.user.user_metadata?.location ||
            !profile.display_name && session.user.user_metadata?.display_name
          );

          if (needsUpdate) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({
                display_name: profile.display_name || session.user.user_metadata?.display_name || session.user.email,
                phone: profile.phone || session.user.user_metadata?.phone || null,
                location: profile.location || session.user.user_metadata?.location || null,
              })
              .eq('user_id', session.user.id);

            if (updateError) {
              console.error('Error updating profile:', updateError);
            } else {
              // Fetch the updated profile
              const { data: updatedProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (updatedProfile) {
                profile.display_name = updatedProfile.display_name;
                profile.phone = updatedProfile.phone;
                profile.location = updatedProfile.location;
              }
            }
          }

          // Verify admin status using the secure database function
          const { data: isAdminResult, error: adminError } = await supabase
            .rpc('is_admin', { user_uuid: session.user.id });

          if (adminError) {
            console.error('Error checking admin status:', adminError);
          }

          const user: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profile.display_name || session.user.email!,
            avatar: profile.avatar_url,
            isAdmin: isAdminResult || false,
            phone: profile.phone,
            location: profile.location,
          };

          set({ 
            user, 
            isAuthenticated: true, 
            session, 
            loading: false 
          });
        } catch (error) {
          set({ 
            user: null, 
            isAuthenticated: false, 
            session: null, 
            loading: false 
          });
        }
      }, 0);
    } else {
      set({ 
        user: null, 
        isAuthenticated: false, 
        session: null, 
        loading: false 
      });
    }
  },

  refreshUserProfile: async () => {
    const { session } = get();
    if (!session?.user) return;
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (profileError) {
        return;
      }

      // Verify admin status using the secure database function
      const { data: isAdminResult, error: adminError } = await supabase
        .rpc('is_admin', { user_uuid: session.user.id });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }

      const user: User = {
        id: session.user.id,
        email: session.user.email!,
        name: profile.display_name || session.user.email!,
        avatar: profile.avatar_url,
        isAdmin: isAdminResult || false,
        phone: profile.phone,
        location: profile.location,
      };

      set({ user, isAuthenticated: true, session, loading: false });
    } catch (error) {
      console.error('Error refreshing user profile:', error);
    }
  },

  initialize: () => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        get().setSession(session);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      get().setSession(session);
    });

    return subscription;
  }
}));

// Initialize the auth store when the module is loaded
let authSubscription: any = null;

// Initialize auth on store creation
if (typeof window !== 'undefined') {
  const store = useAuthStore.getState();
  authSubscription = store.initialize();
}

// Clean up subscription on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (authSubscription) {
      authSubscription.unsubscribe();
    }
  });
}
