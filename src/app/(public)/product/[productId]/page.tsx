// app/products/[productId]/page.tsx
import ProductDetailClient from './ProductDetailClient';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  description: string;
}

async function getProduct(productId: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:5000/products/${productId}`, {
      cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error('Product not found:', res.status);
      return null;
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  const product = await getProduct(productId);

  return <ProductDetailClient product={product} />;
}