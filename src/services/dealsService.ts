
import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';

export const dealsService = {
  async getDeals() {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        profiles!deals_user_id_fkey (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching deals:', error);
      throw error;
    }

    return data?.map(deal => ({
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
        name: deal.profiles?.display_name || 'Unknown User',
        email: '',
        avatar: deal.profiles?.avatar_url
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
    })) || [];
  },

  async getDealById(id: string) {
    const { data, error } = await supabase
      .from('deals')
      .select(`
        *,
        profiles!deals_user_id_fkey (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching deal:', error);
      throw error;
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      description: data.category,
      category: data.category as Deal['category'],
      originalPrice: Number(data.original_price || 0),
      sharePrice: Number(data.price || 0),
      isFree: !data.is_for_sale,
      availableSlots: 5,
      totalSlots: 5,
      expiryDate: data.expiry_date,
      tags: data.tags || [],
      sharedBy: {
        id: data.user_id,
        name: data.profiles?.display_name || 'Unknown User',
        email: '',
        avatar: data.profiles?.avatar_url
      },
      status: data.status as Deal['status'],
      createdAt: data.created_at,
      image: data.image_url,
      imageUrl: data.image_url,
      imageFileName: data.image_file_name,
      source: data.source,
      redemptionType: data.redemption_type as Deal['redemptionType'],
      voucherData: data.voucher_data,
      isLocationBound: data.is_location_bound,
      locationDetails: data.location_details,
      isForSale: data.is_for_sale,
      usageNotes: data.usage_notes
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
