import { create } from 'zustand';
import { AuthState, User } from '../types';
import { supabase } from '@/integrations/supabase/client';
import type { Session } from '@supabase/supabase-js';

interface AuthStore extends AuthState {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, displayName?: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  initialize: () => { unsubscribe: () => void };
  setSession: (session: Session | null) => void;
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

      if (data.session) {
        get().setSession(data.session);
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message || 'An unexpected error occurred' };
    }
  },

  signUp: async (email: string, password: string, displayName?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: displayName ? { display_name: displayName } : {}
        }
      });

      if (error) {
        return { error: error.message };
      }

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
            console.error('Error fetching profile:', profileError);
            // If profile doesn't exist, create one
            if (profileError.code === 'PGRST116') {
              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  user_id: session.user.id,
                  display_name: session.user.email,
                  is_admin: false
                })
                .select()
                .single();

              if (createError) {
                console.error('Error creating profile:', createError);
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
          };

          set({ 
            user, 
            isAuthenticated: true, 
            session, 
            loading: false 
          });
        } catch (error) {
          console.error('Unexpected error during profile fetch:', error);
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