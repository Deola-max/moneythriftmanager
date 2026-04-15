
import React from 'react';
import { ResetPasswordForm } from '../components/Auth/ResetPasswordForm';
import { PageContainer } from '../components/Layout/PageContainer';

export const ResetPasswordPage: React.FC = () => {
  return (
    <PageContainer>
      <ResetPasswordForm />
    </PageContainer>
  );
};
