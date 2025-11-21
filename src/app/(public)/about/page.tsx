'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { motion } from 'framer-motion';
import { 
    Mail, 
    Phone, 
    Clock, 
    User, 
    CheckCircle, 
    Leaf, 
    Percent 
} from 'lucide-react'; 

// ✅ Correct image paths - public folder se directly access karein
const aboutBannerImg = "/Images/prod-14.jpg";
const teamMember1 = "/Images/Persona.png";

const TEAM_DATA = [
    { name: 'Samuel Alexander', role: 'Founder & CEO', image: teamMember1, phone: '+258 3692 2569' },
];

const STATS_DATA = [
    { value: '60M+', label: 'Happy Customers' },
    { value: '105M+', label: 'Grocery Products' },
    { value: '80K+', label: 'Active Sellers' },
    { value: '60K+', label: 'Stores Worldwide' },
];

// --- FLASH SALE TIMER LOGIC MODIFICATION ---
// A more realistic calculation for a short-term sale (e.g., 7 days from today)
const calculateTimeLeft = (targetDate: Date) => {
  let difference = +targetDate - +new Date(); 
  let timeLeft: { [key: string]: number } = {
    days: 0,
    hours: 0, 
    minutes: 0,
    seconds: 0
  }; 

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }
  return timeLeft;
};

const FlashSaleTimer: React.FC = () => {
    // Set target date to 7 days from when the component mounts
    const [targetDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
    });
    
    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = Object.keys(timeLeft).map((interval) => {
        const value = timeLeft[interval as keyof typeof timeLeft];
        // Only show if the value is greater than zero, or if it's seconds and there's still time left
        if (value === 0 && interval !== 'seconds' && timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0) {
            return null;
        }
        return (
            <span key={interval} className="text-sm font-semibold text-white bg-red-600/70 px-2 py-1 rounded mx-1">
                {String(value).padStart(2, '0')} {interval.charAt(0).toUpperCase()}
            </span>
        );
    });

    return (
        <div className="flex items-center text-white text-sm bg-red-600 px-3 py-1 rounded-full shadow-lg">
            <Clock size={16} className="mr-2" />
            <span className="font-bold mr-2">Sale Ends In:</span>
            {timerComponents.some(comp => comp !== null) ? timerComponents : <span className="font-semibold">Time's up!</span>}
        </div>
    );
};
// --- END TIMER MODIFICATION ---

const FeatureCard: React.FC<{ number: string, icon: any, title: string, description: string }> = ({ number, icon: Icon, title, description }) => (
    <div className="p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white text-center">
        <div className="relative inline-block mb-6">
            <span className="absolute top-0 right-0 text-6xl font-extrabold text-gray-100 z-0">{number}</span>
            <div className="relative z-10 w-24 h-24 bg-green-50 flex items-center justify-center rounded-full mx-auto">
                <Icon size={40} className="text-[#629D23]" />
            </div>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

export default function AboutPage() {
  
    return (
        <main>
            <section className="relative h-[450px] bg-gray-800 flex items-center justify-center">
                {/* Image: fill is appropriate here */}
                <Image
                    src={aboutBannerImg} 
                    alt="Grocery store background"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="opacity-50"
                    priority
                />
                <div className="relative z-10 text-center text-white p-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                        Do You Want To Know Us?
                    </h1>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consequat pretium metus, eu 
                        dapibus lacus feugiat lacinia et. Proin tempus pariatur suscipit...
                    </p>
                    <button className="bg-[#629D23] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#2D3B29] transition">
                        Contact Us
                    </button> 

                    <div className="mt-8 flex justify-center items-center">
                        <FlashSaleTimer />
                    </div>
                </div>
            </section>
            
            <div className="relative z-20 py-8 bg-white shadow-xl -mt-16 mx-auto max-w-6xl rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200">
                    {STATS_DATA.map((stat, index) => (
                        <div key={index} className="text-center p-4">
                            <h3 className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</h3>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                            Why You Choose Us?
                        </h2>
                        <p className="text-gray-500 max-w-xl mx-auto">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut consequat pretium metus, eu 
                            dapibus lacus feugiat lacinia et. Proin tempus pariatur suscipit...
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            number="01" 
                            icon={Leaf} 
                            title="Organic Food Services" 
                            description="When an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        />
                        <FeatureCard 
                            number="02" 
                            icon={Percent} 
                            title="Best Prices & Discounts" 
                            description="When an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        />
                        <FeatureCard 
                            number="03" 
                            icon={CheckCircle} 
                            title="Quality Assurance" 
                            description="When an unknown printer took a galley of type and scrambled it to make a type specimen book." 
                        />
                    </div>
                </div>
            </section>
            
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-12">
                        Meet Our Expert Team
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">
                        {TEAM_DATA.map((member, index) => (
                            <div key={index} className="text-center bg-white p-4 shadow-md rounded-lg max-w-[250px] w-full">
                                {/* ✅ FIXED: Image with explicit width/height and 'cover' objectFit */}
                                <div className="relative w-48 h-48 mx-auto mb-4 rounded-xl overflow-hidden">
                                    <Image
                                        src={member.image} 
                                        alt={member.name}
                                        width={192} // 48 * 4 (tailwind w-48)
                                        height={192} // 48 * 4 (tailwind h-48)
                                        style={{ objectFit: 'cover' }}
                                        className="rounded-xl"
                                    />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">{member.name}</h4>
                                <p className="text-sm text-gray-500 mb-3">{member.role}</p>
                                <div className="flex items-center justify-center text-[#629D23] text-sm">
                                    <Phone size={14} className="mr-1" />
                                    <span>{member.phone}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-10 text-center">
                        Customer Feedbacks
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <div className="p-6 border border-gray-200 shadow-sm rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    {/* ✅ FIXED: Avatar image with explicit width/height */}
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image 
                                            src={teamMember1} 
                                            alt="Andrew D. Smith" 
                                            width={40} // w-10 in tailwind is 40px
                                            height={40} // h-10 in tailwind is 40px
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Andrew D. Smith</p>
                                        <p className="text-sm text-gray-500">Manager</p>
                                    </div>
                                </div>
                                <span className="text-green-500 font-bold">posthill</span>
                            </div>
                            <blockquote className="text-gray-600 italic text-sm">
                                &ldquo;According to the council of supply chain professionals, the second of 
                                logistics encompasses transportation is the process of planning, 
                                implementing and controlling procedures.&rdquo;
                            </blockquote>
                        </div>
                        <div className="p-6 border border-gray-200 shadow-sm rounded-lg">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center space-x-3">
                                    {/* ✅ FIXED: Avatar image with explicit width/height */}
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image 
                                            src={teamMember1} 
                                            alt="Andrew D. Smith" 
                                            width={40}
                                            height={40}
                                            style={{ objectFit: 'cover' }}
                                            className="rounded-full"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Andrew D. Smith</p>
                                        <p className="text-sm text-gray-500">Manager</p>
                                    </div>
                                </div>
                                <span className="text-green-500 font-bold">posthill</span>
                            </div>
                            <blockquote className="text-gray-600 italic text-sm">
                                &ldquo;According to the council of supply chain professionals, the second of 
                                logistics encompasses transportation is the process of planning, 
                                implementing and controlling procedures.&rdquo;
                            </blockquote>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}