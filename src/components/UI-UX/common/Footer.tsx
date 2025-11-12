'use client';

import React from 'react';
import { Mail, Phone, Clock, DollarSign, RefreshCw, Headset, Percent } from 'lucide-react';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
// Note: GooglePlay and Apple are placeholders, as lucide-react doesn't have direct icons. 
// For real app download links, you'd use your actual icons or SVG.

// --- DATA ---

const FEATURE_DATA = [
  { icon: DollarSign, title: 'Best Prices & Offers', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
  { icon: RefreshCw, title: '100% Return Policy', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
  { icon: Headset, title: 'Support 24/7', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
  { icon: Percent, title: 'Great Offer Daily Deal', desc: 'We prepared special discounts you on grocery products.', color: 'text-green-600' },
];

const QUICK_LINKS = [
  { title: 'Our Stores', links: ['Delivery Information', 'Privacy Policy', 'Terms & Conditions', 'Support Center', 'Careers'] },
  { title: 'Shop Categories', links: ['Contact Us', 'Information', 'About Us', 'Careers', 'Next Stories'] },
  { title: 'Useful Links', links: ['Cancellation & Returns', 'Report Infringement', 'Payments', 'Shipping', 'FAQ'] },
];

// --- COMPONENTS ---

/**
 * Single Feature Item
 */
const FeatureItem: React.FC<{ icon: any, title: string, desc: string }> = ({ icon: Icon, title, desc }) => (
  <div className="flex items-start space-x-4">
    {/* Icon with light background, matching the design */}
    <div className="flex-shrink-0 w-12 h-12 bg-white/30 rounded-full flex items-center justify-center p-2">
      <Icon size={24} className="text-white" />
    </div>
    <div className="text-white">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm opacity-90">{desc}</p>
    </div>
  </div>
);

/**
 * Main Footer Component
 */
export default function Footer() {
  
  const GREEN_COLOR = 'bg-[#629D23]'; // Design se match karta hua green color
  const LIGHT_BG = 'bg-gray-50';
  const BORDER_COLOR = 'border-gray-200';
  const TEXT_COLOR = 'text-[#629D23]';
  const HOVER_COLOR = 'text-[#2D3B29]'

  return (
    <footer className="w-full">

      {/* 1. Top Bar (Features Section) - Green Background */}
      <div className={`${GREEN_COLOR} py-8 md:py-10`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURE_DATA.map((item, index) => (
              <FeatureItem key={index} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Content Section */}
      <div className={`${LIGHT_BG} py-12 md:py-16`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-10 lg:gap-8">

            {/* Column 1: About Company */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">About Company</h3>
              <ul className="space-y-3 text-sm">
                <li className={TEXT_COLOR}>Have Question? Call Us 24/7</li>
                <li className="text-xl font-bold text-green-600 mb-4">+258 3692 2569</li>

                <li className={TEXT_COLOR}>Monday - Friday: <span className="font-semibold">8:00am - 6:00pm</span></li>
                <li className={TEXT_COLOR}>Saturday: <span className="font-semibold">8:00am - 6:00pm</span></li>
                <li className={TEXT_COLOR}>Sunday: <span className="font-semibold text-red-600">Service Close</span></li>
              </ul>
            </div>

            {/* Columns 2, 3, 4: Quick Links */}
            {QUICK_LINKS.map((section, index) => (
              <div key={index} className="col-span-1">
                <h3 className="text-lg font-bold text-gray-800 mb-4">{section.title}</h3>
                <ul className="space-y-3 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex} className={`hover:${TEXT_COLOR} transition duration-150 cursor-pointer`}>
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Column 5: Our Newsletter */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Our Newsletter</h3>
              <p className={`text-sm ${HOVER_COLOR} mb-4`}>
                Subscribe to the mailing list to receive updates one the new arrivals and other discounts
              </p>
              
              {/* Newsletter Input */}
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="p-3 w-full border border-gray-300  !focus:ring-[#629D23] !focus:border-[#629D23]"
                />
                <button className={`p-3 text-white font-semibold  ${GREEN_COLOR}  transition`}>
                  Subscribe
                </button>
              </div>

              {/* Checkbox/Wording (Approximate matching the design) */}
              <label className="flex items-center mt-3 text-sm">
                <input type="checkbox" className="form-checkbox text-green-600 w-4 h-4 rounded" defaultChecked />
                <span className={`ml-2 ${TEXT_COLOR}`}>I would like to receive news and special offer</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar (Copyright and Payments) */}
      <div className="bg-white py-4 border-t border-gray-100">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          
          {/* Left: Social Icons */}
          <div className="flex items-center space-x-6 order-2 md:order-1 mt-4 md:mt-0">
            <span className="font-semibold">Follow Us:</span>
            <div className="flex space-x-3">
              <Twitter size={20} className="hover:text-green-600 cursor-pointer" />
              <Facebook size={20} className="hover:text-green-600 cursor-pointer" />
              <Instagram size={20} className="hover:text-green-600 cursor-pointer" />
              <Youtube size={20} className="hover:text-green-600 cursor-pointer" />
            </div>
          </div>
          
          {/* Center: Copyright */}
          <p className="order-3 md:order-2 mt-4 md:mt-0">
            Copyright 2023 | **&copy;Ekomart**. All rights reserved.
          </p>
          
          {/* Right: Payments and Apps */}
          <div className="flex flex-col sm:flex-row items-center space-x-4 order-1 md:order-3">
            <div className="flex items-center space-x-2">
                <span className="font-semibold">Payment Accepts:</span>
                {/* Payment Icons Placeholder */}
                <div className="flex space-x-1">
                    {/*  */}
                </div>
            </div>
            
            <div className="flex items-center space-x-2 mt-3 sm:mt-0">
                <span className="font-semibold">Download App:</span>
                {/* App Download Icons Placeholder */}
                <div className="flex space-x-2">
                    {/*  */}
                </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}