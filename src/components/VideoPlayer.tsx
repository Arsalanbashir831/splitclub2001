import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Maximize, Play, Pause } from "lucide-react";

interface VideoPlayerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	videoUrl: string;
	title?: string;
}

export const VideoPlayer = ({
	open,
	onOpenChange,
	videoUrl,
	title = "Demo Video",
}: VideoPlayerProps) => {
	const [playing, setPlaying] = useState(false);
	const [muted, setMuted] = useState(false);
	const [videoRef, setVideoRef] = useState<HTMLVideoElement | null>(null);

	const togglePlay = () => {
		if (videoRef) {
			if (playing) {
				videoRef.pause();
			} else {
				videoRef.play();
			}
			setPlaying(!playing);
		}
	};

	const toggleMute = () => {
		if (videoRef) {
			videoRef.muted = !muted;
			setMuted(!muted);
		}
	};

	const toggleFullscreen = () => {
		if (videoRef) {
			if (document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				videoRef.requestFullscreen();
			}
		}
	};

	const handleVideoEnd = () => {
		setPlaying(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-4xl w-full p-0 overflow-hidden">
				<div className="relative bg-black">
					{/* Video Element */}
					<video
						ref={setVideoRef}
						className="w-full h-auto max-h-[70vh]"
						onPlay={() => setPlaying(true)}
						onPause={() => setPlaying(false)}
						onEnded={handleVideoEnd}
						controls={false}
						poster="">
						<source src={videoUrl} />
						Your browser does not support the video tag.
					</video>

					{/* Video Controls Overlay */}
					<div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity duration-300">
						{/* Top Controls */}
						<div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent">
							<div className="flex justify-between items-center">
								<h3 className="text-white font-medium">{title}</h3>
							</div>
						</div>

						{/* Center Play Button */}
						<div className="absolute inset-0 flex items-center justify-center">
							<Button
								variant="ghost"
								size="icon"
								onClick={togglePlay}
								className="w-16 h-16 text-white hover:bg-white/20 rounded-full">
								{playing ? (
									<Pause className="w-8 h-8" />
								) : (
									<Play className="w-8 h-8 ml-1" />
								)}
							</Button>
						</div>

						{/* Bottom Controls */}
						<div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<Button
										variant="ghost"
										size="icon"
										onClick={togglePlay}
										className="text-white hover:bg-white/20">
										{playing ? (
											<Pause className="w-4 h-4" />
										) : (
											<Play className="w-4 h-4" />
										)}
									</Button>

									<Button
										variant="ghost"
										size="icon"
										onClick={toggleMute}
										className="text-white hover:bg-white/20">
										{muted ? (
											<VolumeX className="w-4 h-4" />
										) : (
											<Volume2 className="w-4 h-4" />
										)}
									</Button>
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={toggleFullscreen}
									className="text-white hover:bg-white/20">
									<Maximize className="w-4 h-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
