export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
  minimumOrderQuantity?: number;
  availabilityStatus?: string;
  reviews?: Review[];
}

export interface ProductsResponse {
  limit: number;
  products: Product[];
  skip: number;
  total: number;
}

export interface Review {
  id: number;
  reviewerEmail: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date: string;
}
