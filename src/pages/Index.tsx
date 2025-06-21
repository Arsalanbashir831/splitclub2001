
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useDeals } from '@/hooks/useDeals';
import { useAuthStore } from '@/store/authStore';
import { videoService } from '@/services/videoService';
import { 
  Play, 
  Share2, 
  DollarSign, 
  Users, 
  Leaf, 
  Star, 
  ArrowRight, 
  CheckCircle,
  TrendingUp,
  Gift,
  Shield,
  Clock
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { deals, isLoading } = useDeals();
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const handleDemoVideo = async () => {
    try {
      const demoVideo = await videoService.getActiveDemoVideo();
      if (demoVideo?.url) {
        setVideoUrl(demoVideo.url);
        setIsVideoOpen(true);
      } else {
        console.log('No demo video available');
      }
    } catch (error) {
      console.error('Error loading demo video:', error);
    }
  };

  const featuredDeals = deals?.slice(0, 6) || [];

  const features = [
    {
      icon: Share2,
      title: "Share Unused Benefits",
      description: "Turn your unused subscriptions, memberships, and rewards into shared value for the community."
    },
    {
      icon: DollarSign,
      title: "Save Money Together",
      description: "Access premium services and deals at a fraction of the cost by sharing with others."
    },
    {
      icon: Leaf,
      title: "Reduce Waste",
      description: "Help create a more sustainable future by ensuring nothing valuable goes to waste."
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Our platform ensures secure transactions and protects both sharers and claimers."
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join a growing community of conscious consumers sharing resources responsibly."
    },
    {
      icon: Clock,
      title: "Quick & Easy",
      description: "Simple process to share deals or claim benefits - get started in minutes."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Community Member",
      content: "SplitClub helped me save over $200 last month by sharing gym memberships and streaming services. It's amazing!",
      rating: 5
    },
    {
      name: "Mike Chen",
      role: "Deal Sharer",
      content: "I love being able to help others while making some money from my unused benefits. Win-win for everyone!",
      rating: 5
    },
    {
      name: "Emma Davis",
      role: "Regular User",
      content: "The community here is fantastic. People are honest, deals are real, and the savings are incredible.",
      rating: 5
    }
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Active Members" },
    { icon: Gift, value: "2.5K+", label: "Deals Shared" },
    { icon: DollarSign, value: "$150K+", label: "Total Savings" },
    { icon: TrendingUp, value: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <motion.section 
        className="relative bg-gradient-to-br from-gray-900 via-black to-gray-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"><g fill=\"none\" fill-rule=\"evenodd\"><g fill=\"%239C92AC\" fill-opacity=\"0.1\"><circle cx=\"7\" cy=\"7\" r=\"1\"/></g></g></svg>')] opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold">SplitClub</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Share. Save. <span className="text-primary">Sustain.</span>
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Join the community marketplace for unused subscriptions, memberships, and rewards. 
                Reduce waste while saving money together.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-3"
                  onClick={() => isAuthenticated ? navigate('/deals') : navigate('/login')}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-lg px-8 py-3 border-white/20 text-white hover:bg-white/10"
                  onClick={handleDemoVideo}
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>
              
              <div className="grid grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  >
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                <img 
                  src="/placeholder.svg" 
                  alt="SplitClub Community" 
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-20 bg-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Why Choose SplitClub?
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Discover the benefits of joining our community-driven marketplace
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 bg-muted/30"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              What Our Community Says
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Real stories from real members
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                    <CardDescription>{testimonial.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Deals Section */}
      <motion.section 
        className="py-20 bg-background"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Featured Deals
            </motion.h2>
            <motion.p 
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Discover amazing deals shared by our community
            </motion.p>
          </div>
          
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading deals...</p>
            </div>
          ) : featuredDeals.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {featuredDeals.map((deal, index) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary">{deal.category}</Badge>
                          {deal.isFree ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Free
                            </Badge>
                          ) : (
                            <span className="font-semibold text-lg">${deal.sharePrice}</span>
                          )}
                        </div>
                        <CardTitle className="text-lg line-clamp-1">{deal.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {deal.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {deal.availableSlots}/{deal.totalSlots} available
                            </span>
                          </div>
                        </div>
                        <Button 
                          className="w-full" 
                          onClick={() => isAuthenticated ? navigate(`/deal/${deal.id}`) : navigate('/login')}
                        >
                          View Deal
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => isAuthenticated ? navigate('/deals') : navigate('/login')}
                >
                  View All Deals
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </>
          ) : (
            <div className="text-center">
              <Gift className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No deals available yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share a deal with the community!</p>
              <Button onClick={() => isAuthenticated ? navigate('/share-deal') : navigate('/login')}>
                Share Your First Deal
              </Button>
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 bg-primary text-primary-foreground"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Ready to Join SplitClub?
          </motion.h2>
          <motion.p 
            className="text-xl mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Start sharing, saving, and building a more sustainable future today
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-3"
              onClick={() => isAuthenticated ? navigate('/deals') : navigate('/login')}
            >
              Browse Deals
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3 border-white/20 text-white hover:bg-white/10"
              onClick={() => isAuthenticated ? navigate('/share-deal') : navigate('/login')}
            >
              Share a Deal
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <Footer />

      {/* Demo Video Modal */}
      {videoUrl && (
        <VideoPlayer
          open={isVideoOpen}
          onOpenChange={setIsVideoOpen}
          videoUrl={videoUrl}
          title="SplitClub Demo"
        />
      )}
    </div>
  );
};

export default Index;
