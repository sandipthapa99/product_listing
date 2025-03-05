import { ReactNode } from 'react';

type ProductListWrapperProps = {
  children: ReactNode;
};

const ProductListWrapper = ({ children }: ProductListWrapperProps) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900'>All Products</h2>
      {children}
    </div>
  );
};

export default ProductListWrapper;
