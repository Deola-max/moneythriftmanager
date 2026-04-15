
import React, { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  title?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({ children, title }) => {
  return (
    <main className="flex-grow">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {title && (
          <header className="mb-6">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">{title}</h1>
          </header>
        )}
        <div className="px-4 py-6 sm:px-0 bg-white shadow-lg rounded-lg">
          {children}
        </div>
      </div>
    </main>
  );
};
