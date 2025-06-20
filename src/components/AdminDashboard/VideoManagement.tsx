
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VideoUploadModal } from '@/components/VideoUploadModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Upload, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VideoManagement = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState('');
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);
  const { toast } = useToast();

  const handleVideoUpload = (videoUrl: string, title: string) => {
    setCurrentVideo(videoUrl);
    setVideoTitle(title);
    toast({
      title: "Video uploaded successfully",
      description: "Demo video is now active on the platform.",
    });
  };

  const handleRemoveVideo = () => {
    setCurrentVideo(null);
    setVideoTitle('');
    toast({
      title: "Video removed",
      description: "Demo video has been removed from the platform.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Demo Video Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentVideo ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Current Demo Video</Label>
              <p className="text-sm text-muted-foreground">{videoTitle}</p>
            </div>
            
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              <video
                src={currentVideo}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsVideoPlayerOpen(true)}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Button
                  variant="secondary"
                  onClick={() => setIsVideoPlayerOpen(true)}
                >
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
          onUpload={handleVideoUpload}
        />

        {currentVideo && (
          <VideoPlayer
            videoUrl={currentVideo}
            open={isVideoPlayerOpen}
            onOpenChange={setIsVideoPlayerOpen}
          />
        )}
      </CardContent>
    </Card>
  );
};
