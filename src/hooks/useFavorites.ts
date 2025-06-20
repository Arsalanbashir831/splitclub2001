
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';

export const useFavorites = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('deal_favorites')
        .select('deal_id')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data.map(f => f.deal_id);
    },
    enabled: !!user?.id,
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (dealId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('deal_favorites')
        .insert({ user_id: user.id, deal_id: dealId });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (dealId: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('deal_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('deal_id', dealId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
    },
  });

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('favorites-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'deal_favorites',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['favorites', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  return {
    favorites,
    isLoading,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    isFavorite: (dealId: string) => favorites.includes(dealId),
  };
};
