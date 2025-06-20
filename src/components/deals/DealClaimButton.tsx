
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
  // Check if user owns this deal
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

  // Check if user has already claimed this deal
  if (hasClaimedDeal) {
    return (
      <Button 
        variant="secondary" 
        size="sm" 
        disabled 
        className="w-full bg-green-100 text-green-800 border-green-300"
      >
        ✓ Already Claimed
      </Button>
    );
  }

  // Check if deal has available slots
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

  // Show claim button
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
