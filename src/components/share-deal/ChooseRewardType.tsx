import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'cinema',
    title: 'Free Cinema Ticket',
    icon: '🎟️',
    description: 'Movie tickets, cinema vouchers'
  },
  {
    id: 'gym',
    title: 'Gym Guest Pass (1-Day)',
    icon: '🏋️‍♂️',
    description: 'Fitness center access, day passes'
  },
  {
    id: 'restaurant',
    title: 'Restaurant Meal Voucher',
    icon: '🍱',
    description: 'Vitality, Itsu, meal vouchers'
  },
  {
    id: 'vouchers',
    title: 'Amex/Amazon/Retail Vouchers',
    icon: '🎁',
    description: 'Gift cards, retail vouchers'
  },
  {
    id: 'discounts',
    title: 'Sales & Discounts',
    icon: '💸',
    description: 'Insurance, Rakuten, discount codes'
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions',
    icon: '📦',
    description: 'Amazon delivery, Deliveroo discounts'
  }
];

interface ChooseRewardTypeProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
  onNext: () => void;
}

export const ChooseRewardType = ({
  selectedCategory,
  onCategorySelect,
  onNext
}: ChooseRewardTypeProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          What kind of reward are you sharing?
        </h1>
        <p className="text-muted-foreground">
          Choose the category that best describes your reward
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedCategory === category.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="text-4xl">{category.icon}</div>
              <h3 className="font-semibold text-foreground">{category.title}</h3>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button 
          onClick={onNext} 
          disabled={!selectedCategory}
          size="lg"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};