import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DollarSign, Gift, Users } from "lucide-react";
import { DealFormData } from "@/pages/ShareDeal";

interface SetPriceAvailabilityProps {
	formData: DealFormData;
	onUpdateFormData: (data: Partial<DealFormData>) => void;
	onNext: () => void;
	onPrev: () => void;
}

export const SetPriceAvailability = ({
	formData,
	onUpdateFormData,
	onNext,
	onPrev,
}: SetPriceAvailabilityProps) => {
	const [errors, setErrors] = useState<Record<string, string>>({});

	const validateForm = () => {
		const newErrors: Record<string, string> = {};

		if (formData.isForSale) {
			if (!formData.price || parseFloat(formData.price) <= 0) {
				newErrors.price = "Please enter a valid price";
			}
		}

		if (!formData.maxClaims || formData.maxClaims < 1) {
			newErrors.maxClaims = "Please enter a valid number of available slots";
		}

		if (formData.originalPrice && parseFloat(formData.originalPrice) <= 0) {
			newErrors.originalPrice = "Please enter a valid original price";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validateForm()) {
			onNext();
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h1 className="text-3xl font-bold text-foreground mb-2">
					Set Price & Availability
				</h1>
				<p className="text-muted-foreground">
					Configure how many people can claim your deal and pricing
				</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Users className="h-5 w-5" />
						Availability Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor="maxClaims">
							How many people can claim this deal?
						</Label>
						<Input
							id="maxClaims"
							type="number"
							min="1"
							max="100"
							value={formData.maxClaims || ""}
							onChange={(e) =>
								onUpdateFormData({ maxClaims: parseInt(e.target.value) || 1 })
							}
							placeholder="e.g., 5"
						/>
						{errors.maxClaims && (
							<p className="text-sm text-destructive">{errors.maxClaims}</p>
						)}
						<p className="text-sm text-muted-foreground">
							Set how many users can claim your deal. This helps control sharing
							and ensures fair access.
						</p>
					</div>

					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="space-y-1">
								<Label htmlFor="isForSale">Selling this deal?</Label>
								<p className="text-sm text-muted-foreground">
									Toggle on if you want to sell access to this deal
								</p>
							</div>
							<Switch
								id="isForSale"
								checked={formData.isForSale}
								onCheckedChange={(checked) =>
									onUpdateFormData({ isForSale: checked })
								}
							/>
						</div>

						{formData.isForSale ? (
							<div className="space-y-4 border-l-4 border-primary pl-4">
								<div className="flex items-center gap-2 text-primary">
									<DollarSign className="h-4 w-4" />
									<span className="font-medium">Selling Configuration</span>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label htmlFor="price">Your Price *</Label>
										<Input
											id="price"
											type="number"
											step="0.01"
											min="0"
											value={formData.price}
											onChange={(e) =>
												onUpdateFormData({ price: e.target.value })
											}
											placeholder="0.00"
										/>
										{errors.price && (
											<p className="text-sm text-destructive">{errors.price}</p>
										)}
									</div>

									<div className="space-y-2">
										<Label htmlFor="originalPrice">
											Original Price (optional)
										</Label>
										<Input
											id="originalPrice"
											type="number"
											step="0.01"
											min="0"
											value={formData.originalPrice}
											onChange={(e) =>
												onUpdateFormData({ originalPrice: e.target.value })
											}
											placeholder="0.00"
										/>
										{errors.originalPrice && (
											<p className="text-sm text-destructive">
												{errors.originalPrice}
											</p>
										)}
										<p className="text-sm text-muted-foreground">
											Show the original price to highlight savings
										</p>
									</div>
								</div>

								{formData.price && parseFloat(formData.price) > 0 && (
									<div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4">
										<h4 className="font-medium text-foreground mb-2">
											Pricing Breakdown
										</h4>
										<div className="space-y-2 text-sm">
											<div className="flex justify-between">
												<span>Your price:</span>
												<span>£{parseFloat(formData.price).toFixed(2)}</span>
											</div>
											<div className="flex justify-between text-muted-foreground">
												<span>Platform fee (10%):</span>
												<span>
													£{(parseFloat(formData.price) * 0.1).toFixed(2)}
												</span>
											</div>
											<div className="border-t pt-2 flex justify-between font-medium">
												<span>You'll receive:</span>
												<span className="text-primary">
													£{(parseFloat(formData.price) * 0.9).toFixed(2)}
												</span>
											</div>
										</div>
									</div>
								)}
							</div>
						) : (
							<div className="space-y-4 border-l-4 border-green-500 pl-4">
								<div className="flex items-center gap-2 text-green-600">
									<Gift className="h-4 w-4" />
									<span className="font-medium">Free Gift</span>
								</div>
								<p className="text-sm text-muted-foreground">
									You're sharing this deal for free with the community. How
									generous! 🎉
								</p>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			<div className="flex justify-between">
				<Button variant="outline" onClick={onPrev}>
					Back
				</Button>
				<Button onClick={handleNext}>Continue</Button>
			</div>
		</div>
	);
};
