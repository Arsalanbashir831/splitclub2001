
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
      const { data, error } = await supabase
        .from('demo_videos')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching demo video:', error);
        return null;
      }

      return data;
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
        .from('videos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading video:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      // Deactivate all existing demo videos
      await supabase
        .from('demo_videos')
        .update({ is_active: false })
        .eq('is_active', true);

      // Insert new demo video record
      const { error: insertError } = await supabase
        .from('demo_videos')
        .insert({
          title,
          url: publicUrl,
          is_active: true
        });

      if (insertError) {
        console.error('Error inserting demo video record:', insertError);
        return null;
      }

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadDemoVideo:', error);
      return null;
    }
  }
};
