import Header from "@/components/UI-UX/common/Header";
import HeroSection from "@/components/UI-UX/common/HeroSection";
import FeaturedProducts from "@/components/UI-UX/common/FeaturedProducts";
import ExclusiveItems from "@/components/UI-UX/common/ExclusiveItems";
import TestimonialSection from "@/components/UI-UX/common/Testimonial";
import ProductCategoryQueue from "@/components/UI-UX/common/ProductCategoryQueue";
import Footer from "@/components/UI-UX/common/Footer";

export default async function Home() {
  return (
    <div className="bg-gray-200 h-auto">
      <Header/>
      <HeroSection />
      <ProductCategoryQueue /> 
      <FeaturedProducts /> {/* ✅ No initialData prop */}
      <ExclusiveItems/>
      <TestimonialSection />
      <Footer/>
    </div>
  );
}