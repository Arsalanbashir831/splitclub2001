import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/Navbar';
import { useAuthStore } from '../store/authStore';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Leaf, AlertTriangle } from 'lucide-react';
import { 
  signInSchema, 
  signUpSchema, 
  sanitizeInput, 
  RateLimiter,
  type SignInFormData,
  type SignUpFormData
} from '../utils/validation';

// Rate limiter for authentication attempts
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [rateLimitTime, setRateLimitTime] = useState(0);
  const { signIn, signUp, isAuthenticated } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Check rate limiting on component mount and updates
  useEffect(() => {
    const checkRateLimit = () => {
      const clientId = 'auth_attempt'; // Use IP in production
      const isLimited = rateLimiter.isRateLimited(clientId);
      setIsRateLimited(isLimited);
      
      if (isLimited) {
        const remaining = rateLimiter.getRemainingTime(clientId);
        setRateLimitTime(Math.ceil(remaining / 1000 / 60)); // Convert to minutes
      }
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const validateSignInForm = (): boolean => {
    try {
      const sanitizedData = {
        email: sanitizeInput(email),
        password: password, // Don't sanitize password as it might contain special chars
      };
      
      signInSchema.parse(sanitizedData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const validateSignUpForm = (): boolean => {
    try {
      const sanitizedData = {
        email: sanitizeInput(email),
        password: password,
        displayName: displayName ? sanitizeInput(displayName) : undefined,
      };
      
      signUpSchema.parse(sanitizedData);
      setValidationErrors({});
      return true;
    } catch (error: any) {
      const errors: Record<string, string> = {};
      error.errors?.forEach((err: any) => {
        errors[err.path[0]] = err.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (isRateLimited) {
      toast({
        title: "Too many attempts",
        description: `Please wait ${rateLimitTime} minutes before trying again.`,
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!validateSignInForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await signIn(sanitizeInput(email), password);
      if (!error) {
        toast({
          title: "Welcome back!",
          description: "You've successfully signed in to SplitClub.",
        });
        window.location.href = '/';
      } else {
        toast({
          title: "Sign in failed",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check rate limiting
    if (isRateLimited) {
      toast({
        title: "Too many attempts",
        description: `Please wait ${rateLimitTime} minutes before trying again.`,
        variant: "destructive",
      });
      return;
    }

    // Validate form
    if (!validateSignUpForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const sanitizedDisplayName = displayName ? sanitizeInput(displayName) : undefined;
      const { error } = await signUp(sanitizeInput(email), password, sanitizedDisplayName);
      if (!error) {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
        setActiveTab('signin');
        // Clear form
        setEmail('');
        setPassword('');
        setDisplayName('');
      } else {
        toast({
          title: "Sign up failed",
          description: error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className='flex items-center justify-center p-4'>
      <div className="w-full max-w-md space-y-6">
        {/* Logo and branding */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to SplitClub</h1>
          <p className="text-muted-foreground mt-2">
            Share unused subscriptions and rewards with your community
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome to SplitClub</CardTitle>
            <CardDescription>
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Rate limiting warning */}
            {isRateLimited && (
              <Alert className="mb-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Too many login attempts. Please wait {rateLimitTime} minutes before trying again.
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={validationErrors.email ? 'border-destructive' : ''}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-destructive">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={validationErrors.password ? 'border-destructive' : ''}
                    />
                    {validationErrors.password && (
                      <p className="text-sm text-destructive">{validationErrors.password}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || isRateLimited}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Display Name (Optional)</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className={validationErrors.displayName ? 'border-destructive' : ''}
                    />
                    {validationErrors.displayName && (
                      <p className="text-sm text-destructive">{validationErrors.displayName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={validationErrors.email ? 'border-destructive' : ''}
                    />
                    {validationErrors.email && (
                      <p className="text-sm text-destructive">{validationErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="8+ chars, uppercase, lowercase, number, special char"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={validationErrors.password ? 'border-destructive' : ''}
                    />
                    {validationErrors.password && (
                      <p className="text-sm text-destructive">{validationErrors.password}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading || isRateLimited}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer attribution */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            This app was created with the help of{' '}
            <a 
              href="https://launchmd.ingenious.agency" 
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              LaunchMD
            </a>
          </p>
        </div>
      </div>
        </div>
    </div>
  );
};