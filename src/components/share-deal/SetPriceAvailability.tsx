import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DealFormData } from '@/pages/ShareDeal';
import { AlertTriangle } from 'lucide-react';

const suggestedPrices = {
  cinema: { min: 5, max: 15, suggested: 8 },
  gym: { min: 3, max: 12, suggested: 6 },
  restaurant: { min: 5, max: 25, suggested: 12 },
  vouchers: { min: 2, max: 50, suggested: 15 },
  discounts: { min: 1, max: 20, suggested: 5 },
  subscriptions: { min: 2, max: 30, suggested: 10 }
};

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
  onPrev
}: SetPriceAvailabilityProps) => {
  const [platformFee, setPlatformFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  const categoryPricing = suggestedPrices[formData.category as keyof typeof suggestedPrices] || suggestedPrices.vouchers;

  useEffect(() => {
    // Set suggested price if not already set
    if (!formData.price) {
      onUpdateFormData({ 
        price: categoryPricing.suggested.toString(),
        originalPrice: (categoryPricing.suggested * 1.5).toString()
      });
    }
  }, []);

  useEffect(() => {
    const price = parseFloat(formData.price) || 0;
    const fee = price * 0.1; // 10% commission
    setPlatformFee(fee);
    setNetAmount(price - fee);
  }, [formData.price]);

  const isFormValid = formData.price && parseFloat(formData.price) > 0 && formData.originalPrice && parseFloat(formData.originalPrice) > 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Set Your Price
        </h1>
        <p className="text-muted-foreground">
          Price your reward competitively to attract buyers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pricing Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => onUpdateFormData({ originalPrice: e.target.value })}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                What did this originally cost?
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Your Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => onUpdateFormData({ price: e.target.value })}
                  className="pl-8"
                  placeholder="0.00"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Suggested: £{categoryPricing.min} - £{categoryPricing.max}
              </p>
            </div>
          </div>

          {formData.price && parseFloat(formData.price) > 0 && (
            <div className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Your price:</span>
                  <span>£{parseFloat(formData.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Platform fee (10%):</span>
                  <span>-£{platformFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-medium">
                    <span>You receive:</span>
                    <span className="text-primary">£{netAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Platform Fee:</strong> SplitClub takes a 10% commission on all sold rewards to maintain the platform and ensure security.
            </AlertDescription>
          </Alert>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Pricing Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Price below the original value to attract buyers</li>
              <li>• Consider the expiry date when setting your price</li>
              <li>• Check similar items on the platform for competitive pricing</li>
              <li>• Factor in any usage restrictions</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isFormValid}>
          Continue
        </Button>
      </div>
    </div>
  );
};