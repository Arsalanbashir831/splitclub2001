
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export const useUserClaims = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const subscriptionActiveRef = useRef(false);

  const { data: userClaims = [], isLoading, error } = useQuery({
    queryKey: ['user-claims', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('deal_claims')
        .select('deal_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return data.map(claim => claim.deal_id);
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id || subscriptionActiveRef.current) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      subscriptionActiveRef.current = false;
    }

    // Create new channel with unique name
    const channelName = `user-claims-${user.id}-${Date.now()}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deal_claims',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['user-claims', user.id] });
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          subscriptionActiveRef.current = true;
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        subscriptionActiveRef.current = false;
      }
    };
  }, [user?.id, queryClient]);

  const hasClaimedDeal = (dealId: string) => {
    return userClaims.includes(dealId);
  };

  return { 
    userClaims, 
    hasClaimedDeal,
    isLoading, 
    error 
  };
};
