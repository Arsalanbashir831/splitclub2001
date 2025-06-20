
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle } from 'lucide-react';

interface DealClaimButtonProps {
  isOwnDeal: boolean;
  hasClaimedDeal: boolean;
  isClaimLoading: boolean;
  isAvailable: boolean;
  onClaim: () => void;
}

export const DealClaimButton = ({
  isOwnDeal,
  hasClaimedDeal,
  isClaimLoading,
  isAvailable,
  onClaim
}: DealClaimButtonProps) => {
  if (isOwnDeal) {
    return (
      <Button 
        variant="secondary" 
        size="sm" 
        disabled 
        className="w-full"
      >
        Your Deal
      </Button>
    );
  }

  if (hasClaimedDeal) {
    return (
      <Button 
        variant="secondary" 
        size="sm" 
        disabled 
        className="w-full"
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Already Claimed
      </Button>
    );
  }

  if (!isAvailable) {
    return (
      <Button 
        variant="secondary" 
        size="sm" 
        disabled 
        className="w-full"
      >
        No Slots Available
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={onClaim}
      disabled={isClaimLoading}
      className="w-full"
    >
      {isClaimLoading ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          Claiming...
        </>
      ) : (
        'Claim Deal'
      )}
    </Button>
  );
};
