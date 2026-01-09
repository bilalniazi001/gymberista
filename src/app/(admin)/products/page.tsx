import Link from 'next/link';
import ProductList from '@/components/ProductList'; 

/**
 * ✅ NEXT.JS BUILD FIX: 
 * Yeh teeno lines Next.js ko batati hain ke is page ko build ke waqt static nahi banana, 
 * balkay har request par naya data fetch karna hai.
 */
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

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

// ✅ URL FIX: Localhost ko priority nahi di, direct Vercel URL rakhi hai fallback mein
const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://supplimax-back-xypo.vercel.app';

async function getProducts(): Promise<Product[]> {
  try {
    // URL format ko clean karne ke liye logic
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const fetchUrl = `${baseUrl}/products`;
    
    console.log(' [SYSTEM] Fetching data from:', fetchUrl);

    const res = await fetch(fetchUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 } // Next.js 14/15 specific fix
    });

    if (!res.ok) {
      console.error(` [SYSTEM] API Error: ${res.status}`);
      return [];
    }

    const products = await res.json();
    
    // Proper MongoDB ID mapping logic
    return products.map((product: any, index: number) => ({
      id: product.id || product._id?.toString() || `temp-${index + 1}`,
      name: product.name || '',
      price: Number(product.price) || 0,
      cost: Number(product.cost) || 0,
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      quantityInStock: Number(product.quantityInStock) || 0,
      size: product.size || 'One Size',
      rating: Number(product.rating) || 0,
      color: product.color || '',
      onSale: Boolean(product.onSale),
      discountPercentage: Number(product.discountPercentage) || 0,
      isNewArrival: Boolean(product.isNewArrival),
      category: product.category || 'Uncategorized',
      isInStock: product.isInStock !== undefined ? product.isInStock : (product.quantityInStock > 0),
      isFeatured: Boolean(product.isFeatured),
      isExclusive: Boolean(product.isExclusive),
    }));

  } catch (error) {
    console.error(' [SYSTEM] Critical Fetch Error:', error);
    return []; 
  }
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold !text-[#2D3B29]">
            Our Products
        </h1>
        <Link 
          href="/products/add" 
          className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + Add New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-lg">No products found in the database.</p>
        </div>
      ) : (
        <ProductList products={products} />
      )}
    </div>
  );
}