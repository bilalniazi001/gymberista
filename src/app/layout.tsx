{/*
import React from 'react'; 
import './globals.css'; 
import Header from '@/components/UI-UX/common/Header';
import HeroSection from '@/components/UI-UX/common/HeroSection';

//import DashboardCard from '@/components/admin/DashboardCard';
interface RootLayoutProps {
  children: React.ReactNode; 
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <DashboardCard/>
        <Header/>
        <HeroSection/>
        {children}
      </body>
    </html>
  );
}

*/}

// File: app/layout.tsx
import React from 'react'; 
import './globals.css';
// Zaroori: Public Navbar (Header) yahan import hoga
//import Header from '@/components/UI-UX/common/Header'; 
//import Footer from '@/components/UI-UX/common/Footer';
import { AuthProvider } from '@/context/AuthContext';

interface RootLayoutProps {
  children: React.ReactNode; 
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <>
        {/* Yahan Public Header/Navbar hamesha show hoga (Admin Panel ko chhod kar) */}
         
        
                
        {/* Children (app/page.tsx, /contact/page.tsx, etc.) yahan aayenge */}
        <AuthProvider>
          {children}
        </AuthProvider>
        </>
      </body>
    </html>
  );
}
