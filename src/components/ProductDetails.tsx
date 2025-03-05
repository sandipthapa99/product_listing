import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types/types';
import { getProductById } from '../api/product.api';
import { calculateDiscountedPrice, cn } from '../lib/utils';
import ImageGallery from './ImageGallery';
import { ShoppingBag, Star, Truck, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { Drawer, DrawerContent } from './ui/drawer';
import { useMediaQuery } from 'react-responsive';
const DetailContent = ({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) => {
  return (
    <div className={cn(`grid-cols-1 gap-6 grid`, className)}>
      <div className='relative rounded-lg'>
        <ImageGallery images={product?.images} />
      </div>

      <div>
        <div className='flex flex-wrap items-start justify-between gap-2 mb-4'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              {product?.title}
            </h1>
            <div className='flex items-center gap-2 mt-1'>
              <div className='flex items-center gap-0.5'>
                {[...Array(5)].map((item, index) => (
                  <Star
                    key={item}
                    className={`h-3.5 w-3.5 ${
                      index < Math.floor(product?.rating)
                        ? 'text-yellow-400'
                        : index < product.rating
                        ? 'text-yellow-400 opacity-50'
                        : 'text-gray-300'
                    }`}
                    fill='currentColor'
                  />
                ))}
              </div>
              <span className='text-sm text-gray-600'>
                {product?.rating.toFixed(1)} ({product?.reviews?.length ?? 0}{' '}
                reviews)
              </span>
            </div>
          </div>

          <div className='sm:text-right text-left'>
            <div className='flex items-center gap-2'>
              <span className='text-2xl font-bold text-blue-600'>
                $
                {calculateDiscountedPrice(
                  product?.price,
                  product?.discountPercentage
                )}
              </span>
              <span className='text-sm line-through text-gray-500'>
                ${product?.price}
              </span>
            </div>
            <div className='text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded inline-block mt-1'>
              {Math.round(product?.discountPercentage)}% OFF
            </div>
          </div>
        </div>

        <div className='grid grid-cols-12 gap-2 mb-6'>
          <div className='text-sm sm:col-span-4 col-span-12 capitalize font-medium'>
            <span className='text-gray-600 '>Brand:</span> {product?.brand}
          </div>
          <div className='text-sm sm:col-span-8 col-span-12 capitalize font-medium'>
            <span className='text-gray-600 '>Category:</span>{' '}
            {product?.category}
          </div>
          <div className='text-sm sm:col-span-4 col-span-12 capitalize font-medium'>
            <span className='text-gray-600'>Availability:</span>{' '}
            <span
              className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}
            >
              {product.availabilityStatus}
            </span>
          </div>
          <div className='text-sm sm:col-span-8 col-span-12 capitalize font-medium'>
            <span className='text-gray-600'>Stock:</span> {product?.stock}
          </div>
          <div className='text-sm sm:col-span-4 col-span-12 capitalize font-medium'>
            <span className='text-gray-600'>Min. Order:</span>{' '}
            {product?.minimumOrderQuantity}
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-6'>{product?.description}</p>
        <div className='flex flex-col gap-2 p-4 bg-gray-100 rounded-md mb-4'>
          <div className='flex items-center gap-2'>
            <Truck className='text-gray-600 h-4 w-4' />
            <span className='text-sm text-gray-600'>
              Free shipping on orders over $50
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <ShoppingBag className='text-gray-600 h-4 w-4' />

            <span className='text-sm text-gray-600'>30-day return policy</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-4 text-gray-900'>
          Customer Reviews
        </h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className='space-y-4'>
            {product.reviews.map((review) => (
              <div key={review.id} className='border-b pb-4 last:border-0'>
                <div className='flex items-center justify-between mb-0.5'>
                  <div className='font-medium text-gray-800 text-sm'>
                    {review.reviewerName}
                  </div>
                  <div className='text-sm text-gray-500'>
                    {formatDistanceToNow(review.date, { addSuffix: true })}
                  </div>
                </div>
                <div className='flex items-center gap-1 mb-2'>
                  {[...Array(5)].map((item, index) => (
                    <Star
                      key={item}
                      className={`h-4 w-4 ${
                        index < review.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill='currentColor'
                    />
                  ))}
                </div>
                <p className='text-sm text-gray-600'>{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500 text-sm'>
            No reviews yet for this product.
          </p>
        )}
      </div>
    </div>
  );
};

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const isSmallScreen = useMediaQuery({ maxWidth: 1024 });

  useEffect(() => {
    if (id) {
      setIsOpen(true);
    }

    return () => {
      setIsOpen(false);
    };
  }, [id]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(Number(id));
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md animate-pulse'>
        <div className='h-64 bg-gray-300 rounded-lg mb-4'></div>
        <div className='h-8 bg-gray-300 rounded w-3/4 mb-4'></div>
        <div className='h-4 bg-gray-300 rounded w-1/2 mb-2'></div>
        <div className='h-4 bg-gray-300 rounded w-2/3 mb-6'></div>
        <div className='h-10 bg-gray-300 rounded w-1/3 mb-4'></div>
        <div className='h-24 bg-gray-300 rounded mb-4'></div>
        <div className='h-24 bg-gray-300 rounded mb-4'></div>
        <div className='h-24 bg-gray-300 rounded mb-4'></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='bg-white p-6 rounded-lg shadow-md'>
        <div className='p-4 text-red-500 bg-red-100 rounded-md'>
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-white p-6 rounded-lg shadow-md hidden sm:block'>
        <DetailContent product={product} />
      </div>
      {isSmallScreen && (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className='h-full p-4'>
            <DetailContent product={product} className='overflow-y-scroll' />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ProductDetails;
