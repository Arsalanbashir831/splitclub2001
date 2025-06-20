
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';

export const useRealtimeDeals = (limit?: number) => {
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: limit ? ['deals', 'latest', limit] : ['deals'],
    queryFn: async () => {
      let query = supabase
        .from('deals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (limit) {
        query = query.limit(limit);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data as Deal[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('deals-realtime')
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
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { deals, isLoading, error };
};
