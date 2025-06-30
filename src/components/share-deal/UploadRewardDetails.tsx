import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "../ImageUpload";
import {
	ArrowLeft,
	ArrowRight,
	Upload,
	Gift,
	DollarSign,
	CalendarIcon,
} from "lucide-react";
import { DealFormData } from "../../pages/ShareDeal";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { validateVoucherFile } from "@/utils/validation";
import { useToast } from "@/hooks/use-toast";

interface UploadRewardDetailsProps {
	formData: DealFormData;
	onUpdateFormData: (data: Partial<DealFormData>) => void;
	onNext: () => void;
	onPrev: () => void;
}

export const UploadRewardDetails = ({
	formData,
	onUpdateFormData,
	onNext,
	onPrev,
}: UploadRewardDetailsProps) => {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const { toast } = useToast();
	const voucherInputRef = useRef<HTMLInputElement>(null);

	const handleImageSelected = (file: File) => {
		onUpdateFormData({ dealImage: file });
		const reader = new FileReader();
		reader.onload = (e) => {
			setImagePreview(e.target?.result as string);
		};
		reader.readAsDataURL(file);
	};

	const handleImageRemoved = () => {
		onUpdateFormData({ dealImage: undefined });
		setImagePreview(null);
	};

	const handleVoucherUpload = (file: File) => {
		const validation = validateVoucherFile(file);
		if (!validation.isValid) {
			toast({
				title: "Invalid file",
				description: validation.error,
				variant: "destructive",
			});
			// Reset input value to allow selecting the same file again
			if (voucherInputRef.current) {
				voucherInputRef.current.value = '';
			}
			return;
		}
		onUpdateFormData({ voucherFile: file });
	};

	const canProceed =
		formData.title && formData.source && formData.sharingMethod;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Step 2: Add Deal Details</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Gift or Sell Toggle */}
				<div className="space-y-4">
					<Label className="text-base font-medium">Deal Type</Label>
					<div className="flex items-center space-x-4 p-4 border rounded-lg">
						<div className="flex items-center space-x-2">
							<Gift className="h-5 w-5 text-green-600" />
							<span
								className={
									!formData.isForSale
										? "font-medium text-green-600"
										: "text-muted-foreground"
								}>
								Gift (Free)
							</span>
						</div>
						<Switch
							checked={formData.isForSale}
							onCheckedChange={(checked) =>
								onUpdateFormData({ isForSale: checked })
							}
						/>
						<div className="flex items-center space-x-2">
							<DollarSign className="h-5 w-5 text-blue-600" />
							<span
								className={
									formData.isForSale
										? "font-medium text-blue-600"
										: "text-muted-foreground"
								}>
								Sell
							</span>
						</div>
					</div>
				</div>

				{/* Conditional Price Input for Sell */}
				{formData.isForSale && (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
						<div>
							<Label htmlFor="price">Selling Price *</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
									£
								</span>
								<Input
									id="price"
									type="number"
									step="0.01"
									min="0"
									placeholder="0.00"
									value={formData.price}
									onChange={(e) => onUpdateFormData({ price: e.target.value })}
									className="pl-8"
								/>
							</div>
						</div>
						<div>
							<Label htmlFor="originalPrice">Original Price (Optional)</Label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
									£
								</span>
								<Input
									id="originalPrice"
									type="number"
									step="0.01"
									min="0"
									placeholder="0.00"
									value={formData.originalPrice}
									onChange={(e) =>
										onUpdateFormData({ originalPrice: e.target.value })
									}
									className="pl-8"
								/>
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Show savings to attract more buyers
							</p>
						</div>
					</div>
				)}

				<div>
					<Label htmlFor="title">Deal Title *</Label>
					<Input
						id="title"
						placeholder="e.g., Netflix Premium Subscription Spot"
						value={formData.title}
						onChange={(e) => onUpdateFormData({ title: e.target.value })}
					/>
				</div>

				<div>
					<Label htmlFor="source">Source/Provider *</Label>
					<Input
						id="source"
						placeholder="e.g., Netflix, Spotify, Amazon Prime"
						value={formData.source}
						onChange={(e) => onUpdateFormData({ source: e.target.value })}
					/>
				</div>

				<div>
					<Label htmlFor="sharingMethod">How to Share Access *</Label>
					<Select
						value={formData.sharingMethod}
						onValueChange={(value) =>
							onUpdateFormData({ sharingMethod: value })
						}>
						<SelectTrigger>
							<SelectValue placeholder="Select sharing method" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="login">Share login credentials</SelectItem>
							<SelectItem value="invite">Send invite link</SelectItem>
							<SelectItem value="voucher">Provide voucher code</SelectItem>
							<SelectItem value="other">Other method</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label htmlFor="expiryDate">Expiry Date *</Label>
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-full justify-start text-left font-normal",
									!formData.expiryDate && "text-muted-foreground"
								)}>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{formData.expiryDate ? (
									format(formData.expiryDate, "PPP")
								) : (
									<span>Pick a date</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								selected={formData.expiryDate}
								onSelect={(date) => onUpdateFormData({ expiryDate: date })}
								initialFocus
								disabled={(date) =>
									date < new Date(new Date().setDate(new Date().getDate() - 1))
								} // Disable past dates
							/>
						</PopoverContent>
					</Popover>
				</div>

				<div>
					<Label>Deal Image</Label>
					<ImageUpload
						onImageSelected={handleImageSelected}
						onImageRemoved={handleImageRemoved}
						selectedImage={formData.dealImage}
						preview={imagePreview}
						className="w-full h-48"
					/>
				</div>

				<div>
					<Label>Voucher/Access Details</Label>
					<div className="border-2 border-dashed border-border rounded-lg p-6">
						<div className="text-center">
							<Upload className="mx-auto h-12 w-12 text-muted-foreground" />
							<div className="mt-4">
								<Label htmlFor="voucher-upload" className="cursor-pointer">
									<span className="mt-2 block text-sm font-medium text-foreground">
										Upload screenshot or document
									</span>
									<span className="mt-1 block text-xs text-muted-foreground">
										PNG, JPG, PDF up to 5MB
									</span>
								</Label>
								<Input
									id="voucher-upload"
									type="file"
									accept="image/*,.pdf"
									onChange={(e) => {
										const file = e.target.files?.[0];
										if (file) {
											handleVoucherUpload(file);
											// Reset input value to allow selecting the same file again
											if (e.target) {
												e.target.value = '';
											}
										}
									}}
									className="hidden"
									ref={voucherInputRef}
								/>
							</div>
						</div>
						{formData.voucherFile && (
							<p className="mt-2 text-sm text-green-600 text-center">
								✓ {formData.voucherFile.name} uploaded
							</p>
						)}
					</div>
				</div>

				<div className="flex justify-between">
					<Button variant="outline" onClick={onPrev}>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Previous
					</Button>
					<Button onClick={onNext} disabled={!canProceed}>
						Next
						<ArrowRight className="h-4 w-4 ml-2" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};
