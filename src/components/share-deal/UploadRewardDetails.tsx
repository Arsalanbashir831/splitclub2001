import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { DealFormData } from '@/pages/ShareDeal';
import { ImageUpload } from '@/components/ImageUpload';
import { storageService } from '@/services/storageService';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';

const categoryTitles = {
  cinema: 'Cinema Ticket',
  gym: 'Gym Guest Pass',
  restaurant: 'Restaurant Voucher',
  vouchers: 'Gift Voucher',
  discounts: 'Discount Code',
  subscriptions: 'Subscription Discount'
};

const sources = [
  'Vitality', 'Amex', 'Tesco', 'Nando\'s', 'Amazon', 'Deliveroo', 'Rakuten', 'Other'
];

const redemptionTypes = [
  { value: 'voucher_code', label: 'Voucher Code' },
  { value: 'barcode', label: 'Barcode' },
  { value: 'pdf', label: 'PDF' },
  { value: 'qr', label: 'QR Code' }
];

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
  const [dealImage, setDealImage] = useState<File | undefined>();
  const [voucherFile, setVoucherFile] = useState<File | undefined>();
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingVoucher, setIsUploadingVoucher] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handleImageSelected = async (file: File) => {
    if (!user) return;
    
    setIsUploadingImage(true);
    setDealImage(file);
    
    try {
      const result = await storageService.uploadDealImage(file, user.id);
      if (result) {
        onUpdateFormData({ 
          dealImage: file,
          dealImageUrl: result.url
        });
        toast({
          title: "Success",
          description: "Deal image uploaded successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to upload deal image",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload deal image",
        variant: "destructive",
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleImageRemoved = () => {
    setDealImage(undefined);
    onUpdateFormData({ 
      dealImage: undefined,
      dealImageUrl: undefined 
    });
  };

  const handleVoucherFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploadingVoucher(true);
    setVoucherFile(file);

    try {
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
      } else {
        toast({
          title: "Error",
          description: "Failed to upload voucher file",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error uploading voucher:', error);
      toast({
        title: "Error",
        description: "Failed to upload voucher file",
        variant: "destructive",
      });
    } finally {
      setIsUploadingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucherFile(undefined);
    onUpdateFormData({ 
      voucherFile: undefined,
      voucherFileUrl: undefined 
    });
  };

  const isFormValid = formData.title && formData.source && formData.redemptionType && formData.expiryDate;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tell us about the reward
        </h1>
        <p className="text-muted-foreground">
          Provide the details so others can understand what you're sharing
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => onUpdateFormData({ title: e.target.value })}
              placeholder={categoryTitles[formData.category as keyof typeof categoryTitles] || 'Enter title'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={formData.source} onValueChange={(value) => onUpdateFormData({ source: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((source) => (
                    <SelectItem key={source} value={source.toLowerCase()}>
                      {source}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Redeemed As</Label>
              <Select value={formData.redemptionType} onValueChange={(value) => onUpdateFormData({ redemptionType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="How is it redeemed?" />
                </SelectTrigger>
                <SelectContent>
                  {redemptionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Deal Image (Optional)</Label>
            <ImageUpload
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              selectedImage={dealImage}
              preview={formData.dealImageUrl}
            />
            {isUploadingImage && (
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload Voucher</Label>
            {formData.voucherFile || formData.voucherFileUrl ? (
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Upload className="h-8 w-8 text-green-600" />
                    <div className="text-left">
                      <p className="text-sm font-medium">
                        {formData.voucherFile?.name || 'Voucher file uploaded'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        File uploaded successfully
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveVoucher}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                  "border-muted-foreground/25 hover:border-primary hover:bg-primary/5"
                )}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Drop your voucher file here
                  </p>
                  <p className="text-xs text-muted-foreground">
                    or click to browse (PNG, JPG, PDF)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleVoucherFileChange}
                  id="file-upload"
                  disabled={isUploadingVoucher}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploadingVoucher}
                >
                  {isUploadingVoucher ? 'Uploading...' : 'Browse Files'}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Expiry Date</Label>
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
                  {formData.expiryDate ? format(formData.expiryDate, "PPP") : "Pick expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.expiryDate}
                  onSelect={(date) => onUpdateFormData({ expiryDate: date })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Location Bound</Label>
                <p className="text-sm text-muted-foreground">
                  Is this reward tied to a specific location?
                </p>
              </div>
              <Switch
                checked={formData.isLocationBound}
                onCheckedChange={(checked) => onUpdateFormData({ isLocationBound: checked })}
              />
            </div>

            {formData.isLocationBound && (
              <div className="space-y-2">
                <Label htmlFor="location">Location Details</Label>
                <Input
                  id="location"
                  value={formData.locationDetails}
                  onChange={(e) => onUpdateFormData({ locationDetails: e.target.value })}
                  placeholder="e.g., Specific gym branch, cinema location"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Gift or Sell</Label>
                <p className="text-sm text-muted-foreground">
                  Are you giving this away or selling it?
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={cn("text-sm", !formData.isForSale && "font-medium")}>Gift</span>
                <Switch
                  checked={formData.isForSale}
                  onCheckedChange={(checked) => onUpdateFormData({ isForSale: checked })}
                />
                <span className={cn("text-sm", formData.isForSale && "font-medium")}>Sell</span>
              </div>
            </div>
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
