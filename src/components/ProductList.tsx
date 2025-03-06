import { useState, useEffect, lazy, Suspense } from 'react';
import { getAllProducts } from '../api/product.api';
import ProductListWrapper from './ProductListWrapper';
import { Product } from '../types/types';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  Search,
  X,
} from 'lucide-react';

const LazyProductCard = lazy(() => import('./ProductCard'));

const ProductList = ({ selectedId }: { selectedId?: string }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const productsPerPage = 10;

  // Get unique categories & brands and sort aplhabetically
  const categories = Array.from(
    new Set(products.map((product) => product.category).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const brands = Array.from(
    new Set(products.map((product) => product?.brand).filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data?.products);
        setFilteredProducts(data?.products);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.description
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          product?.category
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          product?.brand?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter((product) => product.category === filterCategory);
    }

    if (filterBrand) {
      result = result.filter((product) => product.brand === filterBrand);
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [searchTerm, filterCategory, filterBrand, products]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterBrand('');
  };

  if (loading) {
    return (
      <ProductListWrapper>
        <div className='animate-pulse space-y-4'>
          {[...Array(10)].map((item) => (
            <div key={item} className='bg-gray-200 h-20 rounded-md' />
          ))}
        </div>
      </ProductListWrapper>
    );
  }

  if (error) {
    return (
      <ProductListWrapper>
        <div className='p-4 text-red-500 bg-red-100 rounded-md'>{error}</div>
      </ProductListWrapper>
    );
  }

  return (
    <ProductListWrapper>
      {/* Filters */}
      <div className='mb-6'>
        <div className='relative mb-4'>
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <Search
            size={20}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
          />
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div className='relative w-full'>
            <select
              id='category'
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='truncate cursor-pointer capitalize w-full p-2 pr-6 border appearance-none rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value=''>All Categories</option>
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                  className='capitalize cursor-pointer'
                >
                  {category}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-2 flex items-center pointer-events-none'>
              <ChevronDown size={16} />
            </div>
          </div>

          <div className='relative w-full'>
            <select
              id='brand'
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className='w-full p-2 pr-6 appearance-none border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 truncate'
            >
              <option value=''>All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand} className='capitalize'>
                  {brand}
                </option>
              ))}
            </select>
            <div className='absolute inset-y-0 right-2 flex items-center pointer-events-none'>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {(searchTerm || filterCategory || filterBrand) && (
          <button
            onClick={resetFilters}
            className='text-sm text-red-600 flex justify-end items-center gap-1 mt-2 border border-red-600 rounded-lg p-1'
          >
            <X size={16} />
            <span>Clear filters</span>
          </button>
        )}
      </div>

      {/* Product List */}
      <div className='space-y-4'>
        {currentProducts.length === 0 ? (
          <div className='flex flex-col gap-2 items-center justify-center py-6 text-gray-500 '>
            <FolderOpen size={32} />
            <p>No products found.</p>
          </div>
        ) : (
          currentProducts.map((product) => (
            <Suspense
              fallback={<div className='bg-white h-[134px] rounded-md' />}
              key={product.id}
            >
              <LazyProductCard product={product} selectedId={selectedId} />
            </Suspense>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className='flex items-center justify-between mt-6'>
          <div className='text-sm text-gray-500'>
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{' '}
            {filteredProducts.length}
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Previous page'
            >
              <ChevronLeft strokeWidth='2' />
            </button>
            <span className='text-sm text-gray-700'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label='Next page'
            >
              <ChevronRight strokeWidth='2' />
            </button>
          </div>
        </div>
      )}
    </ProductListWrapper>
  );
};

export default ProductList;
