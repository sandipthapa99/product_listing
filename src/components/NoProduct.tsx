import { FolderOpen } from 'lucide-react';
import type React from 'react';

const NoProduct: React.FC = () => {
  return (
    <div className='sticky top-3 bg-primary-foreground p-6 rounded-lg shadow-md h-[calc(100vh-90px)] flex flex-col items-center justify-center text-center'>
      <FolderOpen size={60} />
      <h2 className='text-xl font-semibold mb-2 mt-4'>No Product Selected</h2>
      <p className='text-muted-foreground'>
        Select a product from the list to view its details
      </p>
    </div>
  );
};

export default NoProduct;
