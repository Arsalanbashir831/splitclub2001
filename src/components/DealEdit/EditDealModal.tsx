
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ImageUpload';
import { Deal } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { dealsService } from '@/services/dealsService';
import { supabase } from '@/integrations/supabase/client';

interface EditDealModalProps {
  deal: Deal;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedDeal: Deal) => void;
}

export const EditDealModal = ({ deal, isOpen, onClose, onSave }: EditDealModalProps) => {
  const [formData, setFormData] = useState({
    title: deal.title,
    category: deal.category,
    originalPrice: deal.originalPrice.toString(),
    sharePrice: deal.sharePrice.toString(),
    isForSale: deal.isForSale,
    usageNotes: deal.usageNotes || '',
    locationDetails: deal.locationDetails || '',
    isLocationBound: deal.isLocationBound || false,
    maxClaims: deal.totalSlots
  });
  const [selectedImage, setSelectedImage] = useState<File | undefined>();
  const [imagePreview, setImagePreview] = useState<string | undefined>(deal.imageUrl);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      title: deal.title,
      category: deal.category,
      originalPrice: deal.originalPrice.toString(),
      sharePrice: deal.sharePrice.toString(),
      isForSale: deal.isForSale,
      usageNotes: deal.usageNotes || '',
      locationDetails: deal.locationDetails || '',
      isLocationBound: deal.isLocationBound || false,
      maxClaims: deal.totalSlots
    });
    setImagePreview(deal.imageUrl);
    setSelectedImage(undefined);
  }, [deal]);

  const handleImageSelected = (file: File) => {
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleImageRemoved = () => {
    setSelectedImage(undefined);
    setImagePreview(undefined);
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

  const handleSave = async () => {
    setIsLoading(true);
    try {
      let imageUrl = imagePreview;
      let imageFileName = deal.imageFileName;

      if (selectedImage) {
        const uploadedUrl = await uploadImage(selectedImage);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          imageFileName = selectedImage.name;
        }
      }

      const { data, error } = await supabase
        .from('deals')
        .update({
          title: formData.title,
          category: formData.category,
          original_price: Number(formData.originalPrice),
          price: formData.isForSale ? Number(formData.sharePrice) : 0,
          is_for_sale: formData.isForSale,
          usage_notes: formData.usageNotes,
          location_details: formData.locationDetails,
          is_location_bound: formData.isLocationBound,
          max_claims: formData.maxClaims,
          image_url: imageUrl,
          image_file_name: imageFileName,
          updated_at: new Date().toISOString()
        })
        .eq('id', deal.id)
        .select()
        .single();

      if (error) throw error;

      const updatedDeal: Deal = {
        ...deal,
        title: formData.title,
        category: formData.category as Deal['category'],
        originalPrice: Number(formData.originalPrice),
        sharePrice: formData.isForSale ? Number(formData.sharePrice) : 0,
        isForSale: formData.isForSale,
        isFree: !formData.isForSale,
        usageNotes: formData.usageNotes,
        locationDetails: formData.locationDetails,
        isLocationBound: formData.isLocationBound,
        totalSlots: formData.maxClaims,
        imageUrl,
        imageFileName
      };

      onSave(updatedDeal);
      toast({
        title: "Deal updated successfully",
        description: "Your deal has been updated and is now live.",
      });
      onClose();
    } catch (error) {
      console.error('Error updating deal:', error);
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Deal</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price ($)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxClaims">Max Claims</Label>
              <Input
                id="maxClaims"
                type="number"
                value={formData.maxClaims}
                onChange={(e) => setFormData(prev => ({ ...prev, maxClaims: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isForSale"
              checked={formData.isForSale}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isForSale: checked }))}
            />
            <Label htmlFor="isForSale">This deal is for sale</Label>
          </div>

          {formData.isForSale && (
            <div className="space-y-2">
              <Label htmlFor="sharePrice">Share Price ($)</Label>
              <Input
                id="sharePrice"
                type="number"
                value={formData.sharePrice}
                onChange={(e) => setFormData(prev => ({ ...prev, sharePrice: e.target.value }))}
              />
            </div>
          )}

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

          <div className="space-y-2">
            <Label>Deal Image</Label>
            <ImageUpload
              onImageSelected={handleImageSelected}
              onImageRemoved={handleImageRemoved}
              selectedImage={selectedImage}
              preview={imagePreview}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
