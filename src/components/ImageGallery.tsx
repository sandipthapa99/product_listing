import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { cn } from '../lib/utils';

const ImageGallery = ({ images }: { images: string[] }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  // Update current index when carousel changes
  useEffect(() => {
    if (!api) {
      return;
    }
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on('select', onSelect);
    return () => {
      api.off('select', onSelect);
    };
  }, [api]);

  const handleThumbnailClick = (index: number) => {
    api?.scrollTo(index);
  };

  // If there are no images, show a placeholder
  if (!images || images.length === 0) {
    return (
      <div className='relative space-y-4 w-full h-full'>
        <div className='h-64 sm:h-80 md:h-96'>
          <img
            src={'/placeholder.png'}
            alt={'No Images'}
            className='w-full h-full object-contain'
            loading='lazy'
          />
        </div>
      </div>
    );
  }

  return (
    <div className='relative space-y-4 w-full h-full'>
      <Carousel setApi={setApi} className='w-full'>
        <CarouselContent className='h-64 sm:h-80 md:h-96 relative'>
          {images.map((image, index) => (
            <CarouselItem
              key={`${image}-${index}`}
              className='relative w-full h-full flex items-center justify-center'
            >
              <img
                src={image || '/placeholder.png'}
                alt={image}
                className='h-full object-contain'
                loading='lazy'
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && <CarouselPrevious className='left-4' />}
        {images.length > 1 && <CarouselNext className='right-4' />}
      </Carousel>

      {/* Thumbnails */}
      <div className='flex items-center gap-2 overflow-x-auto py-2'>
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            onClick={() => handleThumbnailClick(index)}
            className={cn(
              'relative h-16 w-16 overflow-hidden rounded border-2 transition-all',
              current === index
                ? 'border-primary'
                : 'border-transparent hover:border-primary/50'
            )}
            aria-label={`View ${image}`}
          >
            <img
              src={image || '/placeholder.png'}
              alt={`Thumbnail for ${image}`}
              className='object-cover'
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
