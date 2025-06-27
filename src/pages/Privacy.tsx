import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Privacy = () => {
	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-4xl mx-auto px-4 py-8">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
					<p className="text-muted-foreground">Last updated: December 2024</p>
				</div>

				<div className="space-y-6">
					<Card>
						<CardHeader>
							<CardTitle>Information We Collect</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-muted-foreground space-y-2">
								<p>
									We collect information you provide directly to us, such as
									when you:
								</p>
								<ul className="list-disc list-inside space-y-1">
									<li>Create an account</li>
									<li>Make a purchase or transaction</li>
									<li>Contact us for support</li>
									<li>Subscribe to our newsletter</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>How We Use Your Information</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-muted-foreground space-y-2">
								<p>We use the information we collect to:</p>
								<ul className="list-disc list-inside space-y-1">
									<li>Provide, maintain, and improve our services</li>
									<li>Process transactions and send related information</li>
									<li>Send technical notices and support messages</li>
									<li>
										Communicate with you about products, services, and events
									</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Information Sharing</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								We do not sell, trade, or rent your personal information to
								third parties. We may share your information in certain limited
								circumstances, such as with your consent or to comply with legal
								obligations.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Data Security</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								We implement appropriate technical and organizational measures
								to protect your personal information against unauthorized
								access, alteration, disclosure, or destruction.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Your Rights</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-muted-foreground space-y-2">
								<p>You have the right to:</p>
								<ul className="list-disc list-inside space-y-1">
									<li>Access your personal information</li>
									<li>Correct inaccurate information</li>
									<li>Delete your personal information</li>
									<li>Object to processing of your information</li>
								</ul>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Contact Us</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">
								If you have any questions about this Privacy Policy, please
								contact us at privacy@splitclub.com
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
