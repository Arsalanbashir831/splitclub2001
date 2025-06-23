import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';

export const dealsService = {
  async getDeals() {
    try {
      console.log('Fetching deals...');
      const { data: deals, error } = await supabase
        .from('deals')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching deals:', error);
        throw error;
      }

      if (!deals || deals.length === 0) {
        console.log('No deals found');
        return [];
      }

      console.log('Found', deals.length, 'deals');

      // Get unique user IDs from deals
      const userIds = [...new Set(deals.map(deal => deal.user_id).filter(Boolean))];
      
      // Fetch profiles for these users
      let profiles: any[] = [];
      if (userIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url')
          .in('user_id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        } else {
          profiles = profilesData || [];
        }
      }

      // Get claims count for each deal
      const dealIds = deals.map(deal => deal.id);
      let claims: any[] = [];
      if (dealIds.length > 0) {
        const { data: claimsData, error: claimsError } = await supabase
          .from('deal_claims')
          .select('deal_id')
          .in('deal_id', dealIds);

        if (claimsError) {
          console.error('Error fetching claims:', claimsError);
        } else {
          claims = claimsData || [];
        }
      }

      // Create a map of deal_id to claims count
      const claimsMap = new Map();
      claims.forEach(claim => {
        const count = claimsMap.get(claim.deal_id) || 0;
        claimsMap.set(claim.deal_id, count + 1);
      });

      // Create a map of user_id to profile for quick lookup
      const profileMap = new Map();
      profiles.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      const transformedDeals = deals.map(deal => {
        const profile = profileMap.get(deal.user_id);
        const claimsCount = claimsMap.get(deal.id) || 0;
        const maxClaims = deal.max_claims || 5;
        
        return {
          id: deal.id,
          title: deal.title || 'Untitled Deal',
          description: deal.usage_notes || deal.category || 'No description',
          category: deal.category as Deal['category'],
          originalPrice: Number(deal.original_price || 0),
          sharePrice: Number(deal.price || 0),
          isFree: !deal.is_for_sale,
          availableSlots: Math.max(0, maxClaims - claimsCount),
          totalSlots: maxClaims,
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
          voucherFileUrl: deal.voucher_file_url,
          isLocationBound: deal.is_location_bound,
          locationDetails: deal.location_details,
          isForSale: deal.is_for_sale,
          usageNotes: deal.usage_notes
        };
      });

      console.log('Transformed deals:', transformedDeals);
      return transformedDeals;
    } catch (error) {
      console.error('Error in getDeals:', error);
      return [];
    }
  },

  async getDealById(id: string) {
    try {
      const { data: deal, error } = await supabase
        .from('deals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching deal:', error);
        throw error;
      }

      if (!deal) return null;

      // Fetch the profile for this deal's user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .eq('user_id', deal.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Get claims count for this deal
      const { data: claims, error: claimsError } = await supabase
        .from('deal_claims')
        .select('deal_id')
        .eq('deal_id', deal.id);

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
      }

      const claimsCount = claims?.length || 0;
      const maxClaims = deal.max_claims || 5;

      return {
        id: deal.id,
        title: deal.title || 'Untitled Deal',
        description: deal.usage_notes || deal.category || 'No description',
        category: deal.category as Deal['category'],
        originalPrice: Number(deal.original_price || 0),
        sharePrice: Number(deal.price || 0),
        isFree: !deal.is_for_sale,
        availableSlots: Math.max(0, maxClaims - claimsCount),
        totalSlots: maxClaims,
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
        voucherFileUrl: deal.voucher_file_url,
        isLocationBound: deal.is_location_bound,
        locationDetails: deal.location_details,
        isForSale: deal.is_for_sale,
        usageNotes: deal.usage_notes
      };
    } catch (error) {
      console.error('Error in getDealById:', error);
      return null;
    }
  },

  async claimDeal(dealId: string, userId: string) {
    const { data, error } = await supabase
      .from('deal_claims')
      .insert({
        deal_id: dealId,
        user_id: userId
      })
      .select()
      .single();

    if (error) {
      console.error('Error claiming deal:', error);
      throw error;
    }

    return data;
  },

  async createDeal(dealData: any, userId: string) {
    const { data, error } = await supabase
      .from('deals')
      .insert({
        user_id: userId,
        title: dealData.title,
        category: dealData.category,
        source: dealData.source,
        redemption_type: dealData.redemptionType,
        expiry_date: dealData.expiryDate?.toISOString(),
        is_location_bound: dealData.isLocationBound,
        location_details: dealData.locationDetails,
        is_for_sale: dealData.isForSale,
        price: dealData.isForSale ? Number(dealData.price) : 0,
        original_price: Number(dealData.originalPrice),
        usage_notes: dealData.usageNotes,
        tags: dealData.tags,
        image_url: dealData.imageUrl,
        image_file_name: dealData.imageFileName,
        voucher_file_url: dealData.voucherFileUrl
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating deal:', error);
      throw error;
    }

    return data;
  },

  async getUserDeals(userId: string) {
    const { data, error } = await supabase
      .from('deals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user deals:', error);
      throw error;
    }

    return data || [];
  },

  async getUserClaims(userId: string) {
    const { data, error } = await supabase
      .from('deal_claims')
      .select(`
        *,
        deals (*)
      `)
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false });

    if (error) {
      console.error('Error fetching user claims:', error);
      throw error;
    }

    return data || [];
  }
};
