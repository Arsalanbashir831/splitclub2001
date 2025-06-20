
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export const useUserClaims = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

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
    if (!user?.id) return;

    const channel = supabase
      .channel('user-claims-realtime')
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
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
