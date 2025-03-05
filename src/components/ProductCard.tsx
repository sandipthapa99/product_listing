import { Link } from 'react-router-dom';
import { Product } from '../types/types';
import { Star } from 'lucide-react';
import { calculateDiscountedPrice } from '../lib/utils';
import React from 'react';

const ProductCard = ({
  product,
  selectedId,
}: {
  product: Product;
  selectedId?: string;
}) => {
  return (
    <Link
      to={`/products/${product.id}`}
      key={product.id}
      className={`block p-4 border rounded-lg transition-all hover:shadow-md ${
        selectedId && product.id.toString() === selectedId
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-200'
      }`}
    >
      <div className='flex gap-4 items-center'>
        <div className='w-20 h-20 relative flex-shrink-0'>
          <img
            src={product.thumbnail || '/placeholder.png'}
            alt={product.title}
            className='object-cover rounded-md w-full h-full'
            loading='lazy'
          />
          <span className='text-sm bg-green-100 text-green-800 px-2 py-1 rounded absolute top-0'>
            {Math.round(product.discountPercentage)}% OFF
          </span>
        </div>
        <div className='flex-1 min-w-0'>
          <h3 className='font-medium text-lg text-gray-900 truncate'>
            {product?.title}
          </h3>
          <p className='text-sm text-gray-500 mb-1 capitalize'>
            {product?.brand} • {product?.category}
          </p>
          <div className='flex items-center gap-1 mb-1'>
            <Star className='w-3.5 h-3.5 text-yellow-400' fill='currentColor' />

            <span className='text-sm text-gray-600'>
              {product.rating.toFixed(1)}
            </span>
            <span className='text-sm text-gray-500 ml-2'>
              Stock: {product.stock}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='font-semibold text-gray-900'>
              $
              {calculateDiscountedPrice(
                product.price,
                product.discountPercentage
              )}
            </span>
            <span className='text-sm line-through text-gray-500'>
              ${product.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default React.memo(ProductCard);
