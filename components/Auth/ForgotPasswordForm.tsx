
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../constants';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';

export const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<AlertMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsLoading(true);
    try {
      const token = await forgotPassword(email);
      if (token) {
        setMessage({id:'forgot-success', type: 'success', message: `If an account with email ${email} exists, a password reset link has been (simulated) sent. Token: ${token}`});
      } else {
        setMessage({id:'forgot-notfound', type: 'warning', message: `If an account with email ${email} exists, a password reset link has been (simulated) sent.`}); // Generic message for security
      }
    } catch (err: any) {
      setMessage({id:'forgot-error', type: 'error', message: err.message || 'An error occurred. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
      {message && <Alert alert={message} onDismiss={() => setMessage(null)} />}
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your account email"
        />
        <Button type="submit" isLoading={isLoading} fullWidth variant="primary" className="mt-2">
          Send Reset Link
        </Button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Remembered your password?{' '}
        <Link to={ROUTE_PATHS.LOGIN} className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};
