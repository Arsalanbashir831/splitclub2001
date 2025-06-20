
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
      // Get the most recent demo video from storage
      const { data: files, error } = await supabase.storage
        .from('demo-videos')
        .list('demos', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error) {
        console.error('Error fetching demo videos:', error);
        return null;
      }

      if (!files || files.length === 0) {
        console.log('No demo videos found');
        return null;
      }

      const latestFile = files[0];
      const filePath = `demos/${latestFile.name}`;
      
      // Get the public URL for the video
      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(filePath);

      console.log('Found demo video:', publicUrl);

      return {
        id: latestFile.id || 'demo-video',
        title: 'Demo Video',
        url: publicUrl,
        is_active: true,
        created_at: latestFile.created_at || new Date().toISOString(),
        updated_at: latestFile.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getActiveDemoVideo:', error);
      return null;
    }
  },

  async uploadDemoVideo(file: File, title: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `demo-${Date.now()}.${fileExt}`;
      const filePath = `demos/${fileName}`;

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
