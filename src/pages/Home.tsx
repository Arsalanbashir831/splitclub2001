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
import { ArrowRight, Play, Upload, Star, Shield, Zap, Heart, TrendingUp, Users, DollarSign, Globe, Award, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
export const Home = () => {
  const {
    user,
    isAuthenticated
  } = useAuthStore();
  const {
    toast
  } = useToast();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [demoVideoUrl, setDemoVideoUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);

  // Animation states for the mobile widget
  const [likeAnimations, setLikeAnimations] = useState<number[]>([]);
  const [activityFeed, setActivityFeed] = useState([{
    id: 1,
    user: 'Sarah K.',
    action: 'claimed Netflix deal',
    time: '2m ago',
    avatar: 'bg-blue-500'
  }, {
    id: 2,
    user: 'Mark T.',
    action: 'shared Spotify offer',
    time: '5m ago',
    avatar: 'bg-green-500'
  }, {
    id: 3,
    user: 'Emma L.',
    action: 'saved $500 on gym',
    time: '8m ago',
    avatar: 'bg-purple-500'
  }]);
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminEmails = ['admin@splitclub.com'];
        setIsAdmin(adminEmails.includes(user.email || ''));
      }
    };
    const loadDemoVideo = async () => {
      setIsLoadingVideo(true);
      try {
        console.log('Loading demo video...');
        const video = await videoService.getActiveDemoVideo();
        console.log('Demo video loaded:', video);
        if (video) {
          setDemoVideoUrl(video.url);
        }
      } catch (error) {
        console.error('Error loading demo video:', error);
      } finally {
        setIsLoadingVideo(false);
      }
    };
    checkAdminStatus();
    loadDemoVideo();

    // Animate likes periodically
    const likeInterval = setInterval(() => {
      const newLike = Date.now();
      setLikeAnimations(prev => [...prev, newLike]);
      setTimeout(() => {
        setLikeAnimations(prev => prev.filter(id => id !== newLike));
      }, 2000);
    }, 3000);

    // Simulate real-time activity
    const activityInterval = setInterval(() => {
      const activities = [{
        user: 'Alex R.',
        action: 'joined premium club',
        avatar: 'bg-red-500'
      }, {
        user: 'Lisa M.',
        action: 'found rare deal',
        avatar: 'bg-yellow-500'
      }, {
        user: 'David P.',
        action: 'earned $200 cashback',
        avatar: 'bg-indigo-500'
      }, {
        user: 'Maya S.',
        action: 'unlocked VIP status',
        avatar: 'bg-pink-500'
      }];
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      setActivityFeed(prev => [{
        id: Date.now(),
        ...randomActivity,
        time: 'now'
      }, ...prev.slice(0, 2)]);
    }, 4000);
    return () => {
      clearInterval(likeInterval);
      clearInterval(activityInterval);
    };
  }, [user]);
  const handleWatchDemo = () => {
    console.log('Watch demo clicked, video URL:', demoVideoUrl);
    if (demoVideoUrl) {
      setShowVideoPlayer(true);
    } else if (isAdmin) {
      setShowUploadModal(true);
    } else {
      toast({
        title: "Demo Coming Soon",
        description: "The demo video is not available yet."
      });
    }
  };
  const handleVideoUploaded = async (videoUrl: string) => {
    setDemoVideoUrl(videoUrl);
    setShowUploadModal(false);
    toast({
      title: "Video uploaded successfully!",
      description: "The demo video has been uploaded and is now active."
    });
    try {
      const video = await videoService.getActiveDemoVideo();
      if (video) {
        setDemoVideoUrl(video.url);
      }
    } catch (error) {
      console.error('Error reloading demo video:', error);
    }
  };
  return <motion.div className="min-h-screen bg-background" initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} transition={{
    duration: 0.5
  }}>
      <Navbar />
      
      {/* Hero Section */}
      <motion.section className="relative overflow-hidden" initial={{
      opacity: 0,
      y: 30
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.6
    }}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div className="space-y-8" initial={{
            opacity: 0,
            x: -50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.2,
            duration: 0.6
          }}>
              <div className="space-y-4">
                <motion.div initial={{
                opacity: 0,
                scale: 0.9
              }} animate={{
                opacity: 1,
                scale: 1
              }} transition={{
                delay: 0.3,
                duration: 0.5
              }}>
                  <Badge variant="secondary" className="w-fit bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                    🏆 Trusted by Fortune 500 Companies
                  </Badge>
                </motion.div>
                <motion.h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.4,
                duration: 0.6
              }}>
                  Premium deals,
                  <span className="text-primary"> Exclusive access</span>
                </motion.h1>
                <motion.p className="text-xl text-muted-foreground max-w-lg" initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: 0.5,
                duration: 0.6
              }}>
                  The world's most sophisticated marketplace for high-value subscriptions, memberships, and exclusive rewards. Trusted by institutional investors and premium members worldwide.
                </motion.p>
              </div>

              <motion.div className="flex flex-col sm:flex-row gap-4" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.6,
              duration: 0.6
            }}>
                <Button size="lg" className="gap-2 bg-gradient-to-r from-slate-900 via-blue-900 to-black hover:from-slate-800 hover:via-blue-800 hover:to-gray-900 text-white border-0 shadow-2xl shadow-blue-900/20 dark:bg-gradient-to-r dark:from-white dark:via-gray-100 dark:to-gray-50 dark:hover:from-gray-100 dark:hover:via-gray-200 dark:hover:to-gray-100 dark:text-black dark:shadow-white/10" asChild>
                  <Link to="/login">
                    Access Platform <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="gap-2 border-primary/30 hover:bg-primary/5" onClick={handleWatchDemo} disabled={isLoadingVideo}>
                  {isLoadingVideo ? <>
                      Loading...
                    </> : demoVideoUrl ? <>
                      <Play className="w-4 h-4" />
                      Watch Demo
                    </> : isAdmin ? <>
                      <Upload className="w-4 h-4" />
                      Upload Demo
                    </> : <>
                      <Play className="w-4 h-4" />
                      Request Demo
                    </>}
                </Button>
              </motion.div>

              <motion.div className="flex items-center gap-4 pt-4" initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: 0.7,
              duration: 0.6
            }}>
                <div className="flex -space-x-3">
                  {[{
                  name: 'Goldman Sachs',
                  bg: 'bg-blue-900',
                  text: 'GS'
                }, {
                  name: 'JP Morgan',
                  bg: 'bg-slate-800',
                  text: 'JPM'
                }, {
                  name: 'BlackRock',
                  bg: 'bg-gray-900',
                  text: 'BR'
                }, {
                  name: 'Morgan Stanley',
                  bg: 'bg-blue-800',
                  text: 'MS'
                }, {
                  name: 'Citadel',
                  bg: 'bg-indigo-900',
                  text: 'C'
                }].map((company, i) => <motion.div key={company.name} className={`w-12 h-12 rounded-full ${company.bg} border-3 border-white dark:border-slate-800 flex items-center justify-center text-xs font-bold text-white shadow-lg`} initial={{
                  opacity: 0,
                  scale: 0
                }} animate={{
                  opacity: 1,
                  scale: 1
                }} transition={{
                  delay: 0.8 + i * 0.1,
                  duration: 0.3
                }} title={company.name}>
                      {company.text}
                    </motion.div>)}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => <motion.div key={i} initial={{
                    opacity: 0,
                    rotate: -180
                  }} animate={{
                    opacity: 1,
                    rotate: 0
                  }} transition={{
                    delay: 0.9 + i * 0.05,
                    duration: 0.3
                  }}>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>)}
                  </div>
                  <p className="text-muted-foreground font-medium">Trusted by leading Community Partners</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Content - Premium Mobile Widget */}
            <motion.div className="relative" initial={{
            opacity: 0,
            x: 50
          }} animate={{
            opacity: 1,
            x: 0
          }} transition={{
            delay: 0.3,
            duration: 0.8
          }}>
              <div className="relative mx-auto w-80 h-[650px]">
                {/* Main Premium Phone */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[3rem] p-3 shadow-2xl border border-slate-700" initial={{
                opacity: 0,
                scale: 0.8,
                rotateY: 30
              }} animate={{
                opacity: 1,
                scale: 1,
                rotateY: 0
              }} transition={{
                delay: 0.5,
                duration: 0.8
              }}>
                  {/* Phone Notch */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-full border border-slate-600"></div>
                  
                  <div className="w-full h-full bg-gradient-to-br from-slate-50 to-white rounded-[2.5rem] overflow-hidden relative">
                    {/* Premium Header */}
                    <div className="h-28 bg-gradient-to-r from-black via-black to-black flex items-center justify-center relative overflow-hidden">
                      <motion.div className="absolute inset-0 bg-white/10" animate={{
                      background: ['linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)', 'linear-gradient(225deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%)']
                    }} transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }} />
                      <div className="text-white font-bold text-xl tracking-wide flex items-center gap-2">
                        <Award className="w-6 h-6" />
                        SplitClub Pro
                      </div>
                      
                    </div>

                    {/* Live Activity Feed */}
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-semibold text-slate-700">Live Activity</span>
                        <TrendingUp className="w-3 h-3 text-green-600" />
                      </div>
                      <motion.div className="space-y-1" layout>
                        {activityFeed.map((activity, index) => <motion.div key={activity.id} initial={{
                        opacity: 0,
                        x: -20,
                        scale: 0.95
                      }} animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1
                      }} exit={{
                        opacity: 0,
                        x: 20,
                        scale: 0.95
                      }} className="flex items-center gap-2 text-xs" layout>
                            <div className={`w-4 h-4 ${activity.avatar} rounded-full flex-shrink-0`}></div>
                            <span className="text-slate-600 truncate">
                              <span className="font-medium">{activity.user}</span> {activity.action}
                            </span>
                            <span className="text-slate-400 text-[10px]">{activity.time}</span>
                          </motion.div>)}
                      </motion.div>
                    </div>

                    {/* Premium Deal Cards */}
                    <div className="p-4 space-y-3 flex-1">
                      {[{
                      title: 'Goldman Sachs Access',
                      value: '$50K',
                      category: 'Financial',
                      icon: DollarSign,
                      gradient: 'from-yellow-400 to-orange-500'
                    }, {
                      title: 'Private Jet Shares',
                      value: '€25K',
                      category: 'Travel',
                      icon: Globe,
                      gradient: 'from-blue-500 to-cyan-400'
                    }, {
                      title: 'Exclusive Wine Club',
                      value: '$15K',
                      category: 'Luxury',
                      icon: Award,
                      gradient: 'from-purple-500 to-pink-500'
                    }].map((deal, i) => <motion.div key={deal.title} initial={{
                      opacity: 0,
                      y: 20
                    }} animate={{
                      opacity: 1,
                      y: 0
                    }} transition={{
                      delay: 1 + i * 0.2,
                      duration: 0.5
                    }} whileHover={{
                      scale: 1.02,
                      y: -2
                    }} className="relative">
                          <Card className="p-4 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                            <CardContent className="p-0">
                              <div className="flex items-center space-x-3">
                                <div className={`w-14 h-14 bg-gradient-to-br ${deal.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                  <deal.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <h4 className="font-bold text-sm text-slate-800">{deal.title}</h4>
                                    <motion.button whileTap={{
                                  scale: 0.9
                                }} onClick={() => {
                                  const newLike = Date.now();
                                  setLikeAnimations(prev => [...prev, newLike]);
                                  setTimeout(() => {
                                    setLikeAnimations(prev => prev.filter(id => id !== newLike));
                                  }, 2000);
                                }} className="relative">
                                      <Heart className="w-4 h-4 text-red-500 hover:fill-current transition-all" />
                                      {likeAnimations.map(id => <motion.div key={id} initial={{
                                    scale: 0,
                                    y: 0
                                  }} animate={{
                                    scale: [0, 1.2, 0],
                                    y: -30
                                  }} transition={{
                                    duration: 2
                                  }} className="absolute inset-0 text-red-500">
                                          <Heart className="w-4 h-4 fill-current" />
                                        </motion.div>)}
                                    </motion.button>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{deal.category}</span>
                                    <span className="font-bold text-lg text-slate-800">{deal.value}</span>
                                  </div>
                                  <motion.div className="h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mt-2" initial={{
                                width: 0
                              }} animate={{
                                width: `${65 + i * 10}%`
                              }} transition={{
                                delay: 1.5 + i * 0.2,
                                duration: 1
                              }} />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>)}
                    </div>

                    {/* Premium Stats Bar */}
                    <div className="px-4 py-3 bg-gradient-to-r from-slate-900 to-slate-800">
                      <div className="grid grid-cols-3 gap-3 text-center">
                        <div>
                          <div className="text-xl font-bold text-white">
                            <CountUp end={847} duration={2} suffix="M" />
                          </div>
                          <div className="text-xs text-slate-400">Volume</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-green-400">
                            <CountUp end={99.7} duration={2} suffix="%" />
                          </div>
                          <div className="text-xs text-slate-400">Success</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-blue-400">
                            <CountUp end={24} duration={2} suffix="/7" />
                          </div>
                          <div className="text-xs text-slate-400">Support</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Premium Elements */}
                <motion.div className="absolute -left-8 top-24 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-yellow-300/50 shadow-2xl" initial={{
                opacity: 0,
                scale: 0,
                rotate: -180
              }} animate={{
                opacity: 1,
                scale: 1,
                rotate: 0
              }} transition={{
                delay: 1.5,
                duration: 0.6
              }} whileHover={{
                scale: 1.1,
                rotate: 10
              }}>
                  <Shield className="w-10 h-10 text-white" />
                  <motion.div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center" animate={{
                  scale: [1, 1.1, 1]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }}>
                    <span className="text-white text-xs">✓</span>
                  </motion.div>
                </motion.div>

                <motion.div className="absolute -right-6 bottom-32 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-purple-400/50 shadow-2xl" initial={{
                opacity: 0,
                scale: 0,
                rotate: 180
              }} animate={{
                opacity: 1,
                scale: 1,
                rotate: 0
              }} transition={{
                delay: 1.7,
                duration: 0.6
              }} whileHover={{
                scale: 1.1,
                rotate: -10
              }}>
                  <Target className="w-8 h-8 text-white" />
                  <motion.div className="absolute inset-0 bg-purple-400/30 rounded-2xl" animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.1, 0.3]
                }} transition={{
                  duration: 2,
                  repeat: Infinity
                }} />
                </motion.div>

                {/* Floating Success Indicators */}
                
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section className="py-16 bg-muted/30" initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div initial={{
            opacity: 0,
            scale: 0.5
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.1,
            duration: 0.5
          }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={10000} duration={2} suffix="+" />
              </div>
              <div className="text-muted-foreground">Active Users</div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.5
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.2,
            duration: 0.5
          }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={500000} duration={2} prefix="$" />
              </div>
              <div className="text-muted-foreground">Money Saved</div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.5
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.3,
            duration: 0.5
          }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={2500} duration={2} suffix="+" />
              </div>
              <div className="text-muted-foreground">Deals Shared</div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            scale: 0.5
          }} whileInView={{
            opacity: 1,
            scale: 1
          }} viewport={{
            once: true
          }} transition={{
            delay: 0.4,
            duration: 0.5
          }}>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                <CountUp end={95} duration={2} suffix="%" />
              </div>
              <div className="text-muted-foreground">User Satisfaction</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Demo Video Section */}
      <motion.div initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <DemoVideoSection videoUrl={demoVideoUrl} />
      </motion.div>

      {/* CTA Section */}
      <motion.section className="py-20 bg-gradient-to-r from-primary/10 via-background to-accent/10" initial={{
      opacity: 0,
      y: 50
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} transition={{
      duration: 0.6
    }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.2,
          duration: 0.6
        }}>
            Ready to Start Saving?
          </motion.h2>
          <motion.p className="text-xl text-muted-foreground mb-8" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.3,
          duration: 0.6
        }}>
            Join thousands of users who are already saving money with SplitClub
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} transition={{
          delay: 0.4,
          duration: 0.6
        }}>
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
      <VideoUploadModal open={showUploadModal} onOpenChange={setShowUploadModal} onVideoUploaded={handleVideoUploaded} />

      {demoVideoUrl && <VideoPlayer open={showVideoPlayer} onOpenChange={setShowVideoPlayer} videoUrl={demoVideoUrl} title="SplitClub Demo" />}
    </motion.div>;
};