import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/Navbar';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                By accessing and using SplitClub, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Permission is granted to temporarily download one copy of SplitClub per device for personal, non-commercial transitory viewing only.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. User Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Prohibited Uses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground space-y-2">
                <p>You may not use our service:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>For any unlawful purpose or to solicit others to act unlawfully</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you have any questions about this Terms of Service, please contact us at legal@splitclub.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};