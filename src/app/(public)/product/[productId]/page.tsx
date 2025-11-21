// app/products/[productId]/page.tsx
import ProductDetailClient from './ProductDetailClient';

//  Complete Product Interface
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  description: string;
  cost?: number;
  quantityInStock?: number;
  size?: string;
  color?: string;
  onSale?: boolean;
  discountPercentage?: number;
  isNewArrival?: boolean;
  isInStock?: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
}

async function getProduct(productId: string): Promise<Product | null> {
  try {
    console.log(' [PRODUCT DETAIL] Fetching product with ID:', productId);
    console.log(' [PRODUCT DETAIL] API URL:', `http://localhost:5000/products/${productId}`);
    
    const res = await fetch(`http://localhost:5000/products/${productId}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(' [PRODUCT DETAIL] Response status:', res.status);
    console.log(' [PRODUCT DETAIL] Response ok:', res.ok);
    
    if (!res.ok) {
      console.error(` [PRODUCT DETAIL] Error fetching product: ${res.status} ${res.statusText}`);
      
      //  Detailed error information
      try {
        const errorText = await res.text();
        console.error(' [PRODUCT DETAIL] Error response:', errorText);
        
        //  Parse JSON error if possible
        try {
          const errorJson = JSON.parse(errorText);
          console.error(' [PRODUCT DETAIL] Parsed error:', errorJson);
        } catch (parseError) {
          console.error(' [PRODUCT DETAIL] Error response is not JSON');
        }
      } catch (e) {
        console.error(' [PRODUCT DETAIL] Could not read error response');
      }
      
      return null;
    }

    const productData = await res.json();
    console.log(' [PRODUCT DETAIL] Product data received:', productData);
    console.log(' [PRODUCT DETAIL] Product ID from API:', productData.id);
    console.log(' [PRODUCT DETAIL] Product name from API:', productData.name);
    console.log(' [PRODUCT DETAIL] Product has _id:', !!productData._id);
    
    //  Data mapping with proper error handling and defaults
    const mappedProduct: Product = {
      id: productData.id || productData._id?.toString() || productId,
      name: productData.name || 'Unknown Product',
      category: productData.category || 'Uncategorized',
      price: typeof productData.price === 'number' ? productData.price : 0,
      rating: typeof productData.rating === 'number' ? productData.rating : 0,
      imageUrl: productData.imageUrl || '',
      description: productData.description || 'No description available',
      cost: typeof productData.cost === 'number' ? productData.cost : 0,
      quantityInStock: typeof productData.quantityInStock === 'number' ? productData.quantityInStock : 0,
      size: productData.size || 'One Size',
      color: productData.color || '',
      onSale: Boolean(productData.onSale),
      discountPercentage: typeof productData.discountPercentage === 'number' ? productData.discountPercentage : 0,
      isNewArrival: Boolean(productData.isNewArrival),
      isInStock: productData.isInStock !== undefined ? Boolean(productData.isInStock) : true,
      isFeatured: Boolean(productData.isFeatured),
      isExclusive: Boolean(productData.isExclusive),
    };

    console.log(' [PRODUCT DETAIL] Mapped product:', mappedProduct);
    return mappedProduct;
  } catch (error) {
    console.error(' [PRODUCT DETAIL] Network error fetching product:', error);
    return null;
  }
}

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let productId: string;
  
  try {
    const resolvedParams = await params;
    productId = resolvedParams.productId;
    console.log(' [PRODUCT DETAIL] Page loaded with productId:', productId);
    console.log(' [PRODUCT DETAIL] ProductId type:', typeof productId);
  } catch (error) {
    console.error(' [PRODUCT DETAIL] Error resolving params:', error);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-6">
            There was an error loading the page parameters.
          </p>
          <a 
            href="/product" 
            className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-block"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }
  
  if (!productId || productId === 'undefined') {
    console.error(' [PRODUCT DETAIL] Invalid product ID received:', productId);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Product ID</h1>
          <p className="text-gray-600 mb-6">
            Product ID is missing or invalid: "{productId}"
          </p>
          <a 
            href="/product" 
            className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300 inline-block"
          >
            ← Back to Products
          </a>
        </div>
      </div>
    );
  }

  console.log(' [PRODUCT DETAIL] Calling getProduct with ID:', productId);
  const product = await getProduct(productId);

  if (!product) {
    console.error(' [PRODUCT DETAIL] Product not found for ID:', productId);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4"></div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">
            The product with ID <strong>"{productId}"</strong> doesn't exist or has been deleted.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check the product ID and try again.
          </p>
          <div className="space-y-3">
            <a 
              href="/product" 
              className="block bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              ← Back to Products
            </a>
            <a 
              href="/" 
              className="block border border-[#629D23] text-[#629D23] hover:bg-[#629D23] hover:text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
            >
              Go to Homepage
            </a>
          </div>
        </div>
      </div>
    );
  }

  console.log(' [PRODUCT DETAIL] Product successfully loaded:', product.name);
  console.log(' [PRODUCT DETAIL] Final product data for form:', product);

  return <ProductDetailClient product={product} />;
}