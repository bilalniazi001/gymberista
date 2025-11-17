'use client'; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ✅ JSON Server Compatible Product Type
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
  color: string; // ✅ color field
  onSale: boolean;
  discountPercentage: number;
  isNewArrival: boolean;
  category: string;
  isInStock: boolean;
  isFeatured?: boolean;
  isExclusive?: boolean;
};

const API_BASE_URL = 'api/data/products'; 

interface ProductListProps {
  products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
  const router = useRouter();

  // ✅ Data validation add karein
  if (!products || !Array.isArray(products)) {
    return (
      <div className="overflow-x-auto bg-white rounded-xl shadow-xl p-6 border border-gray-100">
        <h2 className="text-3xl font-bold text-[#2D3B29] mb-6">Product List</h2>
        <p className="text-center text-red-500 py-10">Invalid products data received</p>
      </div>
    );
  }

  const handleDelete = async (id: string, name: string) => { 
    if (!id) {
        alert('Error: Product ID is missing. Cannot delete.');
        return; 
    }
    
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await fetch(`${API_BASE_URL}/${id}`, { 
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (res.ok) {
          alert(`Product "${name}" successfully deleted!`);
          router.refresh(); 
        } else {
            alert(`Error deleting product: ${res.status}. Please check backend logs.`);
        }
      } catch (error) {
        console.error('Delete Error:', error);
        alert('An unexpected error occurred during deletion. See console for details.');
      }
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-xl shadow-xl p-6 border border-gray-100">
      <h2 className="text-3xl font-bold text-[#2D3B29] mb-6 border-b pb-3">Product List</h2>
      
      {/* ✅ Products count show karein */}
      <div className="mb-4 text-sm text-gray-600">
        Total Products: {products.length}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-4">No products found.</p>
          <Link 
            href="/products/add" 
            className="bg-[#629D23] hover:bg-[#2D3B29] text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300 inline-block"
          >
            + Add Your First Product
          </Link>
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">On Sale</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition duration-150">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-10 h-10 rounded-md object-cover mr-3"
                      />
                    )}
                    <span>{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600 font-mono">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-center text-gray-600">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-center">
                  <span className={`inline-flex px-3 py-1 text-xs leading-5 rounded-full ${
                    product.quantityInStock > 50 ? 'bg-green-100 text-green-800' :
                    product.quantityInStock > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {product.quantityInStock} {product.quantityInStock === 1 ? 'unit' : 'units'}
                  </span>
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  <span className={`inline-flex px-3 py-1 text-xs leading-5 font-bold rounded-full ${
                    product.onSale ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {product.onSale ? 'ON SALE' : 'REGULAR'}
                  </span>
                </td>
                
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-center">
                  {product.discountPercentage > 0 ? (
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-bold">
                      -{product.discountPercentage}%
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>

                <td className="px-4 py-3 whitespace-nowrap text-gray-800 text-sm font-medium text-center">
                  <div className="flex items-center justify-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                  </div>
                </td>

                <td className="px-6 py-3 whitespace-nowrap text-center text-sm space-x-3">
  <Link 
    href={`/products/edit/${product.id}`}  // ✅ YEH CHANGE KAREIN
    className="text-indigo-600 hover:text-indigo-800 font-semibold transition duration-150 px-4 py-2 border border-indigo-600 rounded hover:bg-indigo-50"
  >
    Edit
  </Link>
  <button
    onClick={() => handleDelete(product.id, product.name)}
    className="text-red-600 hover:text-red-800 font-semibold transition duration-150 px-3 py-2 border border-red-600 rounded hover:bg-red-50"
  >
    Delete
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}