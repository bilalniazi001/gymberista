// app/products/[productId]/ProductDetailClient.tsx
'use client';
import React from 'react';
import { Star, ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  imageUrl: string;
  description: string;
}

interface ProductDetailClientProps {
  product: Product | null;
}

const ProductDetailClient: React.FC<ProductDetailClientProps> = ({ product }) => {
  const handleWhatsAppShare = () => {
    if (!product) return;

    const whatsappNumber = '923045335175'; 
    
    const productUrl = `${window.location.origin}/product/${product.id}`;
    const message = ` *Product Inquiry*\n\n` +
                   `*Product Name:* ${product.name}\n` +
                   `*Price:* $${product.price.toFixed(2)}\n` +
                   `*Category:* ${product.category}\n` +
                   `*Rating:* ${product.rating}/5\n\n` +
                   `*Description:* ${product.description.substring(0, 150)}...\n\n` +
                   `*Product Link:* ${productUrl}\n\n` +
                   `Hello! I'm interested in this product. Please provide more details.`;

    const encodedMessage = encodeURIComponent(message);
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-8">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">404</h1>
        <p className="text-xl text-[#2D3B29] mb-6">Sorry, There is no product.</p>
        <Link 
          href="/product" 
          className="flex items-center text-[#629D23] hover:text-lime-700 transition-colors font-medium"
        >
          <ArrowLeft size={20} className="mr-2"/> Go To Listing Page.
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-10 lg:p-16 font-sans">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500">
        
        {/* Back Button */}
        <div className="p-6">
          <Link 
            href="/product" 
            className="flex items-center text-[#629D23] hover:text-lime-700 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2"/> Back
          </Link>
        </div>

        {/* Product Detail Layout */}
        <div className="p-6 md:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Left Column: Product Image */}
          <div className="relative overflow-hidden rounded-xl shadow-xl border border-gray-100 bg-white flex items-center justify-center p-8">
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="max-w-full max-h-96 object-contain transition-transform duration-500 hover:scale-105"
              onError={(e) => {
                e.currentTarget.src = `https://placehold.co/600x400/4f46e5/ffffff?text=${product.name}`;
              }}
            />
          </div>

          {/* Right Column: Product Details */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category */}
              <span className="inline-block bg-lime-100 text-[#629D23] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {product.category}
              </span>

              {/* Product Name */}
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#2D3B29] mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center text-yellow-500 mb-6">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    size={24} 
                    fill={i < Math.floor(product.rating) ? "currentColor" : "none"} 
                    className="mr-1" 
                    strokeWidth={i < Math.floor(product.rating) ? 0 : 2}
                  />
                ))}
                <span className="ml-3 text-xl font-bold text-[#2D3B29]">
                  {product.rating.toFixed(1)}/5
                </span>
              </div>
              
              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-[#629D23] tracking-tight">
                  ${product.price.toFixed(2)}
                </p>
                <span className="text-sm text-gray-400 font-medium">Inclusive of all taxes</span>
              </div>

              {/* Product Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#2D3B29] mb-3 border-b pb-2">
                  Product Description
                </h2>
                <p className="text-[#2D3B29] leading-relaxed text-lg">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6 pt-4 border-t border-gray-100">
              {/* Add to Cart Button */}
              <button className="flex-1 flex items-center justify-center bg-[#629D23] text-white py-4 rounded-full font-bold text-lg hover:bg-lime-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
                <ShoppingCart size={24} className="mr-3"/>
                Add to Cart
              </button>
              
              <button 
                onClick={handleWhatsAppShare}
                className="p-4 bg-green-100 text-green-600 rounded-full hover:bg-green-200 hover:text-green-700 transition-colors duration-300 shadow-md flex items-center justify-center"
                title="Share on WhatsApp"
              >
                {/* WhatsApp Icon SVG */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.452"/>
                </svg>
              </button>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 text-center">
                <strong>Quick Inquiry:</strong> Click WhatsApp button to contact manager directly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailClient;