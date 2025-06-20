
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';

export const dealsService = {
  async getDeals() {
    const { data: deals, error } = await supabase
      .from('deals')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }

    if (!deals) return [];

    // Get unique user IDs from deals
    const userIds = [...new Set(deals.map(deal => deal.user_id))];
    
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
        description: deal.category,
        category: deal.category as Deal['category'],
        originalPrice: Number(deal.original_price || 0),
        sharePrice: Number(deal.price || 0),
        isFree: !deal.is_for_sale,
        availableSlots: 5, // We'll need to calculate this based on claims
        totalSlots: 5, // Default for now
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
      };
    });
  },

  async getDealById(id: string) {
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

    return {
      id: deal.id,
      title: deal.title,
      description: deal.category,
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
    };
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
        image_file_name: dealData.imageFileName
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
