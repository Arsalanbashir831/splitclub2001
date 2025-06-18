import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { DealFormData } from '@/pages/ShareDeal';

const availableTags = [
  'Food',
  'Fitness',
  'Subscription',
  'Voucher-only',
  'Expiring Soon',
  'Location Specific',
  'Online Only',
  'Weekend Only',
  'Weekday Only',
  'Limited Use'
];

interface AddConditionsProps {
  formData: DealFormData;
  onUpdateFormData: (data: Partial<DealFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const AddConditions = ({
  formData,
  onUpdateFormData,
  onNext,
  onPrev
}: AddConditionsProps) => {
  const [customTag, setCustomTag] = useState('');

  const handleTagToggle = (tag: string) => {
    const currentTags = formData.tags || [];
    const updatedTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onUpdateFormData({ tags: updatedTags });
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      onUpdateFormData({ tags: [...formData.tags, customTag.trim()] });
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = formData.tags.filter(tag => tag !== tagToRemove);
    onUpdateFormData({ tags: updatedTags });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Add Conditions
        </h1>
        <p className="text-muted-foreground">
          Optional: Add usage notes and tags to help others understand your reward
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usage Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usageNotes">Additional Information</Label>
            <Textarea
              id="usageNotes"
              value={formData.usageNotes}
              onChange={(e) => onUpdateFormData({ usageNotes: e.target.value })}
              placeholder="e.g., Only valid Monday–Thursday, Must be used online by clicking this link..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Include any important restrictions, special instructions, or helpful tips
            </p>
          </div>

          <div className="bg-muted/30 rounded-lg p-4">
            <h4 className="font-medium mb-2">Examples of useful notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• "Valid only on weekdays before 6 PM"</li>
              <li>• "Must show on mobile device, screenshots not accepted"</li>
              <li>• "Book online using code ABC123"</li>
              <li>• "One use per person, expires midnight on date shown"</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>Available Tags</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.tags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleTagToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Add Custom Tag</Label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Enter custom tag"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCustomTag()}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddCustomTag}
                disabled={!customTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {formData.tags.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Tags</Label>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="default" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext}>
          Continue to Preview
        </Button>
      </div>
    </div>
  );
};