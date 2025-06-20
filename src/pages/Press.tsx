import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Users, Calendar, Award } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export const Press = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Press Relations</h1>
          <p className="text-muted-foreground">
            Media resources and company information for journalists and press
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="w-5 h-5" />
                <span>Press Kit</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download our complete press kit including logos, screenshots, and company information
              </p>
              <Button>Download Press Kit</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Media Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get in touch with our media relations team for interviews and inquiries
              </p>
              <p className="font-semibold">press@splitclub.com</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5" />
              <span>Recent News</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold">SplitClub Reaches 10,000 Active Users</h3>
                <p className="text-sm text-muted-foreground">December 2024</p>
                <p className="text-muted-foreground mt-2">
                  Our community marketplace continues to grow as more users discover the benefits of sharing unused subscriptions.
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold">Series A Funding Round Completed</h3>
                <p className="text-sm text-muted-foreground">November 2024</p>
                <p className="text-muted-foreground mt-2">
                  SplitClub raises $5M to expand platform features and community reach.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5" />
              <span>Company Facts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">2024</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">$100k+</div>
                <div className="text-sm text-muted-foreground">Community Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">25+</div>
                <div className="text-sm text-muted-foreground">Team Members</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};