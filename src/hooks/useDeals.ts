
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
      console.log('Cleaning up existing channel');
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create new channel with unique name
    const channelName = `deals-${Date.now()}-${Math.random()}`;
    console.log('Creating new channel:', channelName);
    
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
          console.log('Deals change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['deals'] });
        }
      )
      .subscribe((status: string) => {
        console.log('Channel subscription status:', status);
        if (status === 'SUBSCRIBED') {
          isSubscribedRef.current = true;
        }
      });

    return () => {
      console.log('Cleaning up channel on unmount');
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
