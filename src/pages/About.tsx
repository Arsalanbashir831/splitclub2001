import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';
import { Leaf, Heart, Users, Lightbulb, Target, Globe } from 'lucide-react';
export const About = () => {
  return (
    <div className="min-h-screen bg-background">
<Navbar />
<div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">About SplitClub</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A community marketplace where unused subscriptions, memberships, and rewards find new purpose
          </p>
          <Badge variant="secondary" className="mt-4">
            Share. Save. Sustain.
          </Badge>
        </div>

{/* Mission Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary" />
              <span>Our Mission</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              SplitClub was born from a simple observation: too many valuable digital benefits go unused while others 
              struggle to afford them. We created a platform where community members can share their unused subscription 
              slots, membership benefits, and rewards, creating a circular economy that reduces waste and makes premium 
              services more accessible to everyone.
            </p>
          </CardContent>
        </Card>

{/* How It Works */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">How SplitClub Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Share Benefits</CardTitle>
                <CardDescription>
                  Post your unused subscription slots, membership perks, or rewards that would otherwise go to waste
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Find Deals</CardTitle>
                <CardDescription>
                  Browse amazing deals shared by community members and claim the ones that interest you
                </CardDescription>
              </CardHeader>
            </Card>
<Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Build Community</CardTitle>
                <CardDescription>
                  Connect with like-minded individuals who care about sustainability and smart spending
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Values Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              <span>Our Values</span>
            </CardTitle>
          </CardHeader>
<CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">🌱 Sustainability</h4>
                <p className="text-sm text-muted-foreground">
                  We believe in reducing digital waste by ensuring valuable resources don't go unused.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🤝 Community</h4>
                <p className="text-sm text-muted-foreground">
                  Building connections between people who want to help each other save money and resources.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">💡 Innovation</h4>
                <p className="text-sm text-muted-foreground">
                  Creating new ways to share and access digital services in a fair and transparent manner.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🔒 Trust</h4>
                <p className="text-sm text-muted-foreground">
                  Maintaining a safe, secure platform where community members can share with confidence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

{/* Community Impact */}
        <Card>
          <CardHeader>
            <CardTitle>Community Impact</CardTitle>
            <CardDescription>Together, we're making a difference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Deals Shared</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">$10k+</div>
                <div className="text-sm text-muted-foreground">Community Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">200+</div>
                <div className="text-sm text-muted-foreground">Active Members</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
</div>
    </div>
  );
};
