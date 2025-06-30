import { useQuery } from '@tanstack/react-query';
import { videoService, DemoVideo } from '@/services/videoService';

export const useDemoVideo = () => {
  return useQuery({
    queryKey: ['demo-video'],
    queryFn: async (): Promise<DemoVideo | null> => {
      try {
        const video = await videoService.getActiveDemoVideo();
        return video;
      } catch (error) {
        console.error('Error fetching demo video:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2, // Retry failed requests up to 2 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}; 