import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Linkedin, Twitter } from 'lucide-react';

export const WhoAreWe = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      bio: 'Former product manager at tech unicorn with 10+ years in community-driven platforms.',
      initials: 'SJ'
    },
    {
      name: 'Mike Chen',
      role: 'CTO & Co-Founder', 
      bio: 'Full-stack engineer with expertise in scalable marketplace architectures.',
      initials: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Community',
      bio: 'Community building expert focused on creating meaningful user connections.',
      initials: 'ER'
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: 'Senior engineer with experience building high-performance web applications.',
      initials: 'DK'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Who Are We?</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the passionate team behind SplitClub, working to create a more sustainable and connected world
          </p>
        </div>

        {/* Company Story */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              SplitClub was founded in 2024 by a team of entrepreneurs who noticed a growing problem: valuable digital subscriptions and memberships were going unused while others couldn't afford them. We believed there had to be a better way to connect people who have unused benefits with those who could use them.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              What started as a simple idea between friends has grown into a thriving community marketplace that's helping thousands of people save money while reducing digital waste. We're proud to be building something that makes premium services more accessible while fostering genuine connections between community members.
            </p>
          </CardContent>
        </Card>

        {/* Team Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.name}>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="text-lg font-semibold">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <Badge variant="secondary">{member.role}</Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                  <div className="flex space-x-2">
                    <Linkedin className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                    <Twitter className="w-4 h-4 text-muted-foreground hover:text-primary cursor-pointer" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What Drives Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2 text-primary">🎯 Purpose-Driven</h4>
                <p className="text-sm text-muted-foreground">
                  We're not just building a product; we're creating positive change in how people access and share digital resources.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">🔄 Continuous Learning</h4>
                <p className="text-sm text-muted-foreground">
                  We're always listening to our community and evolving based on their needs and feedback.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">🤝 Collaboration</h4>
                <p className="text-sm text-muted-foreground">
                  We believe the best solutions come from working together, both within our team and with our community.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">🌟 Excellence</h4>
                <p className="text-sm text-muted-foreground">
                  We're committed to delivering the highest quality experience for every member of our community.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vision */}
        <Card>
          <CardHeader>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              We envision a world where digital resources are shared efficiently and sustainably, where communities support each other, and where everyone has access to the tools and services they need to thrive. SplitClub is just the beginning of this vision.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};