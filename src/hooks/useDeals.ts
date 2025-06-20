
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
    // Prevent multiple subscriptions
    if (isSubscribedRef.current) return;

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Create new channel with unique name
    const channelName = `deals-changes-${Date.now()}-${Math.random()}`;
    channelRef.current = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deals'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['deals'] });
        }
      );

    // Subscribe only once
    channelRef.current.subscribe((status: string) => {
      if (status === 'SUBSCRIBED') {
        isSubscribedRef.current = true;
      }
    });

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
      isSubscribedRef.current = false;
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
