
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Leaf, Share2, DollarSign, Users, Shield, Star, Heart, CheckCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VideoPlayer } from '@/components/VideoPlayer';
import { DemoVideoSection } from '@/components/DemoVideoSection';

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
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 md:py-24"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center space-x-2 mb-6"
              variants={scaleIn}
              transition={{ delay: 0.2 }}
            >
              <Leaf className="w-8 h-8 text-primary" />
              <Badge variant="outline" className="text-sm px-3 py-1">
                Share. Save. Sustain.
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-foreground mb-6"
              variants={fadeInUp}
              transition={{ delay: 0.3 }}
            >
              Turn Waste Into
              <span className="text-primary block">Community Value</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              Share your unused subscription slots, membership benefits, and rewards with our community. 
              Make premium services accessible while reducing digital waste.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={fadeInUp}
              transition={{ delay: 0.5 }}
            >
              <Button size="lg" asChild className="text-lg px-8 py-3">
                <Link to="/deals">
                  Browse Deals <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                <Link to="/about">Learn More</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section 
        className="py-12 bg-card/50"
        variants={fadeInUp}
        transition={{ delay: 0.6 }}
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
        variants={fadeInUp}
        transition={{ delay: 0.7 }}
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
        variants={fadeInUp}
        transition={{ delay: 0.8 }}
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
        variants={fadeInUp}
        transition={{ delay: 0.9 }}
      >
        <DemoVideoSection />
      </motion.div>

      {/* CTA Section */}
      <motion.section 
        className="py-16 md:py-24 bg-primary"
        variants={fadeInUp}
        transition={{ delay: 1.0 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6"
            variants={fadeInUp}
          >
            Ready to Join the Community?
          </motion.h2>
          <motion.p 
            className="text-xl text-primary-foreground/80 mb-8"
            variants={fadeInUp}
            transition={{ delay: 0.1 }}
          >
            Start sharing your unused benefits or find amazing deals shared by others.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-3">
              <Link to="/login">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link to="/about">Learn More</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};
