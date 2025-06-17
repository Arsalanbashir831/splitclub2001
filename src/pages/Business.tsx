import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Users, TrendingUp, Shield, Zap, Globe } from 'lucide-react';

export const Business = () => {
  const features = [
    {
      icon: Building,
      title: 'Enterprise Dashboard',
      description: 'Comprehensive analytics and management tools for your organization\'s benefit sharing programs.'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Easily manage multiple users and set permissions for different departments and roles.'
    },
    {
      icon: TrendingUp,
      title: 'Cost Optimization',
      description: 'Track savings and optimize your subscription spending with detailed reporting and insights.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with SSO, audit logs, and compliance features for peace of mind.'
    }
  ];

  const plans = [
    {
      name: 'Startup',
      price: '$99',
      period: '/month',
      description: 'Perfect for small teams getting started',
      features: ['Up to 25 employees', 'Basic analytics', 'Email support', 'API access'],
      highlighted: false
    },
    {
      name: 'Growth',
      price: '$299',
      period: '/month',
      description: 'Ideal for growing companies',
      features: ['Up to 100 employees', 'Advanced analytics', 'Priority support', 'Custom integrations', 'SSO'],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tailored for large organizations',
      features: ['Unlimited employees', 'White-label options', 'Dedicated support', 'Custom features', 'SLA guarantee'],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-1" />
            Enterprise Solutions
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Services for Business</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Empower your organization with enterprise-grade benefit sharing solutions. 
            Reduce costs, improve employee satisfaction, and maximize your subscription investments.
          </p>
          <div className="mt-8 space-x-4">
            <Button size="lg">Get Started</Button>
            <Button variant="outline" size="lg">Schedule Demo</Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose SplitClub for Business?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Business Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">40%</div>
                <div className="text-sm text-muted-foreground">Average Cost Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Employee Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">60%</div>
                <div className="text-sm text-muted-foreground">Subscription Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.highlighted ? 'border-primary' : ''}>
                <CardHeader>
                  {plan.highlighted && (
                    <Badge className="w-fit mb-2">Most Popular</Badge>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}<span className="text-lg text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.highlighted ? 'default' : 'outline'}
                  >
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Use Cases */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Perfect for Every Industry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Globe className="w-4 h-4 mr-2 text-primary" />
                  Tech Companies
                </h4>
                <p className="text-sm text-muted-foreground">
                  Maximize software subscriptions and development tools across distributed teams.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Building className="w-4 h-4 mr-2 text-primary" />
                  Creative Agencies
                </h4>
                <p className="text-sm text-muted-foreground">
                  Share expensive creative software licenses and streaming services efficiently.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-primary" />
                  Consulting Firms
                </h4>
                <p className="text-sm text-muted-foreground">
                  Optimize research tools and professional memberships across client teams.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                  Financial Services
                </h4>
                <p className="text-sm text-muted-foreground">
                  Manage data subscriptions and analytics tools with enterprise compliance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardContent className="pt-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join hundreds of companies already saving money and improving efficiency with SplitClub's enterprise solutions.
            </p>
            <div className="space-x-4">
              <Button size="lg">Start Free Trial</Button>
              <Button variant="outline" size="lg">Contact Sales</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              30-day free trial • No credit card required • Setup in minutes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};