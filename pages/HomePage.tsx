
import React from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/Layout/PageContainer';
import { Button } from '../components/Common/Button';
import { useAuth } from '../hooks/useAuth';
import { ROUTE_PATHS } from '../constants';

export const HomePage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <PageContainer>
      <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-lg">
        <img src="https://picsum.photos/seed/moneythrift/300/200" alt="Savings Illustration" className="mx-auto mb-8 rounded-lg shadow-lg w-full max-w-md" />
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          Welcome to <span className="text-primary">MoneyThriftManager</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
          Your smart solution for disciplined savings. Manage locked funds, emergency reserves, and flexible savings all in one place.
        </p>
        <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          {currentUser ? (
            <Link to={ROUTE_PATHS.DASHBOARD}>
              <Button variant="primary" size="lg">Go to Dashboard</Button>
            </Link>
          ) : (
            <>
              <Link to={ROUTE_PATHS.REGISTER}>
                <Button variant="primary" size="lg">Get Started</Button>
              </Link>
              <Link to={ROUTE_PATHS.LOGIN}>
                <Button variant="ghost" size="lg" className="text-primary border-primary hover:bg-primary/10">Login</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Locked Savings</h3>
            <p className="text-gray-600">Commit to long-term goals with fixed maturity dates.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
             <div className="text-secondary mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Emergency Funds</h3>
            <p className="text-gray-600">Build a safety net for unexpected expenses, accessible when needed.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <div className="text-accent mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 4.006 4.006 0 00-3.663-.138 4.006 4.006 0 00-3.7 3.7c-.091 1.21-.137 2.43-.137 3.662a4.006 4.006 0 003.7 3.7c1.21.092 2.43.137 3.662.137a4.006 4.006 0 003.7-3.7c.093-1.21.138-2.43.138-3.662z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Flexible Savings</h3>
            <p className="text-gray-600">Save at your own pace with easy deposits and withdrawals.</p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
};
