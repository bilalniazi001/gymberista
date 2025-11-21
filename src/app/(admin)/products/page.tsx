// app/admin/products/page.tsx

import Link from 'next/link';
import ProductList from '@/components/ProductList'; 

//  CORRECTED: flavor -> color change kiya (db.json ke according)
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
  color: string; // CHANGE: flavor -> color
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
  isInStock: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
};

const API_BASE_URL = 'http://localhost:5000/products'; 

// Data Fetching Function (Next.js Server Component)
async function getProducts(): Promise<Product[]> {
  try {
    console.log(' [ADMIN PRODUCTS PAGE] Fetching products from:', API_BASE_URL);
        const res = await fetch(API_BASE_URL, { 
      cache: 'no-store', 
    });

    console.log(' [ADMIN PRODUCTS PAGE] Response status:', res.status);
    console.log(' [ADMIN PRODUCTS PAGE] Response ok:', res.ok);

    if (!res.ok) {
      console.error(` [ADMIN PRODUCTS PAGE] Error fetching products: ${res.status} ${res.statusText}`);
      return []; 
    }

    const products = await res.json();
    console.log(' [ADMIN PRODUCTS PAGE] Raw products data received:', products);
    
    //  FIX: Proper ID mapping for NestJS backend
    const validatedProducts = products.map((product: any, index: number) => {
      // Pehle product.id check karein, agar nahi hai to _id ya MongoDB ID use karein
      const productId = product.id || product._id?.toString() || `temp-${index + 1}`;
      
      console.log(`🔍 [ADMIN PRODUCTS PAGE] Product ${index} ID mapping:`, {
        originalId: product.id,
        mongoId: product._id,
        finalId: productId
      });
      
      return {
        id: productId.toString(), // Ensure string ID
        name: product.name || '',
        price: product.price || 0,
        cost: product.cost || 0,
        description: product.description || '',
        imageUrl: product.imageUrl || '',
        quantityInStock: product.quantityInStock || 0,
        size: product.size || 'One Size',
        rating: product.rating || 0,
        color: product.color || '', // color field
        onSale: product.onSale || false,
        discountPercentage: product.discountPercentage || 0,
        isNewArrival: product.isNewArrival || false,
        category: product.category || 'Uncategorized',
        isInStock: product.isInStock !== undefined ? product.isInStock : (product.quantityInStock > 0),
        isFeatured: product.isFeatured || false,
        isExclusive: product.isExclusive || false,
      };
    });

    console.log(' [ADMIN PRODUCTS PAGE] Validated products:', validatedProducts);
    return validatedProducts;

  } catch (error) {
    console.error(' [ADMIN PRODUCTS PAGE] Network or unknown error fetching products list:', error);
    return []; 
  }
}

// Page Component (Server Component)
export default async function AdminProductsPage() {
  const products = await getProducts();

  // Debugging ke liye
  console.log(' [ADMIN PRODUCTS PAGE] Final products count:', products.length);
  console.log(' [ADMIN PRODUCTS PAGE] First product ID:', products[0]?.id);
  console.log(' [ADMIN PRODUCTS PAGE] All products:', products);

  return (
    <div className="p-6 md:p-10 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-4xl font-extrabold !text-[#2D3B29]">
            Product Management
        </h1>
        <Link 
          href="/products/add"  //  CORRECTED: Admin route
          className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
          + Add New Product
        </Link>
      </div>
      
      {/*  Debugging info show karein */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Debug Information:</h3>
        <p className="text-sm text-blue-700">
          Total Products: <strong>{products.length}</strong> | 
          First Product ID: <strong>{products[0]?.id || 'No products'}</strong> |
          First Product Name: <strong>{products[0]?.name || 'No products'}</strong>
        </p>
        {/*  Additional debug info */}
        {products.length > 0 && (
          <div className="mt-2 text-xs">
            <p><strong>Sample Product IDs:</strong></p>
            {products.slice(0, 3).map((product, index) => (
              <p key={index}>- {product.name}: {product.id} (Type: {typeof product.id})</p>
            ))}
          </div>
        )}
      </div>
      
      <ProductList products={products} />
    </div>
  );
}