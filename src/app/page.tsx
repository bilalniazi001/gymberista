import Header from "@/components/UI-UX/common/Header";
import HeroSection from "@/components/UI-UX/common/HeroSection";
import FeaturedProducts from "@/components/UI-UX/common/FeaturedProducts";
import ExclusiveItems from "@/components/UI-UX/common/ExclusiveItems";
import TestimonialSection from "@/components/UI-UX/common/Testimonial";
import ProductCategoryQueue from "@/components/UI-UX/common/ProductCategoryQueue";
import Footer from "@/components/UI-UX/common/Footer";

async function getData() {
  try {
    const [exclusiveRes, featuredRes] = await Promise.all([
      fetch('api/data/products?isExclusive=true'),
      fetch('api/data/products?isFeatured=true')
    ]);
    
    return {
      exclusive: await exclusiveRes.json(),
      featured: await featuredRes.json()
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      exclusive: [],
      featured: []
    };
  }
}

export default async function Home() {
  const data = await getData();
  
  return (
    <div className="bg-gray-200 h-auto">
      <Header/>
      <HeroSection />
      <ProductCategoryQueue /> 
      <FeaturedProducts />
      <ExclusiveItems initialData={data.exclusive} />
      <TestimonialSection />
      <Footer/>
    </div>
  );
}