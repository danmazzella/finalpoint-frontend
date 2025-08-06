'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      // Redirect to login page after logout
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600">Manage your account</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Profile Information */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center">
                  <span className="text-pink-600 font-bold text-xl">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="text-xl font-medium text-gray-900">{user?.name}</h4>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Edit Profile</p>
                      <p className="text-sm text-gray-500">Update your name and email</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your password</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Notification Settings</p>
                      <p className="text-sm text-gray-500">Manage your notifications</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* App Information */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">App Information</h3>
              <div className="space-y-4">
                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">About FinalPoint</p>
                      <p className="text-sm text-gray-500">Learn more about the app</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Privacy Policy</p>
                      <p className="text-sm text-gray-500">Read our privacy policy</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Terms of Service</p>
                      <p className="text-sm text-gray-500">Read our terms of service</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Help & Support</p>
                      <p className="text-sm text-gray-500">Get help and support</p>
                    </div>
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>

          {/* App Version */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">FinalPoint v1.0.0</p>
            <p className="text-xs text-gray-400 mt-1">F1 P10 Prediction League</p>
          </div>
        </div>
      </main>
    </div>
  );
} 