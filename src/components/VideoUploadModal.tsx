import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Upload, Play, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { videoService, VideoServiceError } from '@/services/videoService';

interface VideoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVideoUploaded: (videoUrl: string) => void;
}

export const VideoUploadModal = ({ open, onOpenChange, onVideoUploaded }: VideoUploadModalProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      const videoUrl = await videoService.uploadDemoVideo(file, 'Demo Video');
      
      if (videoUrl) {
        onVideoUploaded(videoUrl);
        onOpenChange(false);
        
        toast({
          title: "Success",
          description: "Demo video uploaded successfully!",
        });
      } else {
        throw new Error('Failed to get video URL after upload');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      
      let errorMessage = 'Failed to upload video. Please try again.';
      let errorTitle = 'Upload failed';
      
      if (error instanceof VideoServiceError) {
        errorTitle = 'Upload Error';
        switch (error.code) {
          case 'INVALID_FILE_TYPE':
            errorMessage = 'Please upload a valid video file.';
            break;
          case 'FILE_TOO_LARGE':
            errorMessage = 'Please upload a video smaller than 100MB.';
            break;
          case 'UPLOAD_ERROR':
            errorMessage = `Upload failed: ${error.message}`;
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Play className="w-5 h-5" />
            Upload Demo Video
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
              dragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag and drop a video file here, or click to select
            </p>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP4, MOV, AVI (Max 100MB)
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={handleInputChange}
              className="hidden"
              id="video-upload"
              disabled={uploading}
            />
            <label
              htmlFor="video-upload"
              className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Select Video File'}
            </label>
          </div>

          {uploading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm text-muted-foreground">Uploading video...</span>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Upload Guidelines:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Maximum file size: 100MB</li>
                  <li>• Supported formats: MP4, MOV, AVI</li>
                  <li>• Video will replace the current demo video</li>
                  <li>• Upload may take a few minutes for large files</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};