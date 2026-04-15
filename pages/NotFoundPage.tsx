
import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/Layout/PageContainer';
import { Button } from '../components/Common/Button';
import { ROUTE_PATHS } from '../constants';

export const NotFoundPage: React.FC = () => {
  return (
    <PageContainer title="Page Not Found">
      <div className="text-center">
        <img src="https://picsum.photos/seed/404page/300/200" alt="Lost astronaut" className="mx-auto mb-8 rounded-lg shadow-lg" />
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-gray-500 mb-8">
          It might have been moved, deleted, or perhaps you mistyped the URL.
        </p>
        <Link to={ROUTE_PATHS.HOME}>
          <Button variant="primary" size="lg">Go to Homepage</Button>
        </Link>
      </div>
    </PageContainer>
  );
};
