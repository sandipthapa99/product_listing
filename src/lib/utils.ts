// Calculate discounted price
export const calculateDiscountedPrice = (
  price: number,
  discountPercentage: number
) => {
  return (price - (price * discountPercentage) / 100).toFixed(2);
};
