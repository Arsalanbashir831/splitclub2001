
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClaimedDealCardProps {
  claim: any;
  onViewDetails: (dealId: string) => void;
}

export const ClaimedDealCard = ({ claim, onViewDetails }: ClaimedDealCardProps) => {
  const deal = claim.deals;
  
  if (!deal) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{deal.title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{deal.category}</Badge>
                <Badge variant="secondary">Claimed</Badge>
              </div>
            </div>
            
            {deal.image_url && (
              <div className="ml-4">
                <img
                  src={deal.image_url}
                  alt={deal.title}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Claimed: {new Date(claim.claimed_at).toLocaleDateString()}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Expires: {new Date(deal.expiry_date).toLocaleDateString()}
            </div>
            
            {deal.is_location_bound && deal.location_details && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {deal.location_details}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="text-right">
              {!deal.is_for_sale ? (
                <span className="font-bold text-green-600">FREE</span>
              ) : (
                <div>
                  <span className="font-bold text-green-600">${deal.price}</span>
                  {deal.original_price && (
                    <span className="text-sm text-muted-foreground line-through ml-1">
                      ${deal.original_price}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(deal.id)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Button>
          </div>

          {deal.usage_notes && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Usage Notes:</strong> {deal.usage_notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
