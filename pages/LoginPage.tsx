
import React from 'react';
import { LoginForm } from '../components/Auth/LoginForm';
import { PageContainer } from '../components/Layout/PageContainer';

export const LoginPage: React.FC = () => {
  return (
    <PageContainer>
      <LoginForm />
    </PageContainer>
  );
};
