import Link from 'next/link';
import ProductList from '@/components/ProductList'; 

// ✅ Build error (DYNAMIC_SERVER_USAGE) fix karne ke liye
export const dynamic = 'force-dynamic';

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
  color: string;
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
  isInStock: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
};

// API URL check (Vercel ya Localhost)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supplimax-back-xypo.vercel.app';

// Data Fetching Function
async function getProducts(): Promise<Product[]> {
  try {
    const fetchUrl = `${API_BASE_URL}/products`;
    console.log('Fetching products from:', fetchUrl);

    const res = await fetch(fetchUrl, { 
      cache: 'no-store', // Taake har dafa naya data mile
    });

    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      return []; 
    }

    const products = await res.json();
    
    // Proper mapping for MongoDB IDs
    return products.map((product: any, index: number) => ({
      id: product.id || product._id?.toString() || `temp-${index + 1}`,
      name: product.name || '',
      price: product.price || 0,
      cost: product.cost || 0,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      quantityInStock: product.quantityInStock || 0,
      size: product.size || 'One Size',
      rating: product.rating || 0,
      color: product.color || '',
      onSale: product.onSale || false,
      discountPercentage: product.discountPercentage || 0,
      isNewArrival: product.isNewArrival || false,
      category: product.category || 'Uncategorized',
      isInStock: product.isInStock !== undefined ? product.isInStock : (product.quantityInStock > 0),
      isFeatured: product.isFeatured || false,
      isExclusive: product.isExclusive || false,
    }));

  } catch (error) {
    console.error('Fetch error:', error);
    return []; 
  }
}

// Page Component
export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold !text-[#2D3B29]">
            Our Products
        </h1>
        {/* Admin Link (Sirf agar aap admin hain) */}
        <Link 
          href="/products/add" 
          className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + Add New Product
        </Link>
      </div>

      {/* Info Message for User */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found. Please check your database connection.</p>
        </div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}