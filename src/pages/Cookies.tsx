import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Cookies = () => {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-4">
						Cookies and Consent Statement
					</h1>
					<p className="text-muted-foreground">
						Learn about how we use cookies and manage your preferences
					</p>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>What are Cookies?</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								Cookies are small text files that are placed on your computer or
								mobile device when you visit our website. They help us provide
								you with a better experience by remembering your preferences and
								understanding how you use our site.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Types of Cookies We Use</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<div>
										<Label htmlFor="essential" className="font-semibold">
											Essential Cookies
										</Label>
										<p className="text-sm text-muted-foreground">
											Required for the website to function properly
										</p>
									</div>
									<Switch id="essential" checked disabled />
								</div>

								<div className="flex items-center justify-between">
									<div>
										<Label htmlFor="analytics" className="font-semibold">
											Analytics Cookies
										</Label>
										<p className="text-sm text-muted-foreground">
											Help us understand how visitors interact with our website
										</p>
									</div>
									<Switch id="analytics" />
								</div>

								<div className="flex items-center justify-between">
									<div>
										<Label htmlFor="marketing" className="font-semibold">
											Marketing Cookies
										</Label>
										<p className="text-sm text-muted-foreground">
											Used to deliver personalized ads and content
										</p>
									</div>
									<Switch id="marketing" />
								</div>

								<div className="flex items-center justify-between">
									<div>
										<Label htmlFor="preferences" className="font-semibold">
											Preference Cookies
										</Label>
										<p className="text-sm text-muted-foreground">
											Remember your settings and preferences
										</p>
									</div>
									<Switch id="preferences" />
								</div>
							</div>

							<div className="mt-6 space-x-4">
								<Button>Save Preferences</Button>
								<Button variant="outline">Accept All</Button>
								<Button variant="outline">Reject All</Button>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Managing Cookies</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								You can control and/or delete cookies as you wish. You can
								delete all cookies that are already on your computer and you can
								set most browsers to prevent them from being placed. However, if
								you do this, you may have to manually adjust some preferences
								every time you visit a site.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Third-Party Cookies</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								We may also use third-party services such as Google Analytics
								that collect, monitor and analyze user behavior. These services
								have their own privacy policies and cookie policies.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Contact Us</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								If you have any questions about our use of cookies, please
								contact us at privacy@splitclub.com
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
