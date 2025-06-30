import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuthStore } from "../store/authStore";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Leaf, AlertTriangle } from "lucide-react";
import {
	signInSchema,
	signUpSchema,
	sanitizeInput,
	RateLimiter,
} from "../utils/validation";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Rate limiter for authentication attempts
const rateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [displayName, setDisplayName] = useState("");
	const [location, setLocation] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [activeTab, setActiveTab] = useState("signin");
	const [validationErrors, setValidationErrors] = useState<
		Record<string, string>
	>({});
	const [isRateLimited, setIsRateLimited] = useState(false);
	const [rateLimitTime, setRateLimitTime] = useState(0);
	const { signIn, signUp, isAuthenticated } = useAuthStore();
	const { toast } = useToast();
	const navigate = useNavigate();
	const [phone, setPhone] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		// Redirect if already authenticated
		if (isAuthenticated) {
			navigate("/");
		}
	}, [isAuthenticated, navigate]);

	// Check rate limiting on component mount and updates
	useEffect(() => {
		const checkRateLimit = () => {
			const clientId = "auth_attempt"; // Use IP in production
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
			// Check if all required fields are filled
			if (!email || !password || !confirmPassword || !displayName || !phone || !location) {
				const errors: Record<string, string> = {};
				if (!email) errors.email = "Email is required";
				if (!password) errors.password = "Password is required";
				if (!confirmPassword) errors.confirmPassword = "Confirm password is required";
				if (!displayName) errors.displayName = "Display name is required";
				if (!phone) errors.phone = "Phone number is required";
				if (!location) errors.location = "Location is required";
				setValidationErrors(errors);
				return false;
			}

			const sanitizedData = {
				email: sanitizeInput(email),
				password: password,
				confirmPassword: confirmPassword,
				displayName: sanitizeInput(displayName),
				phone: phone,
				location: sanitizeInput(location),
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
				window.location.href = "/";
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
			const sanitizedDisplayName = sanitizeInput(displayName);
			const sanitizedLocation = sanitizeInput(location);
			
			const { error } = await signUp(
				sanitizeInput(email),
				password,
				sanitizedDisplayName,
				phone,
				sanitizedLocation
			);
			if (!error) {
				toast({
					title: "Account created!",
					description: "Please check your email to verify your account.",
				});
				setActiveTab("signin");
				// Clear form
				setEmail("");
				setPassword("");
				setDisplayName("");
				setLocation("");
				setPhone("");
				setConfirmPassword("");
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
			<div className="flex items-center justify-center p-4">
				<div className="w-full max-w-md space-y-6">
					{/* Logo and branding */}
					<div className="text-center">
						<div className="flex justify-center mb-4">
							<div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
								<Leaf className="w-8 h-8 text-primary-foreground" />
							</div>
						</div>
						<h1 className="text-3xl font-bold text-foreground">
							Welcome to SplitClub
						</h1>
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
										Too many login attempts. Please wait {rateLimitTime} minutes
										before trying again.
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
												className={
													validationErrors.email ? "border-destructive" : ""
												}
											/>
											{validationErrors.email && (
												<p className="text-sm text-destructive">
													{validationErrors.email}
												</p>
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
												className={
													validationErrors.password ? "border-destructive" : ""
												}
											/>
											{validationErrors.password && (
												<p className="text-sm text-destructive">
													{validationErrors.password}
												</p>
											)}
										</div>
										<div className="flex justify-end">
											<Link to='/forgot-password' className="text-primary text-sm hover:underline">Forgot Password?</Link>
										</div>
										<Button
											type="submit"
											className="w-full"
											disabled={isLoading || isRateLimited}>
											{isLoading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
											Sign In
										</Button>
									</form>
								</TabsContent>

								<TabsContent value="signup" className="space-y-4">
									
									<form onSubmit={handleSignUp} className="space-y-4">
										<div className="space-y-2">
											<Label htmlFor="signup-name">Display Name *</Label>
											<Input
												id="signup-name"
												type="text"
												placeholder="Enter your display name"
												value={displayName}
												onChange={(e) => setDisplayName(e.target.value)}
												required
												className={validationErrors.displayName ? "border-destructive" : ""}
											/>
											{validationErrors.displayName && (
												<p className="text-sm text-destructive">{validationErrors.displayName}</p>
											)}
										</div>
										<div className="space-y-2">
											<Label htmlFor="signup-email">Email *</Label>
											<Input
												id="signup-email"
												type="email"
												placeholder="Enter your email"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												required
												className={validationErrors.email ? "border-destructive" : ""}
											/>
											{validationErrors.email && (
												<p className="text-sm text-destructive">{validationErrors.email}</p>
											)}
										</div>
										<div className="space-y-2">
											<Label htmlFor="signup-phone">Phone Number *</Label>
											<div className="flex">
												<PhoneInput
													id="signup-phone"
													placeholder="Enter phone number"
													value={phone}
													onChange={(value) => {
														setPhone(value || "");
													}}
													defaultCountry="GB"
													required
													className="shadcn-phone-input w-full"
													inputComponent={Input}
												/>
											</div>
											{validationErrors.phone && (
												<p className="text-sm text-destructive">{validationErrors.phone}</p>
											)}
										</div>
										<div className="space-y-2">
											<Label htmlFor="signup-location">Location *</Label>
											<Input
												id="signup-location"
												type="text"
												placeholder="Enter your location"
												value={location}
												onChange={(e) => setLocation(e.target.value)}
												required
												className={validationErrors.location ? "border-destructive" : ""}
											/>
											{validationErrors.location && (
												<p className="text-sm text-destructive">{validationErrors.location}</p>
											)}
										</div>
										<div className="space-y-2">
											<Label htmlFor="signup-password">Password *</Label>
											<Input
												id="signup-password"
												type="password"
												placeholder="8+ chars, uppercase, lowercase, number, special char"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												required
												className={validationErrors.password ? "border-destructive" : ""}
											/>
											{validationErrors.password && (
												<p className="text-sm text-destructive">{validationErrors.password}</p>
											)}
											<p className="text-xs text-muted-foreground">
												Password must be at least 8 characters with uppercase,
												lowercase, number, and special character
											</p>
										</div>
										<div className="space-y-2">
											<Label htmlFor="signup-confirm-password">Confirm Password *</Label>
											<Input
												id="signup-confirm-password"
												type="password"
												placeholder="Confirm your password"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												required
												className={validationErrors.confirmPassword ? "border-destructive" : ""}
											/>
											{validationErrors.confirmPassword && (
												<p className="text-sm text-destructive">{validationErrors.confirmPassword}</p>
											)}
										</div>

										
										<Button
											type="submit"
											className="w-full"
											disabled={isLoading || isRateLimited}>
											{isLoading && (
												<Loader2 className="mr-2 h-4 w-4 animate-spin" />
											)}
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
							This app was created with the help of{" "}
							<a
								href="https://launchmd.ingenious.agency"
								className="text-primary hover:underline"
								target="_blank"
								rel="noopener noreferrer">
								LaunchMD
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};
