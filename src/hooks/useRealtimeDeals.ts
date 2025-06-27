import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';

export const useRealtimeDeals = (limit?: number) => {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);
  const isSubscribedRef = useRef(false);

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
      
      if (!data) return [];

      // Get unique user IDs from deals
      const userIds = [...new Set(data.map(deal => deal.user_id))];
      
      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }

      // Create a map of user_id to profile for quick lookup
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      return data.map(deal => {
        const profile = profileMap.get(deal.user_id);
        
        return {
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
            name: profile?.display_name || 'Unknown User',
            email: '',
            avatar: profile?.avatar_url
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
        } as Deal;
      });
    },
  });

  useEffect(() => {
    // If we already have a subscribed channel, don't create another one
    if (isSubscribedRef.current && channelRef.current) {
      return;
    }

    // Clean up existing channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
      isSubscribedRef.current = false;
    }

    // Create new channel with unique name
    const channelName = `deals-realtime-${Date.now()}-${Math.random()}`;
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
        () => {
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
