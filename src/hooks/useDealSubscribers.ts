import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  subscribedAt: string;
}

export const useDealSubscribers = (dealId: string) => {
  return useQuery({
    queryKey: ['deal-subscribers', dealId],
    queryFn: async (): Promise<Subscriber[]> => {
      if (!dealId) return [];
      
      // First, get all claims for this deal
      const { data: claims, error: claimsError } = await supabase
        .from('deal_claims')
        .select('claimed_at, user_id')
        .eq('deal_id', dealId)
        .order('claimed_at', { ascending: false });
      
      if (claimsError) throw claimsError;
      if (!claims || claims.length === 0) return [];
      
      // Then, get profile data for all users who claimed
      const userIds = claims.map(claim => claim.user_id);
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, display_name, phone, location')
        .in('user_id', userIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of user_id to profile data
      const profileMap = new Map();
      profiles?.forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });
      
      // Combine claims with profile data
      return claims.map(claim => {
        const profile = profileMap.get(claim.user_id);
        return {
          id: claim.user_id,
          name: profile?.display_name || 'Unknown User',
          email: '', // We don't expose email for privacy
          phone: profile?.phone,
          location: profile?.location,
          subscribedAt: claim.claimed_at,
        };
      });
    },
    enabled: !!dealId,
  });
}; 