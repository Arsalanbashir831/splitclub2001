
import { supabase } from '@/integrations/supabase/client';

export interface DemoVideo {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const videoService = {
  async getActiveDemoVideo(): Promise<DemoVideo | null> {
    try {
      // For now, we'll use a simple approach to store the active demo video URL
      // We can expand this later when we have a proper demo_videos table
      const { data, error } = await supabase
        .from('deals')
        .select('*')
        .limit(1);

      if (error) {
        console.error('Error checking demo video capability:', error);
        return null;
      }

      // Return a placeholder for now - we'll implement proper video storage later
      return null;
    } catch (error) {
      console.error('Error in getActiveDemoVideo:', error);
      return null;
    }
  },

  async uploadDemoVideo(file: File, title: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `demo-video-${Date.now()}.${fileExt}`;
      const filePath = `demo-videos/${fileName}`;

      console.log('Uploading video to path:', filePath);

      const { error: uploadError } = await supabase.storage
        .from('demo-videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(filePath);

      console.log('Video uploaded successfully to:', publicUrl);
      
      // Store video metadata in a simple way for now
      // Later we can create a proper demo_videos table
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadDemoVideo:', error);
      return null;
    }
  },

  async deleteDemoVideo(filePath: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('demo-videos')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting video:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteDemoVideo:', error);
      return false;
    }
  }
};
