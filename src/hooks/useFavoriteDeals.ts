import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuthStore } from '@/store/authStore';
import { Deal } from '@/types';

export const useFavoriteDeals = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['favorite-deals', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First get the favorite deal IDs
      const { data: favorites, error: favoritesError } = await supabase
        .from('deal_favorites')
        .select('deal_id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (favoritesError) throw favoritesError;
      if (!favorites || favorites.length === 0) return [];

      const dealIds = favorites.map(f => f.deal_id);
      
      // Then get the deals data
      const { data: deals, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .in('id', dealIds);
      
      if (dealsError) throw dealsError;
      if (!deals) return [];

      // Get unique user IDs from deals
      const userIds = [...new Set(deals.map(deal => deal.user_id).filter(Boolean))];
      
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

      return deals.map(deal => {
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
    enabled: !!user?.id,
  });
};
