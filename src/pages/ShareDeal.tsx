import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { ChooseRewardType } from '@/components/share-deal/ChooseRewardType';
import { UploadRewardDetails } from '@/components/share-deal/UploadRewardDetails';
import { SetPriceAvailability } from '@/components/share-deal/SetPriceAvailability';
import { AddConditions } from '@/components/share-deal/AddConditions';
import { PreviewPublish } from '@/components/share-deal/PreviewPublish';
import { useAuthStore } from '@/store/authStore';
import { useEffect } from 'react';

export interface DealFormData {
  category: string;
  title: string;
  source: string;
  redemptionType: string;
  voucherFile?: File;
  expiryDate: Date | undefined;
  isLocationBound: boolean;
  locationDetails: string;
  isForSale: boolean;
  price: string;
  originalPrice: string;
  usageNotes: string;
  tags: string[];
}

export const ShareDeal = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<DealFormData>({
    category: '',
    title: '',
    source: '',
    redemptionType: '',
    expiryDate: undefined,
    isLocationBound: false,
    locationDetails: '',
    isForSale: false,
    price: '',
    originalPrice: '',
    usageNotes: '',
    tags: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const nextStep = () => {
    if (currentStep === 2 && !formData.isForSale) {
      setCurrentStep(4); // Skip price setting if it's a gift
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && !formData.isForSale) {
      setCurrentStep(2); // Skip price setting if it's a gift
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const updateFormData = (data: Partial<DealFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
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
              // Handle publish logic
              navigate('/deals');
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step}
                </div>
                {step < 5 && (
                  <div
                    className={`h-1 w-16 mx-2 ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Step {currentStep} of 5
            </p>
          </div>
        </div>

        {/* Current step content */}
        {renderStep()}
      </div>
    </div>
  );
};