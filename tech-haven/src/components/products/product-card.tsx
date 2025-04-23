'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Heart, 
  BarChart2,
  Check,
  Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    price: number;
    discountPrice?: number;
    discount_percent?: number;
    category?: string;
    brand: string;
    images: string[];
    is_featured?: boolean;
    inStock?: boolean;
    rating?: number;
  };
  className?: string;
  showAddToCart?: boolean;
  showPcBuilder?: boolean;
}

export function ProductCard({ 
  product, 
  className,
  showAddToCart = true,
  showPcBuilder = false
}: ProductCardProps) {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  
  const {
    id,
    name,
    slug,
    price,
    discountPrice,
    discount_percent,
    brand,
    images,
    is_featured,
    inStock = true,
    rating = 4
  } = product;
  
  const productLink = `/products/${slug || id}`;
  const discountedPrice = discountPrice || (discount_percent ? price * (1 - discount_percent / 100) : null);
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // In a real implementation, this would add the item to the cart
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1000);
  };
  
  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };
  
  const toggleSelect = () => {
    setIsSelected(!isSelected);
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <div className="relative">
        {discount_percent && (
          <Badge className="absolute left-2 top-2 z-10 bg-red-500 hover:bg-red-600">
            -{discount_percent}%
          </Badge>
        )}
        {is_featured && (
          <Badge className="absolute right-2 top-2 z-10" variant="secondary">
            Featured
          </Badge>
        )}
        <Link href={productLink}>
          <div className="relative aspect-square overflow-hidden bg-muted">
            <Image
              src={images[0] || "https://placehold.co/300x300"}
              alt={name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </div>
      <CardContent className="grid gap-2.5 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{brand}</p>
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-current text-yellow-500" />
            <span className="text-xs font-medium">{rating}/5</span>
          </div>
        </div>
        <Link href={productLink} className="group line-clamp-2 font-medium hover:underline">
          {name}
        </Link>
        <div className="flex items-center gap-2">
          {discountedPrice ? (
            <>
              <span className="font-bold">${discountedPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${price.toFixed(2)}</span>
            </>
          ) : (
            <span className="font-bold">${price.toFixed(2)}</span>
          )}
        </div>
        {!inStock && (
          <p className="text-sm font-medium text-red-500">Out of Stock</p>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
        {showAddToCart && (
          <Button 
            variant="default" 
            size="sm" 
            className="w-full" 
            onClick={handleAddToCart} 
            disabled={isAddingToCart || !inStock}
          >
            {isAddingToCart ? (
              <>
                <Check className="mr-1 h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="mr-1 h-4 w-4" />
                {inStock ? 'Add to Cart' : 'Sold Out'}
              </>
            )}
          </Button>
        )}
        {showPcBuilder && (
          <Button
            variant={isSelected ? "outline" : "default"}
            size="sm"
            className="w-full"
            onClick={toggleSelect}
            disabled={!inStock}
          >
            <BarChart2 className="mr-1 h-4 w-4" />
            {isSelected ? 'Selected' : 'Select'}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "w-full",
            isWishlisted && "bg-pink-50 text-pink-600 hover:bg-pink-100 hover:text-pink-700"
          )}
          onClick={toggleWishlist}
        >
          <Heart className={cn("mr-1 h-4 w-4", isWishlisted && "fill-current")} />
          {isWishlisted ? 'Wishlisted' : 'Wishlist'}
        </Button>
      </CardFooter>
    </Card>
  );
}