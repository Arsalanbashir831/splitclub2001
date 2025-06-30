import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VideoUploadModal } from '@/components/VideoUploadModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Upload, Trash2, Edit, Play, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { videoService } from '@/services/videoService';
import { useDemoVideo } from '@/hooks/useDemoVideo';
import { useQueryClient } from '@tanstack/react-query';

export const VideoManagement = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: demoVideo, isLoading, error: videoError } = useDemoVideo();

  const handleVideoUploaded = async (videoUrl: string) => {
    // Invalidate the demo video query to refresh the data
    queryClient.invalidateQueries({ queryKey: ['demo-video'] });
    
    toast({
      title: "Video uploaded successfully",
      description: "Demo video is now active on the platform.",
    });
    
    setIsUploadModalOpen(false);
  };

  const handleRemoveVideo = async () => {
    if (!demoVideo?.url) return;
    
    try {
      // Extract file path from URL
      const url = new URL(demoVideo.url);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-2).join('/'); // Get 'demos/filename.mp4'
      
      const success = await videoService.deleteDemoVideo(filePath);
      
      if (success) {
        // Invalidate the demo video query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['demo-video'] });
        
        toast({
          title: "Video removed",
          description: "Demo video has been removed from the platform.",
        });
      } else {
        throw new Error('Failed to delete video');
      }
    } catch (error) {
      console.error('Error removing video:', error);
      toast({
        title: "Error",
        description: "Failed to remove video. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Demo Video Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading current video...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (videoError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Demo Video Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-red-600">Failed to load video</h3>
              <p className="text-muted-foreground mb-4">
                Unable to load the current demo video. Please try refreshing the page.
              </p>
              <Button 
                variant="outline" 
                onClick={() => queryClient.invalidateQueries({ queryKey: ['demo-video'] })}
              >
                Retry
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Demo Video Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {demoVideo ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Current Demo Video</Label>
              <p className="text-sm text-muted-foreground">{demoVideo.title}</p>
            </div>
            
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                src={demoVideo.url}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsVideoPlayerOpen(true)}
                poster=""
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                <Button
                  variant="secondary"
                  onClick={() => setIsVideoPlayerOpen(true)}
                  className="bg-white/90 hover:bg-white text-black"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Play Video
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsUploadModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Update Video
              </Button>
              <Button
                variant="destructive"
                onClick={handleRemoveVideo}
                className="flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Remove Video
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Demo Video</h3>
            <p className="text-muted-foreground mb-4">
              Upload a demo video to showcase your platform to users.
            </p>
            <Button onClick={() => setIsUploadModalOpen(true)}>
              Upload Demo Video
            </Button>
          </div>
        )}

        <VideoUploadModal
          open={isUploadModalOpen}
          onOpenChange={setIsUploadModalOpen}
          onVideoUploaded={handleVideoUploaded}
        />

        {demoVideo && (
          <VideoPlayer
            videoUrl={demoVideo.url}
            open={isVideoPlayerOpen}
            onOpenChange={setIsVideoPlayerOpen}
            title={demoVideo.title}
          />
        )}
      </CardContent>
    </Card>
  );
};
