
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, CalendarIcon, FileText, Image, DollarSign, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DealFormData } from '@/pages/ShareDeal';
import { storageService } from '@/services/storageService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

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
  onPrev
}: UploadRewardDetailsProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.source.trim()) {
      newErrors.source = 'Source is required';
    }

    if (!formData.redemptionType) {
      newErrors.redemptionType = 'Redemption type is required';
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }

    if (formData.isForSale && (!formData.price || parseFloat(formData.price) <= 0)) {
      newErrors.price = 'Please enter a valid price for selling';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      onNext();
    }
  };

  const handleFileUpload = async (file: File, type: 'image' | 'voucher') => {
    if (!user) return;

    setIsUploading(true);
    try {
      if (type === 'image') {
        const result = await storageService.uploadDealImage(file, user.id);
        if (result) {
          onUpdateFormData({ 
            dealImage: file, 
            dealImageUrl: result.url,
            imageFileName: result.fileName 
          });
          toast({
            title: "Success",
            description: "Deal image uploaded successfully",
          });
        }
      } else {
        const result = await storageService.uploadVoucherFile(file, user.id);
        if (result) {
          onUpdateFormData({ 
            voucherFile: file, 
            voucherFileUrl: result.url 
          });
          toast({
            title: "Success",
            description: "Voucher file uploaded successfully",
          });
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Deal Details
        </h1>
        <p className="text-muted-foreground">
          Add details and files for your deal
        </p>
      </div>

      <div className="grid gap-6">
        {/* Basic Details */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => onUpdateFormData({ title: e.target.value })}
                placeholder="e.g., Netflix Premium Subscription"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source *</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => onUpdateFormData({ source: e.target.value })}
                placeholder="e.g., Netflix, Amazon, Local Restaurant"
              />
              {errors.source && (
                <p className="text-sm text-destructive">{errors.source}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="redemptionType">How is this redeemed? *</Label>
              <Select
                value={formData.redemptionType}
                onValueChange={(value) => onUpdateFormData({ redemptionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select redemption method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voucher_code">Voucher Code</SelectItem>
                  <SelectItem value="barcode">Barcode</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="qr">QR Code</SelectItem>
                </SelectContent>
              </Select>
              {errors.redemptionType && (
                <p className="text-sm text-destructive">{errors.redemptionType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Expiry Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.expiryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expiryDate ? (
                      format(formData.expiryDate, "PPP")
                    ) : (
                      <span>Pick expiry date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => onUpdateFormData({ expiryDate: date })}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.expiryDate && (
                <p className="text-sm text-destructive">{errors.expiryDate}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gift or Sell Toggle */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="isForSale">Are you selling this deal?</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle on to sell this deal, or keep it off to share as a gift
                </p>
              </div>
              <Switch
                id="isForSale"
                checked={formData.isForSale}
                onCheckedChange={(checked) => onUpdateFormData({ isForSale: checked })}
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
                      onChange={(e) => onUpdateFormData({ price: e.target.value })}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="text-sm text-destructive">{errors.price}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="originalPrice">Original Price (optional)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => onUpdateFormData({ originalPrice: e.target.value })}
                      placeholder="0.00"
                    />
                    <p className="text-sm text-muted-foreground">
                      Show the original price to highlight savings
                    </p>
                  </div>
                </div>

                {formData.price && parseFloat(formData.price) > 0 && (
                  <div className="bg-muted/50 border border-muted-foreground/20 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2">Pricing Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Your price:</span>
                        <span>£{parseFloat(formData.price).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-muted-foreground">
                        <span>Platform fee (10%):</span>
                        <span>£{(parseFloat(formData.price) * 0.1).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>You'll receive:</span>
                        <span className="text-primary">£{(parseFloat(formData.price) * 0.9).toFixed(2)}</span>
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
                  You're sharing this deal for free with the community. How generous! 🎉
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* File Uploads */}
        <Card>
          <CardHeader>
            <CardTitle>Files & Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Deal Image Upload */}
            <div className="space-y-2">
              <Label>Deal Image (optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-2">
                    <label htmlFor="deal-image" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-foreground">
                        Upload deal image
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        PNG, JPG up to 10MB
                      </span>
                    </label>
                    <input
                      id="deal-image"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'image');
                      }}
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>
              {formData.dealImageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.dealImageUrl}
                    alt="Deal preview"
                    className="max-w-full h-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Voucher Upload */}
            <div className="space-y-2">
              <Label>Voucher File (optional)</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-2">
                    <label htmlFor="voucher-file" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-foreground">
                        Upload voucher file
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">
                        PDF, image, or document up to 10MB
                      </span>
                    </label>
                    <input
                      id="voucher-file"
                      type="file"
                      className="hidden"
                      accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'voucher');
                      }}
                      disabled={isUploading}
                    />
                  </div>
                </div>
              </div>
              {formData.voucherFileUrl && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    ✓ Voucher file uploaded
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
