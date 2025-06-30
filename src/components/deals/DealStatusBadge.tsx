import { Badge } from '@/components/ui/badge';

interface DealStatusBadgeProps {
  status: string;
  hasClaimedDeal?: boolean;
  isOwnDeal?: boolean;
}

export const DealStatusBadge = ({ 
  status, 
  hasClaimedDeal = false, 
  isOwnDeal = false 
}: DealStatusBadgeProps) => {
  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant={
          status === 'active' ? 'default' : 
          status === 'claimed' ? 'secondary' : 'destructive'
        }
        className="capitalize"
      >
        {status}
      </Badge>
      {hasClaimedDeal && !isOwnDeal && (
        <Badge variant="secondary" className="text-green-600 bg-green-50 border-green-200">
          Subscribed
        </Badge>
      )}
      {isOwnDeal && (
        <Badge variant="secondary" className="text-xs">
          Yours
        </Badge>
      )}
    </div>
  );
};
