
import React from 'react';
import { PageContainer } from '../components/Layout/PageContainer';
import { EditProfileForm } from '../components/Profile/EditProfileForm';
import { ChangePasswordForm } from '../components/Profile/ChangePasswordForm';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from '../components/Common/Spinner';

export const ProfilePage: React.FC = () => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <PageContainer title="Profile"><Spinner size="lg" /></PageContainer>;
  }

  if (!currentUser) {
     return <PageContainer title="Profile"><p>User not found. Please log in.</p></PageContainer>;
  }


  return (
    <PageContainer title="Your Profile">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <EditProfileForm />
        </div>
        <div>
          <ChangePasswordForm />
        </div>
      </div>
       <div className="mt-8 p-6 bg-white rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
          <dl className="divide-y divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.fullName}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Email address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.email}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">Member Since</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{new Date(currentUser.createdAt).toLocaleDateString()}</dd>
            </div>
             <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-gray-500">User ID (Simulation)</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{currentUser.id}</dd>
            </div>
          </dl>
        </div>
    </PageContainer>
  );
};
