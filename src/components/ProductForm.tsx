'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ✅ UPDATED: NestJS Backend URL
const API_BASE_URL = 'http://localhost:5000'; 

// --- TYPE DEFINITIONS ---
export interface Product { 
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
}

export interface ExtendedProduct extends Product {
    id: string; 
}

interface ProductFormProps {
  initialData?: ExtendedProduct;
}

type FormDataType = Omit<Product, 'isInStock'>; 

// ✅ Categories - General categories for your e-commerce
const CATEGORIES = ['Protein', 'Pre Workout', 'Weight Gainer', 'Creatine', 'BCAA', 'Fat Burner', 'Performance'];

// ----------------------------------------------------
// --- PRODUCT FORM COMPONENT ---
// ----------------------------------------------------
export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  
  const isEditMode = !!initialData?.id;
  const pageTitle = isEditMode ? 'Edit Product' : 'Add New Product';
  const submitButtonText = isEditMode ? 'Update Product' : 'Create Product';

  // ✅ Debugging
  useEffect(() => {
    console.log('🔧 ProductForm Debug:');
    console.log('   - Mode:', isEditMode ? 'EDIT' : 'ADD');
    console.log('   - Initial Data:', initialData);
    console.log('   - Product ID:', initialData?.id);
    console.log('   - Form Data:', formData);
  }, [isEditMode, initialData]);

  const [formData, setFormData] = useState<FormDataType>(() => {
    return {
      name: initialData?.name || '',
      price: initialData?.price || 0,
      cost: initialData?.cost || 0,
      description: initialData?.description || '',
      imageUrl: initialData?.imageUrl || '', 
      quantityInStock: initialData?.quantityInStock || 0, 
      size: initialData?.size || 'One Size',
      rating: initialData?.rating || 0,
      color: initialData?.color || '', 
      onSale: initialData?.onSale || false,
      discountPercentage: initialData?.discountPercentage || 0,
      isNewArrival: initialData?.isNewArrival || false,
      category: initialData?.category || CATEGORIES[0],
      isFeatured: initialData?.isFeatured || false,
      isExclusive: initialData?.isExclusive || false,
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let finalValue: any = value;
    if (type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
        finalValue = parseFloat(value) || 0;
    }

    setFormData(prev => ({
        ...prev,
        [name]: finalValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        const productDataToSend = {
            ...formData,
            isInStock: formData.quantityInStock > 0, 
        };
        
        // ✅ UPDATED: NestJS backend compatible - PUT for edit, POST for create
        const method = isEditMode ? 'PUT' : 'POST';
        const url = isEditMode ? `${API_BASE_URL}/products/${initialData!.id}` : `${API_BASE_URL}/products`;

        console.log('🔄 Submitting form:', {
          method,
          url,
          data: productDataToSend
        });

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productDataToSend),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        console.log('✅ Form submission successful:', result);

        alert(`Product successfully ${isEditMode ? 'updated' : 'created'}!`);
        
        // ✅ Redirect to admin products list
        router.push('/products');
        router.refresh();

    } catch (err: any) {
        console.error('❌ API Error:', err);
        setError(err.message || 'An unknown error occurred.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
      {/* ✅ Page Title with Mode Indicator */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {pageTitle}
        </h1>
        {isEditMode && (
          <p className="text-sm text-gray-600 mt-2">
            Editing Product: <span className="font-semibold">{initialData?.name}</span>
          </p>
        )}
      </div>
      
      {/* ✅ Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-red-700">×</span>
            </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Name and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Product Name *
            </label>
            <input 
              id="name" 
              name="name" 
              type="text" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g., Whey Protein"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">
              Category *
            </label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-150 ease-in-out text-gray-800"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Price, Cost, and Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
              Selling Price *
            </label>
            <input 
              id="price" 
              name="price" 
              type="number" 
              value={formData.price} 
              onChange={handleChange} 
              required 
              min="0" 
              step="0.01" 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g., 99.99"
            />
          </div>

          <div>
            <label htmlFor="cost" className="block text-sm font-semibold text-gray-700 mb-1">
              Product Cost *
            </label>
            <input 
              id="cost" 
              name="cost" 
              type="number" 
              value={formData.cost} 
              onChange={handleChange} 
              required 
              min="0" 
              step="0.01" 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g., 60.00"
            />
          </div>
          
          <div>
            <label htmlFor="quantityInStock" className="block text-sm font-semibold text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input 
              id="quantityInStock" 
              name="quantityInStock" 
              type="number" 
              value={formData.quantityInStock} 
              onChange={handleChange} 
              required 
              min="0" 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g., 50"
            />
          </div>
        </div>

        {/* Row 3: Image URL */}
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-semibold text-gray-700 mb-1">
            Image URL
          </label>
          <input 
            id="imageUrl" 
            name="imageUrl" 
            type="text" 
            value={formData.imageUrl} 
            onChange={handleChange} 
            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
            placeholder="https://example.com/product-image.jpg"
          />
          {formData.imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 mb-1">Image Preview:</p>
              <img 
                src={formData.imageUrl} 
                alt="Preview" 
                className="h-20 w-20 object-cover rounded border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>
        
        {/* Row 4: Description (Full Width) */}
        <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description *
            </label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={4} 
              required 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800"
              placeholder="Detailed description of the product..."
            />
          </div>

        {/* Row 5: Attributes (Size, Color, Rating) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="size" className="block text-sm font-semibold text-gray-700 mb-1">
              Size/Variant
            </label>
            <input 
              id="size" 
              name="size" 
              type="text" 
              value={formData.size} 
              onChange={handleChange} 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-pink-500 focus:border-pink-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g. 5 lbs"
            />
          </div>

          <div>
            <label htmlFor="color" className="block text-sm font-semibold text-gray-700 mb-1">
              Flavor
            </label>
            <input 
              id="color" 
              name="color" 
              type="text" 
              value={formData.color} 
              onChange={handleChange} 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g Blue Raspberry"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-1">
              Rating (0-5)
            </label>
            <input 
              id="rating" 
              name="rating" 
              type="number" 
              value={formData.rating} 
              onChange={handleChange} 
              min="0" 
              max="5" 
              step="0.1" 
              className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-yellow-500 focus:border-yellow-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
              placeholder="e.g., 4.5"
            />
          </div>
        </div>

        {/* Row 6: Checkboxes - Sale, New Arrival, Featured, Exclusive */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
            <input 
              id="onSale" 
              name="onSale" 
              type="checkbox" 
              checked={formData.onSale} 
              onChange={handleChange} 
              className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="onSale" className="text-sm font-semibold text-gray-700 flex items-center">
              On Sale
            </label>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
            <input 
              id="isNewArrival" 
              name="isNewArrival" 
              type="checkbox" 
              checked={formData.isNewArrival} 
              onChange={handleChange} 
              className="h-5 w-5 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
            />
            <label htmlFor="isNewArrival" className="text-sm font-semibold text-gray-700 flex items-center">
              New Arrival
            </label>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
            <input 
              id="isFeatured" 
              name="isFeatured" 
              type="checkbox" 
              checked={formData.isFeatured} 
              onChange={handleChange} 
              className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700 flex items-center">
              Featured
            </label>
          </div>

          <div className="flex items-center space-x-3 p-3 border border-gray-300 rounded-lg shadow-sm bg-white">
            <input 
              id="isExclusive" 
              name="isExclusive" 
              type="checkbox" 
              checked={formData.isExclusive} 
              onChange={handleChange} 
              className="h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <label htmlFor="isExclusive" className="text-sm font-semibold text-gray-700 flex items-center">
              Exclusive
            </label>
          </div>
        </div>

        {/* Row 7: Discount Percentage (Conditional) */}
        {formData.onSale && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="discountPercentage" className="block text-sm font-semibold text-gray-700 mb-1">
                Discount Percentage *
              </label>
              <input 
                id="discountPercentage" 
                name="discountPercentage" 
                type="number" 
                value={formData.discountPercentage} 
                onChange={handleChange} 
                min="0" 
                max="100" 
                required
                className="mt-1 block w-full px-4 py-2.5 border border-red-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 transition duration-150 ease-in-out placeholder-gray-400 text-gray-800" 
                placeholder="e.g., 15"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter discount percentage (0-100)
              </p>
            </div>
            
            {/* Discount Calculation Preview */}
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">Discount Preview</h4>
              <p className="text-sm text-gray-700">
                Original Price: <span className="line-through">${formData.price.toFixed(2)}</span>
              </p>
              <p className="text-sm text-gray-700">
                Discount: <span className="text-red-600 font-bold">-{formData.discountPercentage}%</span>
              </p>
              <p className="text-lg font-bold text-green-700 mt-1">
                Final Price: ${(formData.price * (1 - formData.discountPercentage / 100)).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Submit and Cancel Buttons */}
        <div className="pt-4 flex space-x-4">
          <button
            type="button"
            onClick={() => router.push('/products')}
            className="flex-1 bg-[#2D3B29] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-gradient-to-r from-[#629D23] to-[#4c781d] text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-0.5 hover:scale-100 ${
              isLoading ? 'opacity-60 cursor-not-allowed' : ''
            } focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {isEditMode ? 'Updating...' : 'Creating...'}
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  );
}