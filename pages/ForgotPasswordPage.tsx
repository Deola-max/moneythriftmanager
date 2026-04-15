
import React from 'react';
import { ForgotPasswordForm } from '../components/Auth/ForgotPasswordForm';
import { PageContainer } from '../components/Layout/PageContainer';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <PageContainer>
      <ForgotPasswordForm />
    </PageContainer>
  );
};
