import { supabase } from '@/integrations/supabase/client';

export interface DemoVideo {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class VideoServiceError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'VideoServiceError';
  }
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
        throw new VideoServiceError(
          'Failed to fetch demo videos from storage',
          error.code || 'STORAGE_ERROR'
        );
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
      if (error instanceof VideoServiceError) {
        throw error;
      }
      throw new VideoServiceError(
        'An unexpected error occurred while fetching the demo video',
        'UNKNOWN_ERROR'
      );
    }
  },

  async uploadDemoVideo(file: File, title: string): Promise<string | null> {
    try {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        throw new VideoServiceError('Invalid file type. Please upload a video file.', 'INVALID_FILE_TYPE');
      }

      // Validate file size (max 100MB)
      if (file.size > 100 * 1024 * 1024) {
        throw new VideoServiceError('File too large. Please upload a video smaller than 100MB.', 'FILE_TOO_LARGE');
      }

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
        throw new VideoServiceError(
          `Failed to upload video: ${uploadError.message}`,
          uploadError.code || 'UPLOAD_ERROR'
        );
      }

      const { data: { publicUrl } } = supabase.storage
        .from('demo-videos')
        .getPublicUrl(filePath);

      console.log('Video uploaded successfully to:', publicUrl);
      
      return publicUrl;
    } catch (error) {
      console.error('Error in uploadDemoVideo:', error);
      if (error instanceof VideoServiceError) {
        throw error;
      }
      throw new VideoServiceError(
        'An unexpected error occurred while uploading the video',
        'UNKNOWN_ERROR'
      );
    }
  },

  async deleteDemoVideo(filePath: string): Promise<boolean> {
    try {
      if (!filePath) {
        throw new VideoServiceError('File path is required for deletion', 'INVALID_PATH');
      }

      const { error } = await supabase.storage
        .from('demo-videos')
        .remove([filePath]);

      if (error) {
        console.error('Error deleting video:', error);
        throw new VideoServiceError(
          `Failed to delete video: ${error.message}`,
          error.code || 'DELETE_ERROR'
        );
      }

      return true;
    } catch (error) {
      console.error('Error in deleteDemoVideo:', error);
      if (error instanceof VideoServiceError) {
        throw error;
      }
      throw new VideoServiceError(
        'An unexpected error occurred while deleting the video',
        'UNKNOWN_ERROR'
      );
    }
  }
};
