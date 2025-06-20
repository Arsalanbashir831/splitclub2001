
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
          availableSlots: 5,
          totalSlots: 5,
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
          redemptionType: deal.redemption_type as Deal['redemptionType'],
          voucherData: deal.voucher_data,
          isLocationBound: deal.is_location_bound,
          locationDetails: deal.location_details,
          isForSale: deal.is_for_sale,
          usageNotes: deal.usage_notes
        } as Deal;
      });
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
