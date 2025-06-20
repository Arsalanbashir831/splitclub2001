
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
      // Since the demo_videos table doesn't exist in the current types yet,
      // we'll return null for now until the types are regenerated
      console.log('Demo videos table not available in current schema');
      return null;
    } catch (error) {
      console.error('Error in getActiveDemoVideo:', error);
      return null;
    }
  },

  async uploadDemoVideo(file: File, title: string): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `demo-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('demo-videos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(filePath);

      // For now, we'll just return the URL since we can't insert into demo_videos table yet
      console.log('Video uploaded to:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadDemoVideo:', error);
      return null;
    }
  }
};
