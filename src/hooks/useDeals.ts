
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { dealsService } from '@/services/dealsService';
import { Deal } from '@/types';

export const useDeals = () => {
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: ['deals'],
    queryFn: dealsService.getDeals,
  });

  useEffect(() => {
    const channel = supabase
      .channel('deals-changes')
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

export const useDeal = (id: string) => {
  const { data: deal, isLoading, error } = useQuery({
    queryKey: ['deal', id],
    queryFn: () => dealsService.getDealById(id),
    enabled: !!id,
  });

  return { deal, isLoading, error };
};
