'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#629D23]"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            My Account
          </h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-[#629D23] text-white p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-green-100">{user.email}</p>
                  <p className="text-green-100 bg-green-800 bg-opacity-50 px-2 py-1 rounded-full text-sm inline-block mt-1">
                    {user.role.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Full Name
                  </label>
                  <p className="text-gray-800 font-semibold">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Age
                  </label>
                  <p className="text-gray-800 font-semibold">{user.age} years</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <p className="text-gray-800 font-semibold">{user.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Phone
                  </label>
                  <p className="text-gray-800 font-semibold">{user.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    CNIC
                  </label>
                  <p className="text-gray-800 font-semibold">{user.cnic}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nationality
                  </label>
                  <p className="text-gray-800 font-semibold">{user.nationality}</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Address
                  </label>
                  <p className="text-gray-800 font-semibold">{user.address}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    City
                  </label>
                  <p className="text-gray-800 font-semibold">{user.city}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Country
                  </label>
                  <p className="text-gray-800 font-semibold">{user.country}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Postal Code
                  </label>
                  <p className="text-gray-800 font-semibold">{user.postalCode}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Member Since
                  </label>
                  <p className="text-gray-800 font-semibold">
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}