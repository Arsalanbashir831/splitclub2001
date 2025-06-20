
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Eye, Calendar, ExternalLink, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

interface ClaimedDealCardProps {
  claim: any;
  onViewDetails: (dealId: string) => void;
}

export const ClaimedDealCard = ({ claim, onViewDetails }: ClaimedDealCardProps) => {
  const deal = claim.deals;
  
  if (!deal) return null;

  const isExpired = new Date(deal.expiry_date) < new Date();
  const daysUntilExpiry = Math.ceil((new Date(deal.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card h-full">
        <CardContent className="p-0 h-full flex flex-col">
          {/* Image Section */}
          <div className="relative h-48 bg-gradient-to-br from-primary to-purple-600 overflow-hidden">
            {deal.image_url ? (
              <img
                src={deal.image_url}
                alt={deal.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gift className="w-16 h-16 text-primary-foreground/80" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-background/90 text-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Claimed
              </Badge>
            </div>
            {isExpired && (
              <div className="absolute top-3 right-3">
                <Badge variant="destructive">
                  Expired
                </Badge>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-3 line-clamp-2 text-foreground">
                {deal.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline" className="text-xs">
                  {deal.category}
                </Badge>
                {!deal.is_for_sale && (
                  <Badge className="bg-green-500 dark:bg-green-600 text-white text-xs">
                    FREE
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  <span>Claimed: {new Date(claim.claimed_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-orange-500" />
                  <span className={isExpired ? 'text-destructive font-medium' : daysUntilExpiry <= 7 ? 'text-orange-600 dark:text-orange-400 font-medium' : 'text-muted-foreground'}>
                    {isExpired 
                      ? 'Expired' 
                      : daysUntilExpiry <= 0 
                        ? 'Expires today' 
                        : `Expires in ${daysUntilExpiry} days`
                    }
                  </span>
                </div>
                
                {deal.is_location_bound && deal.location_details && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-red-500" />
                    <span className="truncate">{deal.location_details}</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              {deal.is_for_sale && (
                <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">Deal Price</span>
                    <div className="text-right">
                      <span className="font-bold text-green-700 dark:text-green-400 text-lg">${deal.price}</span>
                      {deal.original_price && deal.original_price > deal.price && (
                        <div className="text-sm text-muted-foreground line-through">
                          ${deal.original_price}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              onClick={() => onViewDetails(deal.id)}
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg"
              size="lg"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>

            {/* Usage Notes */}
            {deal.usage_notes && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-800 dark:text-yellow-400">
                  <span className="font-medium">Usage Notes:</span> {deal.usage_notes}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
