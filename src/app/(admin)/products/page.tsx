// app/admin/products/page.tsx

import Link from 'next/link';
import ProductList from '@/components/ProductList'; 

// ✅ CORRECTED: flavor -> color change kiya (db.json ke according)
type Product = {
  id: string;
  name: string;
  price: number;
  cost: number;
  description: string;
  imageUrl: string;
  quantityInStock: number;
  size: string;
  rating: number;
  color: string; // ✅ CHANGE: flavor -> color
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
  isInStock: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
};

const API_BASE_URL = 'api/data/products'; 

// Data Fetching Function (Next.js Server Component)
async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(API_BASE_URL, { 
      cache: 'no-store', 
    });

    if (!res.ok) {
      console.error(`Error fetching products: ${res.status} ${res.statusText}`);
      return []; 
    }

    const products = await res.json();
    
    // ✅ FIX: JSON Server directly 'id' field deta hai, _id nahi
    // Sirf data validate karein
    return products.map((product: any) => ({
      id: product.id, // ✅ JSON Server se id directly aata hai
      name: product.name || '',
      price: product.price || 0,
      cost: product.cost || 0,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      quantityInStock: product.quantityInStock || 0,
      size: product.size || 'One Size',
      rating: product.rating || 0,
      color: product.color || '', // ✅ color field
      onSale: product.onSale || false,
      discountPercentage: product.discountPercentage || 0,
      isNewArrival: product.isNewArrival || false,
      category: product.category || 'Uncategorized',
      isInStock: product.isInStock !== undefined ? product.isInStock : true,
      isFeatured: product.isFeatured || false,
      isExclusive: product.isExclusive || false,
    }));

  } catch (error) {
    console.error('Network or unknown error fetching products list:', error);
    return []; 
  }
}

// Page Component (Server Component)
export default async function AdminProductsPage() {
  const products = await getProducts();

  // ✅ Debugging ke liye
  console.log('Fetched products:', products);

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold !text-[#2D3B29]">
            Product Management
        </h1>
        <Link 
          href="/products/add" 
          className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + Add New Product
        </Link>
      </div>
      
      <ProductList products={products} />
    </div>
  );
}