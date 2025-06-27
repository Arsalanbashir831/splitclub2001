import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Deal } from '@/types';

export const useUserDeals = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

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
      
      if (!data) return [];

      return data.map(deal => ({
        id: deal.id,
        title: deal.title,
        description: deal.usage_notes || deal.title,
        category: deal.category as Deal['category'],
        originalPrice: Number(deal.original_price || 0),
        sharePrice: Number(deal.price || 0),
        isFree: !deal.is_for_sale,
        availableSlots: Math.max(0, (deal.max_claims || 5)),
        totalSlots: deal.max_claims || 5,
        expiryDate: deal.expiry_date,
        tags: deal.tags || [],
        sharedBy: {
          id: deal.user_id,
          name: user.name,
          email: user.email,
          avatar: user.avatar
        },
        status: deal.status as Deal['status'],
        createdAt: deal.created_at,
        image: deal.image_url,
        imageUrl: deal.image_url,
        imageFileName: deal.image_file_name,
        source: deal.source,
        sharingMethod: deal.sharing_method as Deal['sharingMethod'],
        voucherData: deal.voucher_data,
        voucherFileUrl: deal.voucher_file_url,
        isLocationBound: deal.is_location_bound,
        locationDetails: deal.location_details,
        isForSale: deal.is_for_sale,
        usageNotes: deal.usage_notes
      } as Deal));
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

    // Create new channel with unique name to prevent multiple subscriptions
    const channelName = `user-deals-${user.id}-${Date.now()}-${Math.random()}`;
    const channel = supabase.channel(channelName);
    channelRef.current = channel;

    channel
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
  }, [user?.id, queryClient]);

  return { 
    userDeals, 
    claimedDeals, 
    isLoading: isLoading || claimedLoading, 
    error 
  };
};
