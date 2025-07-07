
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, X } from 'lucide-react';

export interface FilterState {
  category: string[];
  priceRange: [number, number];
  isFree: boolean;
  availableOnly: boolean;
  expiringWithin: string;
  sortBy: string;
}

interface DealFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const DealFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  isOpen,
  onToggle
}: DealFiltersProps) => {
  const categories = [
    { value: 'cinema', label: 'Free Cinema Ticket', icon: '🎟️' },
    { value: 'gym', label: 'Gym Guest Pass (1-Day)', icon: '🏋️‍♂️' },
    { value: 'restaurant', label: 'Restaurant Meal Voucher', icon: '🍱' },
    { value: 'vouchers', label: 'Amex/Amazon/Retail Vouchers', icon: '🎁' },
    { value: 'discounts', label: 'Sales & Discounts', icon: '💸' },
    { value: 'subscriptions', label: 'Subscriptions', icon: '📦' }
  ];

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);
    
    onFiltersChange({ ...filters, category: newCategories });
  };

  const handlePriceRangeChange = (values: number[]) => {
    onFiltersChange({ ...filters, priceRange: [values[0], values[1]] });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category.length > 0) count++;
    if (filters.isFree) count++;
    if (filters.availableOnly) count++;
    if (filters.expiringWithin !== 'any') count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-4">
      {/* Filter toggle button - mobile */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={onToggle}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Filters content */}
      <div className={`space-y-4 ${!isOpen ? 'hidden md:block' : 'block'}`}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary">
                    {activeFiltersCount}
                  </Badge>
                )}
              </CardTitle>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sort by */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Sort by</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="expiring">Expiring Soon</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Categories</Label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={category.value}
                      checked={filters.category.includes(category.value)}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.value, checked as boolean)
                      }
                    />
                    <Label
                      htmlFor={category.value}
                      className="text-sm font-normal cursor-pointer flex items-center space-x-2"
                    >
                      <span className="text-base">{category.icon}</span>
                      <span>{category.label}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Price Range</Label>
              <div className="px-2">
                <Slider
                  defaultValue={filters.priceRange}
                  max={100}
                  min={0}
                  step={5}
                  onValueChange={handlePriceRangeChange}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                  <span>£{filters.priceRange[0]}</span>
                  <span>£{filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Quick filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Quick Filters</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="free-only"
                    checked={filters.isFree}
                    onCheckedChange={(checked) =>
                      onFiltersChange({ ...filters, isFree: checked as boolean })
                    }
                  />
                  <Label htmlFor="free-only" className="text-sm font-normal cursor-pointer">
                    Free deals only
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available-only"
                    checked={filters.availableOnly}
                    onCheckedChange={(checked) =>
                      onFiltersChange({ ...filters, availableOnly: checked as boolean })
                    }
                  />
                  <Label htmlFor="available-only" className="text-sm font-normal cursor-pointer">
                    Available deals only
                  </Label>
                </div>
              </div>
            </div>

            {/* Expiring within */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Expiring within</Label>
              <Select
                value={filters.expiringWithin}
                onValueChange={(value) => onFiltersChange({ ...filters, expiringWithin: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any time</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
