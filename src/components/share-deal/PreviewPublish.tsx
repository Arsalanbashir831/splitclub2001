import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Share, Calendar, MapPin, DollarSign, Tag, FileText, Users } from 'lucide-react';
import { DealFormData } from '@/pages/ShareDeal';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/hooks/use-toast';
import { dealsService } from '@/services/dealsService';

const categoryIcons = {
  cinema: '🎟️',
  gym: '🏋️‍♂️',
  restaurant: '🍱',
  vouchers: '🎁',
  discounts: '💸',
  subscriptions: '📦'
};

const sharingMethodLabels = {
  login: 'Share login credentials',
  invite: 'Send invite link',
  voucher: 'Provide voucher code',
  other: 'Other method'
};

interface PreviewPublishProps {
  formData: DealFormData;
  onPrev: () => void;
  onPublish: () => void;
}

export const PreviewPublish = ({
  formData,
  onPrev,
  onPublish
}: PreviewPublishProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
  const { user } = useAuthStore();
  const { toast } = useToast();

  const handlePublish = async () => {
    if (!user) return;

    setIsPublishing(true);
    try {
      const dealData = {
        title: formData.title,
        category: formData.category,
        source: formData.source,
        sharingMethod: formData.sharingMethod,
        dealImage: formData.dealImage,
        voucherFile: formData.voucherFile,
        expiryDate: formData.expiryDate,
        isLocationBound: formData.isLocationBound,
        locationDetails: formData.locationDetails || null,
        isForSale: formData.isForSale,
        price: formData.price,
        originalPrice: formData.originalPrice,
        usageNotes: formData.usageNotes || null,
        tags: formData.tags.length > 0 ? formData.tags : [],
        maxClaims: formData.maxClaims
      };

      await dealsService.createDeal(dealData, user.id);

      toast({
        title: "Success!",
        description: "Your deal has been published successfully.",
      });

      onPublish();
    } catch (error) {
      console.error('Error publishing deal:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Preview & Publish
        </h1>
        <p className="text-muted-foreground">
          Review your deal before sharing it with the community
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Preview Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="text-3xl">
                {categoryIcons[formData.category as keyof typeof categoryIcons]}
              </span>
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2">
                  {formData.title}
                  {formData.isForSale ? (
                    <Badge variant="default">For Sale</Badge>
                  ) : (
                    <Badge variant="secondary">Free</Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  From {formData.source}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {formData.dealImageUrl && (
              <div className="w-full h-48 rounded-lg overflow-hidden">
                <img 
                  src={formData.dealImageUrl} 
                  alt="Deal preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>
                {formData.maxClaims} {formData.maxClaims === 1 ? 'person' : 'people'} can claim this deal
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Expires: {formData.expiryDate ? format(formData.expiryDate, 'PPP') : 'Not set'}
              </span>
            </div>

            {formData.isLocationBound && formData.locationDetails && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{formData.locationDetails}</span>
              </div>
            )}

            {formData.isForSale && formData.price && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span>£{parseFloat(formData.price).toFixed(2)}</span>
                {formData.originalPrice && (
                  <span className="text-muted-foreground line-through">
                    £{parseFloat(formData.originalPrice).toFixed(2)}
                  </span>
                )}
              </div>
            )}

            <div className="text-sm">
              <span className="font-medium">Redeemed as:</span>{' '}
              {sharingMethodLabels[formData.sharingMethod as keyof typeof sharingMethodLabels]}
            </div>

            {formData.voucherFileUrl && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Voucher File Attached
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  Voucher file has been uploaded and will be available to claimers.
                </p>
              </div>
            )}

            {formData.usageNotes && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="h-4 w-4" />
                  Usage Notes
                </div>
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                  {formData.usageNotes}
                </p>
              </div>
            )}

            {formData.tags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-1">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Deal Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span className="capitalize">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source:</span>
                <span>{formData.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Claims:</span>
                <span>{formData.maxClaims}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <span>{formData.isForSale ? 'For Sale' : 'Free Gift'}</span>
              </div>
              {formData.isForSale && (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Price:</span>
                    <span>£{parseFloat(formData.price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Platform Fee (10%):</span>
                    <span>£{(parseFloat(formData.price) * 0.1).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium">
                    <span>You'll Receive:</span>
                    <span className="text-primary">
                      £{(parseFloat(formData.price) * 0.9).toFixed(2)}
                    </span>
                  </div>
                </>
              )}
            </div>

            <Separator />

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-medium text-primary mb-2">Ready to publish?</h4>
              <p className="text-sm text-muted-foreground">
                Your deal will appear in the community feed where others can discover and claim it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isPublishing}>
          Back
        </Button>
        <Button 
          onClick={handlePublish} 
          disabled={isPublishing}
          className="gap-2"
          size="lg"
        >
          <Share className="h-4 w-4" />
          {isPublishing ? 'Publishing...' : 'Share with Community'}
        </Button>
      </div>
    </div>
  );
};
