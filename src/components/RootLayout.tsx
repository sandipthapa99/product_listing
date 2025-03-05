import type React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import ProductList from './ProductList';

const RootLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className='min-h-screen flex flex-col bg-gray-100'>
      <header className='border-b border-muted flex items-center justify-center bg-white sticky top-0 z-10 shadow-sm'>
        <div className='container mx-auto p-4 flex justify-between items-center'>
          <Link
            to={'/'}
            className='font-semibold text-lg sm:text-2xl md:text-3xl text-grey-500'
          >
            Marketplace
          </Link>
        </div>
      </header>
      <main className='flex-grow container mx-auto mt-6 px-4 pb-5'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 relative h-full'>
          <div className='lg:col-span-7 order-2 lg:order-1'>
            <Outlet />
          </div>
          <div className='lg:col-span-5 order-1 lg:order-2 '>
            <ProductList selectedId={id} />
          </div>
        </div>
      </main>
      <footer className='text-gray-600'>
        <div className='container mx-auto px-4 py-4 text-center'>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
