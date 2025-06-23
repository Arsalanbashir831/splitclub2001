
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

interface DealAvailabilityInfoProps {
  availableSlots: number;
  totalSlots: number;
  isFree: boolean;
  sharePrice: number;
}

export const DealAvailabilityInfo = ({
  availableSlots,
  totalSlots,
  isFree,
  sharePrice
}: DealAvailabilityInfoProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          {availableSlots}/{totalSlots} available
        </span>
      </div>
      {isFree ? (
        <Badge variant="outline" className="text-green-600 border-green-600">
          Free
        </Badge>
      ) : (
        <span className="font-semibold">£{sharePrice.toFixed(2)}</span>
      )}
    </div>
  );
};
