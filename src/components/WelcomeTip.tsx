import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Lightbulb, Leaf, Heart, Users } from 'lucide-react';

export const WelcomeTip = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome tip before
    try {
      const hasSeenTip = localStorage.getItem('splitclub-welcome-tip-seen');
      if (!hasSeenTip) {
        setIsVisible(true);
      }
    } catch (error) {
      // If localStorage is not available (e.g., in iframe), show the tip
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    try {
      localStorage.setItem('splitclub-welcome-tip-seen', 'true');
    } catch (error) {
      // If localStorage is not available, just continue without saving
      console.log('localStorage not available');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full mx-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2 h-8 w-8 p-0"
            onClick={handleDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-xl">Welcome to SplitClub!</CardTitle>
              <Badge variant="secondary" className="text-xs">
                Community Savings Platform
              </Badge>
            </div>
          </div>
          <CardDescription>
            Join thousands saving money and reducing waste together
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Heart className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Share unused benefits</h4>
                <p className="text-xs text-muted-foreground">
                  Got extra subscription slots or rewards? Share them with the community
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Claim amazing deals</h4>
                <p className="text-xs text-muted-foreground">
                  Find discounted subscriptions and free rewards from other members
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-sm">Make an impact</h4>
                <p className="text-xs text-muted-foreground">
                  Reduce waste and save money while building community connections
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              💡 <strong>Tip:</strong> Use the demo accounts on the login page to explore features!
            </p>
          </div>

          <div className="flex space-x-2">
            <Button onClick={handleDismiss} className="flex-1">
              Get Started
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="flex-1">
              Browse Deals
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};