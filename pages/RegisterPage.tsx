
import React from 'react';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { PageContainer } from '../components/Layout/PageContainer';

export const RegisterPage: React.FC = () => {
  return (
    <PageContainer>
      <RegisterForm />
    </PageContainer>
  );
};
