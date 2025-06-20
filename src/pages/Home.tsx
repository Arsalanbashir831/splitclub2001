
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CountUp } from '@/components/ui/CountUp';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VideoUploadModal } from '@/components/VideoUploadModal';
import { VideoPlayer } from '@/components/VideoPlayer';
import { DemoVideoSection } from '@/components/DemoVideoSection';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { videoService } from '@/services/videoService';
import { ArrowRight, Play, Upload, Star, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { user, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        // For now, we'll use a simple check. In production, you'd want to check the profiles table
        const adminEmails = ['admin@splitclub.com']; // Add your admin emails here
        setIsAdmin(adminEmails.includes(user.email || ''));
      }
    };

    const loadDemoVideo = async () => {
      try {
        const video = await videoService.getActiveDemoVideo();
        if (video) {
          setDemoVideoUrl(video.url);
        }
      } catch (error) {
        console.error('Error loading demo video:', error);
      }
    };

    checkAdminStatus();
    loadDemoVideo();
  }, [user]);

  const handleWatchDemo = () => {
    if (demoVideoUrl) {
      setShowVideoPlayer(true);
    } else if (isAdmin) {
      setShowUploadModal(true);
    }
  };

  const handleVideoUploaded = (videoUrl: string) => {
    setDemoVideoUrl(videoUrl);
    setShowUploadModal(false);
    toast({
      title: "Video uploaded successfully!",
      description: "The demo video has been uploaded and is now active.",
    });
  };

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Badge variant="secondary" className="w-fit">
                    🎉 New Feature: Mobile App Available
                  </Badge>
                </motion.div>
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Share deals,
                  <span className="text-primary"> Save money</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Join the community marketplace for unused subscriptions, memberships, and rewards. Reduce waste while saving money together.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Button size="lg" className="gap-2" asChild>
                  <Link to="/login">
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="gap-2"
                  onClick={handleWatchDemo}
                  disabled={!demoVideoUrl && !isAdmin}
                >
                  {demoVideoUrl ? (
                    <>
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </>
                  ) : isAdmin ? (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Demo
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Demo Coming Soon
                    </>
                  )}
                </Button>
              </motion.div>

              <motion.div 
                className="flex items-center gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.1, duration: 0.3 }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        transition={{ delay: 0.9 + i * 0.05, duration: 0.3 }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-muted-foreground">4.9/5 from 1000+ reviews</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Mobile Mockups */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div className="relative mx-auto w-80 h-[600px]">
                {/* Main Phone */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl"
                  initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    {/* Phone Header */}
                    <div className="h-24 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="text-primary-foreground font-bold text-lg">SplitClub</div>
                    </div>

                    {/* Phone Content */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <motion.div 
                          className="h-4 bg-muted rounded w-3/4"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: '75%' }}
                          transition={{ delay: 0.8, duration: 0.6 }}
                        />
                        <motion.div 
                          className="h-4 bg-muted rounded w-1/2"
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: '50%' }}
                          transition={{ delay: 0.9, duration: 0.6 }}
                        />
                      </div>
                      
                      {/* Deal Cards */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
                          >
                            <Card className="p-4">
                              <CardContent className="p-0">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg"></div>
                                  <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-muted rounded w-full"></div>
                                    <div className="h-2 bg-muted rounded w-2/3"></div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Phone */}
                <motion.div 
                  className="absolute -right-16 top-20 w-64 h-[480px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-[2.5rem] p-2 shadow-xl opacity-60 rotate-12"
                  initial={{ opacity: 0, scale: 0.6, x: 100 }}
                  animate={{ opacity: 0.6, scale: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-accent to-primary"></div>
                    <div className="p-4 space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div 
                          key={i} 
                          className="h-12 bg-muted rounded"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 1.2 + i * 0.1, duration: 0.4 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div 
                  className="absolute -left-8 top-32 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <Shield className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.div 
                  className="absolute -right-4 bottom-32 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/30"
                  initial={{ opacity: 0, scale: 0, rotate: 180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ delay: 1.7, duration: 0.6 }}
                  whileHover={{ scale: 1.1, rotate: -10 }}
                >
                  <Zap className="w-6 h-6 text-accent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-16 bg-muted/30"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={10000} duration={2} suffix="+" />
              </div>
              <div className="text-muted-foreground">Active Users</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={500000} duration={2} prefix="$" />
              </div>
              <div className="text-muted-foreground">Money Saved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={2500} duration={2} suffix="+" />
              </div>
              <div className="text-muted-foreground">Deals Shared</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={95} duration={2} suffix="%" />
              </div>
              <div className="text-muted-foreground">User Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Demo Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <DemoVideoSection videoUrl={demoVideoUrl} />
      </motion.div>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Start Saving?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join thousands of users who are already saving money with SplitClub
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button size="lg" className="gap-2" asChild>
              <Link to="/login">
                Sign Up Free <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />

      {/* Video Modals */}
      <VideoUploadModal
        open={showUploadModal}
        onOpenChange={setShowUploadModal}
        onVideoUploaded={handleVideoUploaded}
      />

      {demoVideoUrl && (
        <VideoPlayer
          open={showVideoPlayer}
          onOpenChange={setShowVideoPlayer}
          videoUrl={demoVideoUrl}
          title="SplitClub Demo"
        />
      )}
    </motion.div>
  );
};
