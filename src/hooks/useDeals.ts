
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { dealsService } from '@/services/dealsService';

export const useDeals = () => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: ['deals'],
    queryFn: dealsService.getDeals,
  });

  useEffect(() => {
    // If we already have a subscribed channel, don't create another one
    if (isSubscribedRef.current && channelRef.current) {
      return;
    }

    // Clean up existing channel first
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create new channel with unique name
    const channelName = `deals-${Date.now()}-${Math.random()}`;
    
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals'
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['deals'] });
        }
      )
      .subscribe((status: string) => {
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
        isSubscribedRef.current = false;
      }
    };
  }, [queryClient]);

  return { deals, isLoading, error };
};

export const useDeal = (id: string) => {
  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsService.getDealById(id),
    enabled: !!id,
  });

  return { deal, isLoading, error };
};
