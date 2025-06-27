import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChooseRewardType } from "../components/share-deal/ChooseRewardType";
import { UploadRewardDetails } from "../components/share-deal/UploadRewardDetails";
import { SetPriceAvailability } from "../components/share-deal/SetPriceAvailability";
import { AddConditions } from "../components/share-deal/AddConditions";
import { PreviewPublish } from "../components/share-deal/PreviewPublish";
import { useAuthStore } from "../store/authStore";

export interface DealFormData {
	category: string;
	title: string;
	source: string;
	sharingMethod: string;
	voucherFile?: File;
	voucherFileUrl?: string;
	dealImage?: File;
	dealImageUrl?: string;
	expiryDate: Date | undefined;
	isLocationBound: boolean;
	locationDetails: string;
	isForSale: boolean;
	price: string;
	originalPrice: string;
	usageNotes: string;
	tags: string[];
	maxClaims: number;
}

export const ShareDeal = () => {
	const { isAuthenticated } = useAuthStore();
	const navigate = useNavigate();
	const [currentStep, setCurrentStep] = useState(1);
	const [formData, setFormData] = useState<DealFormData>({
		category: "",
		title: "",
		source: "",
		sharingMethod: "",
		expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)),
		isLocationBound: false,
		locationDetails: "",
		isForSale: false,
		price: "",
		originalPrice: "",
		usageNotes: "",
		tags: [],
		maxClaims: 5,
	});

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
		}
	}, [isAuthenticated, navigate]);

	const nextStep = () => {
		if (currentStep === 2 && !formData.isForSale) {
			setCurrentStep(4); // Skip price setting if it's a gift
		} else {
			setCurrentStep((prev) => Math.min(prev + 1, 5));
		}
	};

	const prevStep = () => {
		if (currentStep === 4 && !formData.isForSale) {
			setCurrentStep(2); // Skip price setting if it's a gift
		} else {
			setCurrentStep((prev) => Math.max(prev - 1, 1));
		}
	};

	const updateFormData = (data: Partial<DealFormData>) => {
		setFormData((prev) => ({ ...prev, ...data }));
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<ChooseRewardType
						selectedCategory={formData.category}
						onCategorySelect={(category) => updateFormData({ category })}
						onNext={nextStep}
					/>
				);
			case 2:
				return (
					<UploadRewardDetails
						formData={formData}
						onUpdateFormData={updateFormData}
						onNext={nextStep}
						onPrev={prevStep}
					/>
				);
			case 3:
				return (
					<SetPriceAvailability
						formData={formData}
						onUpdateFormData={updateFormData}
						onNext={nextStep}
						onPrev={prevStep}
					/>
				);
			case 4:
				return (
					<AddConditions
						formData={formData}
						onUpdateFormData={updateFormData}
						onNext={nextStep}
						onPrev={prevStep}
					/>
				);
			case 5:
				return (
					<PreviewPublish
						formData={formData}
						onPrev={prevStep}
						onPublish={() => {
							navigate("/deals");
						}}
					/>
				);
			default:
				return null;
		}
	};

	if (!isAuthenticated) {
		return null;
	}

	const getStepNumbers = () => {
		if (!formData.isForSale) {
			// When it's a gift, step 3 (price setting) is skipped
			return currentStep <= 2
				? currentStep
				: currentStep === 4
				? 3
				: currentStep === 5
				? 4
				: currentStep;
		}
		return currentStep;
	};

	const getTotalSteps = () => {
		return formData.isForSale ? 5 : 4;
	};

	return (
		<div className="min-h-screen bg-background">
			<div className="max-w-4xl mx-auto px-4 py-8">
				{/* Progress indicator */}
				<div className="mb-8">
					<div className="flex items-center justify-between">
						{Array.from({ length: getTotalSteps() }, (_, i) => i + 1).map(
							(step) => (
								<div key={step} className="flex items-center">
									<div
										className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
											step <= getStepNumbers()
												? "bg-primary text-primary-foreground"
												: "bg-muted text-muted-foreground"
										}`}>
										{step}
									</div>
									{step < getTotalSteps() && (
										<div
											className={`h-1 w-16 mx-2 ${
												step < getStepNumbers() ? "bg-primary" : "bg-muted"
											}`}
										/>
									)}
								</div>
							)
						)}
					</div>
					<div className="mt-4 text-center">
						<p className="text-sm text-muted-foreground">
							Step {getStepNumbers()} of {getTotalSteps()}
						</p>
					</div>
				</div>

				{/* Current step content */}
				{renderStep()}
			</div>
		</div>
	);
};

export default ShareDeal;
