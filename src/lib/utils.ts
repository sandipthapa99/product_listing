import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number
) => {
  return (price - (price * discountPercentage) / 100).toFixed(2);
};
