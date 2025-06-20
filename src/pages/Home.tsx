import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoUploadModal } from '@/components/VideoUploadModal';
import { DemoVideoSection } from '@/components/DemoVideoSection';
import { ArrowRight, Leaf, Share2, DollarSign, Users, Shield, Star, Heart, CheckCircle, Calendar, Play, Upload, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
};

export const Home = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  
  const isAdmin = user?.isAdmin || false;
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

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
    setShowVideoPlayer(true);
  };

  const latestDeals = [
    {
      title: "Netflix Premium Account Share",
      originalPrice: "$15.99",
      sharePrice: "$4.00",
      category: "Streaming",
      expiryDate: "2024-01-15",
      savings: "75%"
    },
    {
      title: "Spotify Family Plan Slot",
      originalPrice: "$15.99",
      sharePrice: "$3.00",
      category: "Music",
      expiryDate: "2024-01-20",
      savings: "81%"
    },
    {
      title: "Adobe Creative Suite License",
      originalPrice: "$52.99",
      sharePrice: "$10.00",
      category: "Software",
      expiryDate: "2024-01-25",
      savings: "81%"
    }
  ];

  const features = [
    {
      icon: Share2,
      title: "Share Unused Benefits",
      description: "Turn your unused subscriptions and memberships into shared value for the community."
    },
    {
      icon: DollarSign,
      title: "Save Money",
      description: "Access premium services at a fraction of the cost through community sharing."
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with like-minded people who believe in sustainable consumption."
    },
    {
      icon: Shield,
      title: "Secure & Trusted",
      description: "Safe transactions and verified users ensure a trustworthy experience."
    }
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Community Members" },
    { icon: Share2, value: "5K+", label: "Deals Shared" },
    { icon: DollarSign, value: "$250K+", label: "Total Savings" },
    { icon: Leaf, value: "85%", label: "Waste Reduction" }
  ];

  return (
    <motion.div 
      className="min-h-screen bg-background"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden animate-fade-in">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5"
          style={{ y }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              className="space-y-8"
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Badge variant="secondary" className="w-fit">
                    🎉 New Feature: Mobile App Available
                  </Badge>
                </motion.div>
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  Share deals,
                  <span className="text-primary"> Save money</span>
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground max-w-lg"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  Join the community marketplace for unused subscriptions, memberships, and rewards. Reduce waste while saving money together.
                </motion.p>
              </div>

              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
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
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent border-2 border-background"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7 + i * 0.1, duration: 0.3 }}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + i * 0.05 }}
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
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative mx-auto w-80 h-[600px]">
                {/* Main Phone */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-2 shadow-2xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden">
                    {/* Phone Header */}
                    <div className="h-24 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <div className="text-primary-foreground font-bold text-lg">SplitClub</div>
                    </div>

                    {/* Phone Content */}
                    <div className="p-6 space-y-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-1/2 animate-pulse"></div>
                      </div>
                      
                      {/* Deal Cards */}
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <Card key={i} className="p-4">
                            <CardContent className="p-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg"></div>
                                <div className="flex-1 space-y-2">
                                  <div className="h-3 bg-muted rounded w-full animate-pulse"></div>
                                  <div className="h-2 bg-muted rounded w-2/3 animate-pulse"></div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Secondary Phone */}
                <motion.div 
                  className="absolute -right-16 top-20 w-64 h-[480px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-[2.5rem] p-2 shadow-xl opacity-60 rotate-12"
                  animate={{ 
                    rotate: [12, 8, 12],
                    y: [0, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-full h-full bg-background rounded-[2rem] overflow-hidden">
                    <div className="h-16 bg-gradient-to-r from-accent to-primary"></div>
                    <div className="p-4 space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 bg-muted rounded animate-pulse"></div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Floating Elements */}
                <motion.div 
                  className="absolute -left-8 top-32 w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/30"
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Shield className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.div 
                  className="absolute -right-4 bottom-32 w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-accent/30"
                  animate={{ 
                    y: [0, 10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Zap className="w-6 h-6 text-accent" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section 
        className="py-12 bg-card/50"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div 
                  key={index}
                  className="text-center"
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 md:py-24"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How SplitClub Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join a community that believes in making the most of what we have
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={staggerContainer}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={scaleIn}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full border-2 hover:border-primary/20 transition-colors">
                    <CardHeader className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
                        <Icon className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-center text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Latest Deals Section */}
      <motion.section 
        className="py-16 md:py-24 bg-card/30"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Latest Community Deals
            </h2>
            <p className="text-xl text-muted-foreground">
              Fresh opportunities shared by our community members
            </p>
          </motion.div>
          
          <motion.div 
            className="overflow-x-auto"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Deal</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Original Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Share Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Savings</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">Expires</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {latestDeals.map((deal, index) => (
                  <motion.tr 
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 dark:text-gray-100">{deal.title}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{deal.category}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 line-through">{deal.originalPrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-green-600">{deal.sharePrice}</span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {deal.savings} off
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(deal.expiryDate).toLocaleDateString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
          
          <motion.div 
            className="text-center mt-8"
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <Button size="lg" asChild>
              <Link to="/deals">View All Deals</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Video Demo Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <DemoVideoSection />
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
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Start Saving?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Join thousands of users who are already saving money with SplitClub
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
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

      <Footer />
    </motion.div>
  );
};
