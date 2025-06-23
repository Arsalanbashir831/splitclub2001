
import { supabase } from '@/integrations/supabase/client';

export const storageService = {
  async uploadDealImage(file: File, userId: string): Promise<{ url: string; fileName: string } | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/deal-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('deal-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading deal image:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('deal-images')
        .getPublicUrl(fileName);

      return {
        url: publicUrl,
        fileName: data.path
      };
    } catch (error) {
      console.error('Error in uploadDealImage:', error);
      return null;
    }
  },

  async uploadVoucherFile(file: File, userId: string): Promise<{ url: string; fileName: string } | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/voucher-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('voucher-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading voucher file:', error);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('voucher-files')
        .getPublicUrl(fileName);

      return {
        url: publicUrl,
        fileName: data.path
      };
    } catch (error) {
      console.error('Error in uploadVoucherFile:', error);
      return null;
    }
  },

  async deleteDealImage(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('deal-images')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting deal image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteDealImage:', error);
      return false;
    }
  },

  async deleteVoucherFile(fileName: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('voucher-files')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting voucher file:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteVoucherFile:', error);
      return false;
    }
  },

  async deleteDealFiles(deal: { imageFileName?: string; voucherFileUrl?: string }): Promise<void> {
    const deletePromises: Promise<boolean>[] = [];

    // Delete deal image if exists
    if (deal.imageFileName) {
      deletePromises.push(this.deleteDealImage(deal.imageFileName));
    }

    // Delete voucher file if exists
    if (deal.voucherFileUrl) {
      // Extract filename from URL for voucher files
      const urlParts = deal.voucherFileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      if (fileName) {
        deletePromises.push(this.deleteVoucherFile(fileName));
      }
    }

    if (deletePromises.length > 0) {
      try {
        await Promise.all(deletePromises);
        console.log('Successfully deleted deal files from storage');
      } catch (error) {
        console.error('Error deleting some deal files:', error);
      }
    }
  }
};
