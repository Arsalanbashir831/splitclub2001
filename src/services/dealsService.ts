import { supabase } from '@/integrations/supabase/client';
import { Deal } from '@/types';
import { storageService } from './storageService';

export const dealsService = {
  async getDeals() {
    try {
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
        return [];
      }

     
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
          sharingMethod: deal.sharing_method as Deal['sharingMethod'],
          voucherData: deal.voucher_data,
          voucherFileUrl: deal.voucher_file_url,
          isLocationBound: deal.is_location_bound,
          locationDetails: deal.location_details,
          isForSale: deal.is_for_sale,
          usageNotes: deal.usage_notes
        };
      });

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
        sharingMethod: deal.sharing_method as Deal['sharingMethod'],
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
    try {
      let imageUrl = null;
      let imageFileName = null;
      let voucherFileUrl = null;

      // Upload deal image if provided
      if (dealData.dealImage) {
        const uploadResult = await storageService.uploadDealImage(dealData.dealImage, userId);
        if ('error' in uploadResult) {
          console.error('Failed to upload deal image:', uploadResult.error);
          throw new Error(uploadResult.error);
        } else {
          imageUrl = uploadResult.url;
          imageFileName = uploadResult.fileName;
          }
      }

      // Upload voucher file if provided
      if (dealData.voucherFile) {
        const uploadResult = await storageService.uploadVoucherFile(dealData.voucherFile, userId);
        if ('error' in uploadResult) {
          console.error('Failed to upload voucher file:', uploadResult.error);
          throw new Error(uploadResult.error);
        } else {
          voucherFileUrl = uploadResult.url;
        
        }
      }

      // Create the deal in the database
      const { data, error } = await supabase
        .from('deals')
        .insert({
          user_id: userId,
          title: dealData.title,
          category: dealData.category,
          source: dealData.source,
          sharing_method: dealData.sharingMethod,
          voucher_file_url: voucherFileUrl,
          expiry_date: dealData.expiryDate?.toISOString(),
          is_location_bound: dealData.isLocationBound,
          location_details: dealData.locationDetails,
          is_for_sale: dealData.isForSale,
          price: dealData.isForSale ? Number(dealData.price) : 0,
          original_price: Number(dealData.originalPrice),
          usage_notes: dealData.usageNotes,
          tags: dealData.tags,
          max_claims: dealData.maxClaims,
          status: 'active',
          image_url: imageUrl,
          image_file_name: imageFileName
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating deal:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createDeal:', error);
      throw error;
    }
  },

  async deleteDeal(dealId: string, userId: string) {
    try {
      
      // First, get the deal to check ownership and get file URLs
      const { data: deal, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching deal for deletion:', fetchError);
        throw new Error('Deal not found or you do not have permission to delete it');
      }

      if (!deal) {
        throw new Error('Deal not found');
      }

      
      // Delete associated files from storage
      const fileDeletionPromises = [];

      if (deal.image_file_name) {
        fileDeletionPromises.push(
          storageService.deleteDealImage(deal.image_file_name)
            .then(() => console.log('Image file deleted successfully'))
            .catch(error => console.error('Error deleting image file:', error))
        );
      }

      if (deal.voucher_file_url) {
        try {
          // Extract filename from URL for voucher files
          let fileName = '';
          if (deal.voucher_file_url.includes('voucher-files/')) {
            // Extract from Supabase storage URL
            const urlParts = deal.voucher_file_url.split('voucher-files/');
            if (urlParts.length > 1) {
              fileName = urlParts[1].split('?')[0]; // Remove query parameters
            }
          } else {
            // Fallback to simple filename extraction
            const urlPartsFallback = deal.voucher_file_url.split('/');
            fileName = urlPartsFallback[urlPartsFallback.length - 1].split('?')[0]; // Remove query parameters
          }
          
          if (fileName) {
            fileDeletionPromises.push(
              storageService.deleteVoucherFile(fileName)
                .then(() => console.log('Voucher file deleted successfully'))
                .catch(error => console.error('Error deleting voucher file:', error))
            );
          } else {
            console.log('Could not extract filename from voucher URL');
          }
        } catch (error) {
          console.error('Error processing voucher file URL:', error);
        }
      }

      // Wait for all file deletions to complete (but don't fail if they don't)
      if (fileDeletionPromises.length > 0) {
        await Promise.allSettled(fileDeletionPromises);
      }

      // Delete the deal (this will cascade delete all claims due to ON DELETE CASCADE)
      // Note: deal_favorites will also be automatically deleted due to CASCADE constraint
      const { error: deleteError } = await supabase
        .from('deals')
        .delete()
        .eq('id', dealId)
        .eq('user_id', userId);

      if (deleteError) {
        console.error('Error deleting deal:', deleteError);
        throw deleteError;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteDeal:', error);
      throw error;
    }
  },

  async updateDeal(dealId: string, userId: string, updateData: any) {
    try {
      // First, get the current deal to check ownership and get existing file URLs
      const { data: currentDeal, error: fetchError } = await supabase
        .from('deals')
        .select('*')
        .eq('id', dealId)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching deal for update:', fetchError);
        throw new Error('Deal not found or you do not have permission to update it');
      }

      if (!currentDeal) {
        throw new Error('Deal not found');
      }

      // Handle image file updates
      let imageUrl = currentDeal.image_url;
      let imageFileName = currentDeal.image_file_name;
      
      if (updateData.selectedImage) {
        // Delete old image if it exists
        if (currentDeal.image_file_name) {
          try {
            await storageService.deleteDealImage(currentDeal.image_file_name);
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }
        
        // Upload new image
        const uploadResult = await storageService.uploadDealImage(
          updateData.selectedImage,
          userId
        );
        if ('error' in uploadResult) {
          console.error('Failed to upload image:', uploadResult.error);
          throw new Error(uploadResult.error);
        } else {
          imageUrl = uploadResult.url;
          imageFileName = uploadResult.fileName;
        }
      } else if (updateData.imageRemoved && currentDeal.image_file_name) {
        // Delete existing image if marked for removal
        try {
          await storageService.deleteDealImage(currentDeal.image_file_name);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
        imageUrl = null;
        imageFileName = null;
      }

      // Handle voucher file updates
      let voucherFileUrl = currentDeal.voucher_file_url;
      
      if (updateData.selectedVoucherFile) {
        // Delete old voucher file if it exists
        if (currentDeal.voucher_file_url) {
          try {
            // Extract filename from URL for voucher files
            // Handle different URL formats
            let fileName = '';
            if (currentDeal.voucher_file_url.includes('voucher-files/')) {
              // Extract from Supabase storage URL
              const urlParts = currentDeal.voucher_file_url.split('voucher-files/');
              if (urlParts.length > 1) {
                fileName = urlParts[1].split('?')[0]; // Remove query parameters
              }
            } else {
              // Fallback to simple filename extraction
              const urlPartsFallback = currentDeal.voucher_file_url.split('/');
              fileName = urlPartsFallback[urlPartsFallback.length - 1].split('?')[0]; // Remove query parameters
            }
            
            if (fileName) {
              const deleteResult = await storageService.deleteVoucherFile(fileName);
            } else {
              console.log('Voucher replacement - could not extract filename from URL');
            }
          } catch (error) {
            console.error('Error deleting old voucher file:', error);
          }
        }
        
        // Upload new voucher file
        const uploadResult = await storageService.uploadVoucherFile(
          updateData.selectedVoucherFile,
          userId
        );
        if ('error' in uploadResult) {
          console.error('Failed to upload voucher file:', uploadResult.error);
          throw new Error(uploadResult.error);
        } else {
          voucherFileUrl = uploadResult.url;
        }
      } else if (updateData.voucherRemoved && currentDeal.voucher_file_url) {
        // Delete existing voucher file if marked for removal
        try {
          // Extract filename from URL for voucher files
          let fileName = '';
          if (currentDeal.voucher_file_url.includes('voucher-files/')) {
            // Extract from Supabase storage URL
            const urlParts = currentDeal.voucher_file_url.split('voucher-files/');
            if (urlParts.length > 1) {
              fileName = urlParts[1].split('?')[0]; // Remove query parameters
            }
          } else {
            // Fallback to simple filename extraction
            const urlPartsFallback = currentDeal.voucher_file_url.split('/');
            fileName = urlPartsFallback[urlPartsFallback.length - 1].split('?')[0]; // Remove query parameters
          }
          
          if (fileName) {
            await storageService.deleteVoucherFile(fileName);
          }
        } catch (error) {
          console.error('Error deleting voucher file:', error);
        }
        voucherFileUrl = null;
      }

      // Prepare update data
      const updatePayload = {
        title: updateData.title,
        category: updateData.category,
        original_price: updateData.originalPrice,
        price: updateData.sharePrice,
        is_for_sale: !updateData.isFree,
        max_claims: updateData.maxClaims,
        expiry_date: updateData.expiryDate,
        tags: updateData.tags,
        source: updateData.source,
        sharing_method: updateData.sharingMethod,
        voucher_file_url: voucherFileUrl,
        is_location_bound: updateData.isLocationBound,
        location_details: updateData.locationDetails,
        usage_notes: updateData.usageNotes,
        image_url: imageUrl,
        image_file_name: imageFileName,
        updated_at: new Date().toISOString()
      };

      // Update the deal
      const { data: updatedDeal, error: updateError } = await supabase
        .from('deals')
        .update(updatePayload)
        .eq('id', dealId)
        .eq('user_id', userId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating deal:', updateError);
        throw updateError;
      }

      // Transform the updated deal to match the Deal type
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .eq('user_id', updatedDeal.user_id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
      }

      // Get claims count for this deal
      const { data: claims, error: claimsError } = await supabase
        .from('deal_claims')
        .select('deal_id')
        .eq('deal_id', updatedDeal.id);

      if (claimsError) {
        console.error('Error fetching claims:', claimsError);
      }

      const claimsCount = claims?.length || 0;
      const maxClaims = updatedDeal.max_claims || 5;

      return {
        id: updatedDeal.id,
        title: updatedDeal.title || 'Untitled Deal',
        description: updatedDeal.usage_notes || updatedDeal.category || 'No description',
        category: updatedDeal.category as Deal['category'],
        originalPrice: Number(updatedDeal.original_price || 0),
        sharePrice: Number(updatedDeal.price || 0),
        isFree: !updatedDeal.is_for_sale,
        availableSlots: Math.max(0, maxClaims - claimsCount),
        totalSlots: maxClaims,
        expiryDate: updatedDeal.expiry_date,
        tags: updatedDeal.tags || [],
        sharedBy: {
          id: updatedDeal.user_id,
          name: profile?.display_name || 'Unknown User',
          email: '',
          avatar: profile?.avatar_url
        },
        status: updatedDeal.status as Deal['status'],
        createdAt: updatedDeal.created_at,
        image: updatedDeal.image_url,
        imageUrl: updatedDeal.image_url,
        imageFileName: updatedDeal.image_file_name,
        source: updatedDeal.source,
        sharingMethod: updatedDeal.sharing_method as Deal['sharingMethod'],
        voucherData: updatedDeal.voucher_data,
        voucherFileUrl: updatedDeal.voucher_file_url,
        isLocationBound: updatedDeal.is_location_bound,
        locationDetails: updatedDeal.location_details,
        isForSale: updatedDeal.is_for_sale,
        usageNotes: updatedDeal.usage_notes
      };
    } catch (error) {
      console.error('Error in updateDeal:', error);
      throw error;
    }
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
