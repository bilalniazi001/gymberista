import Link from 'next/link';
import ProductList from '@/components/ProductList'; 

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

const API_BASE_URL = 'https://supplimax-back-production.up.railway.app';

async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const fetchUrl = `${baseUrl}/products`;
    
    console.log('📡 [DEBUG] Fetching from:', fetchUrl);

    const res = await fetch(fetchUrl, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) {
      console.error(`❌ [ERROR] API Error: ${res.status}`);
      return [];
    }

    const response = await res.json();
    console.log('📦 [DEBUG] Raw API Response:', response);
    
    // ✅ EXTRACT PRODUCTS ARRAY FROM RESPONSE
    let productsArray = [];
    
    // Case 1: { data: [...] } - MOST COMMON
    if (response.data && Array.isArray(response.data)) {
      console.log(`✅ Found ${response.data.length} products in response.data`);
      productsArray = response.data;
    }
    // Case 2: { products: [...] }
    else if (response.products && Array.isArray(response.products)) {
      console.log(`✅ Found ${response.products.length} products in response.products`);
      productsArray = response.products;
    }
    // Case 3: Direct array response
    else if (Array.isArray(response)) {
      console.log(`✅ Found ${response.length} products in direct array`);
      productsArray = response;
    }
    // Case 4: Search for any array in response
    else {
      console.log('⚠️ Searching for products array in response...');
      for (const key in response) {
        if (Array.isArray(response[key])) {
          productsArray = response[key];
          console.log(`✅ Found ${productsArray.length} products in response.${key}`);
          break;
        }
      }
    }
    
    if (productsArray.length === 0) {
      console.warn('⚠️ No products array found in response');
    }
    
    console.log('🎯 [DEBUG] Products to map:', productsArray.length);
    
    // Now map the extracted array
    return productsArray.map((product: any, index: number) => ({
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
    console.error('❌ [ERROR] Critical Fetch Error:', error);
    return []; 
  }
}

export default async function ProductsPage() {
  console.log('🚀 ProductsPage rendering...');
  const products = await getProducts();
  
  console.log('📊 ProductsPage received:', products.length, 'products');

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold !text-[#2D3B29]">
            Our Products ({products.length})
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
          <p className="text-sm text-gray-400 mt-2">
            Check browser console for API response details
          </p>
        </div>
      ) : (
        <>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-blue-700 font-bold mr-2">✅ Connected to Backend</span>
              <span className="text-sm text-blue-600">
                Showing {products.length} products from {API_BASE_URL}
              </span>
            </div>
          </div>
          <ProductList products={products} />
        </>
      )}
    </div>
  );
}