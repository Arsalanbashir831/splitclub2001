
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Users, Target, Heart, Shield } from 'lucide-react';

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About SplitClub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building a community-driven marketplace where people can share unused subscriptions, 
            memberships, and rewards to reduce waste and save money together.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To create a sustainable economy where nothing goes to waste. We believe that by sharing 
                unused resources, we can help people save money while reducing environmental impact.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Community First</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our platform is built by the community, for the community. Every feature is designed 
                to foster trust, transparency, and mutual benefit among our users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Heart className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Social Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Beyond saving money, we're creating positive social and environmental impact by 
                maximizing the utility of existing resources and building stronger communities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Trust & Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We prioritize user safety with verification systems, community moderation, 
                and transparent policies to ensure a secure sharing environment.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start sharing and saving today. Together, we can make a difference.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link to="/deals">Browse Deals</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
