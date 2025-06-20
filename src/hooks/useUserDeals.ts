
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Deal } from '@/types';

export const useUserDeals = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: userDeals = [], isLoading, error } = useQuery({
    queryKey: ['user-deals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Deal[];
    },
    enabled: !!user?.id,
  });

  const { data: claimedDeals = [], isLoading: claimedLoading } = useQuery({
    queryKey: ['claimed-deals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('deal_claims')
        .select(`
          *,
          deals (*)
        `)
        .eq('user_id', user.id)
        .order('claimed_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('user-deals-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user-deals', user.id] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deal_claims',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['claimed-deals', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return { 
    userDeals, 
    claimedDeals, 
    isLoading: isLoading || claimedLoading, 
    error 
  };
};
