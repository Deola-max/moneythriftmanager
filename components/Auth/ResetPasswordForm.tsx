
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../constants';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';

export const ResetPasswordForm: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<AlertMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!token) {
      setMessage({id:'token-missing', type: 'error', message: 'Invalid or missing reset token.'});
      return;
    }
    if (password !== confirmPassword) {
      setMessage({id:'pwd-mismatch', type: 'error', message: 'Passwords do not match.'});
      return;
    }
    if (password.length < 6) {
      setMessage({id:'pwd-short', type: 'error', message: 'Password must be at least 6 characters long.'});
      return;
    }

    setIsLoading(true);
    try {
      const success = await resetPassword(token, password); // Password is plain text for simulation
      if (success) {
        setMessage({id:'reset-success', type: 'success', message: 'Password reset successfully. You can now login.'});
        setTimeout(() => navigate(ROUTE_PATHS.LOGIN), 3000);
      } else {
        setMessage({id:'reset-fail', type: 'error', message: 'Password reset failed. The link may be invalid or expired.'});
      }
    } catch (err: any) {
      setMessage({id:'reset-error', type: 'error', message: err.message || 'An error occurred. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      {message && <Alert alert={message} onDismiss={() => setMessage(null)} />}
      <form onSubmit={handleSubmit}>
        <Input
          label="New Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading} fullWidth variant="primary" className="mt-2">
          Reset Password
        </Button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4">
        <Link to={ROUTE_PATHS.LOGIN} className="font-medium text-primary hover:underline">
          Back to Login
        </Link>
      </p>
    </div>
  );
};
