import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ImageUpload';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Deal } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EditDealModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDeal: Deal) => void;
}

type DealCategory = Deal['category'];

export const EditDealModal = ({ deal, isOpen, onClose, onSave }: EditDealModalProps) => {
  const [formData, setFormData] = useState({
    title: deal.title,
    category: deal.category as DealCategory,
    source: deal.source || '',
    sharingMethod: deal.sharingMethod || '',
    originalPrice: deal.originalPrice.toString(),
    sharePrice: deal.sharePrice.toString(),
    isForSale: deal.isForSale,
    usageNotes: deal.usageNotes || '',
    locationDetails: deal.locationDetails || '',
    isLocationBound: deal.isLocationBound || false,
    maxClaims: deal.totalSlots,
    expiryDate: deal.expiryDate ? new Date(deal.expiryDate) : undefined,
    tags: deal.tags || [],
    voucherData: deal.voucherData || ''
  });
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>(deal.imageUrl);
  const [selectedVoucherFile, setSelectedVoucherFile] = useState<File | undefined>();
  const [voucherFileUrl, setVoucherFileUrl] = useState<string | undefined>(deal.voucherFileUrl);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      title: deal.title,
      category: deal.category as DealCategory,
      source: deal.source || '',
      sharingMethod: deal.sharingMethod || '',
      originalPrice: deal.originalPrice.toString(),
      sharePrice: deal.sharePrice.toString(),
      isForSale: deal.isForSale,
      usageNotes: deal.usageNotes || '',
      locationDetails: deal.locationDetails || '',
      isLocationBound: deal.isLocationBound || false,
      maxClaims: deal.totalSlots,
      expiryDate: deal.expiryDate ? new Date(deal.expiryDate) : undefined,
      tags: deal.tags || [],
      voucherData: deal.voucherData || ''
    });
    setImagePreview(deal.imageUrl);
    setVoucherFileUrl(deal.voucherFileUrl);
    setSelectedImage(undefined);
    setSelectedVoucherFile(undefined);
  }, [deal]);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemoved = () => {
    setSelectedImage(undefined);
    setImagePreview(undefined);
  };

  const handleVoucherUpload = (file: File) => {
    setSelectedVoucherFile(file);
  };

  const handleVoucherRemoved = () => {
    setSelectedVoucherFile(undefined);
    setVoucherFileUrl(undefined);
  };

  const handleVoucherReplaced = (file: File) => {
    setSelectedVoucherFile(file);
    setVoucherFileUrl(undefined);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${deal.sharedBy.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('deal-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('deal-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const uploadVoucherFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${deal.sharedBy.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('voucher-files')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading voucher file:', uploadError);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('voucher-files')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Prepare the update data for the service
      const updateData = {
        title: formData.title,
        category: formData.category,
        source: formData.source,
        sharingMethod: formData.sharingMethod,
        originalPrice: Number(formData.originalPrice),
        sharePrice: formData.isForSale ? Number(formData.sharePrice) : 0,
        isForSale: formData.isForSale,
        isFree: !formData.isForSale,
        usageNotes: formData.usageNotes,
        locationDetails: formData.locationDetails,
        isLocationBound: formData.isLocationBound,
        maxClaims: formData.maxClaims,
        expiryDate: formData.expiryDate?.toISOString() || deal.expiryDate,
        tags: formData.tags,
        voucherData: formData.sharingMethod === 'voucher' ? formData.voucherData : null,
        selectedImage: selectedImage || undefined,
        selectedVoucherFile: selectedVoucherFile || undefined,
        imageRemoved: !imagePreview && !selectedImage,
        voucherRemoved: !selectedVoucherFile && !voucherFileUrl
      };

      // Call the onSave callback with the update data
      onSave(updateData as any);
    } catch (error) {
      console.error('Error preparing deal update:', error);
      toast({
        title: "Error updating deal",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Deal Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Netflix Premium Subscription Spot"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source/Provider *</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Netflix, Spotify, Amazon Prime"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value: DealCategory) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="membership">Membership</SelectItem>
                  <SelectItem value="vouchers">Vouchers</SelectItem>
                  <SelectItem value="discounts">Discounts</SelectItem>
                  <SelectItem value="cinema">Cinema</SelectItem>
                  <SelectItem value="gym">Gym</SelectItem>
                  <SelectItem value="restaurant">Restaurant</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sharingMethod">How to Share Access *</Label>
              <Select
                value={formData.sharingMethod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, sharingMethod: value }))}
              >
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
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isForSale"
              checked={formData.isForSale}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isForSale: checked }))}
            />
            <Label htmlFor="isForSale">This deal is for sale</Label>
          </div>

          {formData.isForSale && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <div>
                <Label htmlFor="sharePrice">Selling Price *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    £
                  </span>
                  <Input
                    id="sharePrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.sharePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, sharePrice: e.target.value }))}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                    className="pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Show savings to attract more buyers
                </p>
              </div>
            </div>
          )}

          {/* Availability and Expiry */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxClaims">Max Claims</Label>
              <Input
                id="maxClaims"
                type="number"
                min="1"
                value={formData.maxClaims}
                onChange={(e) => setFormData(prev => ({ ...prev, maxClaims: parseInt(e.target.value) }))}
                placeholder="How many people can claim this deal"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
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
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expiryDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, expiryDate: date }))}
                    initialFocus
                    disabled={(date) =>
                      date < new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isLocationBound"
              checked={formData.isLocationBound}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isLocationBound: checked }))}
            />
            <Label htmlFor="isLocationBound">Location specific</Label>
          </div>

          {formData.isLocationBound && (
            <div className="space-y-2">
              <Label htmlFor="locationDetails">Location Details</Label>
              <Input
                id="locationDetails"
                value={formData.locationDetails}
                onChange={(e) => setFormData(prev => ({ ...prev, locationDetails: e.target.value }))}
                placeholder="Enter location details"
              />
            </div>
          )}

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Usage Notes */}
          <div className="space-y-2">
            <Label htmlFor="usageNotes">Usage Notes</Label>
            <Textarea
              id="usageNotes"
              value={formData.usageNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, usageNotes: e.target.value }))}
              placeholder="Any special instructions or notes"
              rows={3}
            />
          </div>

          {/* Deal Image */}
          <div className="space-y-2">
            <Label>Deal Image</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              {imagePreview && !selectedImage ? (
                // Show existing image
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-green-600 font-medium mb-2">✓ Deal image already uploaded</p>
                    <img
                      src={imagePreview}
                      alt="Deal preview"
                      className="max-w-full max-h-48 mx-auto rounded border object-cover"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleImageRemoved}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        document.getElementById('image-replace')?.click();
                      }}
                      disabled={isLoading}
                    >
                      Replace
                    </Button>
                    <Input
                      id="image-replace"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelected(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                // Show upload interface
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-foreground">
                        Upload deal image
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        PNG, JPG, WebP up to 5MB
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageSelected(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
              
              {selectedImage && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-green-600 mb-2">✓ {selectedImage.name} selected</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedImage(undefined);
                      setImagePreview(undefined);
                    }}
                    disabled={isLoading}
                  >
                    Remove Selected
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Voucher/Access Details */}
          <div className="space-y-2">
            <Label>Voucher/Access Details</Label>
            
           
            <div className="border-2 border-dashed border-border rounded-lg p-6">
              {voucherFileUrl && !selectedVoucherFile ? (
                // Show existing voucher file
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-green-600 font-medium mb-2">✓ Voucher file already uploaded</p>
                    <img
                      src={voucherFileUrl}
                      alt="Voucher preview"
                      className="max-w-full max-h-48 mx-auto rounded border"
                    />
                  </div>
                  <div className="flex justify-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleVoucherRemoved}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('voucher-replace')?.click()}
                      disabled={isLoading}
                    >
                      Replace
                    </Button>
                    <Input
                      id="voucher-replace"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVoucherReplaced(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                // Show upload interface
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div className="mt-4">
                    <Label htmlFor="voucher-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-foreground">
                        Upload screenshot or document
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        JPEG, PNG, WebP, PDF up to 10MB
                      </span>
                    </Label>
                    <Input
                      id="voucher-upload"
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVoucherUpload(file);
                      }}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
              
              {selectedVoucherFile && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-green-600 mb-2">✓ {selectedVoucherFile.name} selected</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedVoucherFile(undefined)}
                    disabled={isLoading}
                  >
                    Remove Selected
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
