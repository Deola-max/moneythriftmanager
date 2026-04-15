
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../constants';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<AlertMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await login(email, password); // Password is plain text for simulation
      if (user) {
        navigate(ROUTE_PATHS.DASHBOARD);
      } else {
        setError({id: 'login-fail', type: 'error', message: 'Invalid email or password.'});
      }
    } catch (err: any) {
      setError({id: 'login-error', type: 'error', message: err.message || 'Login failed. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
      {error && <Alert alert={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading} fullWidth variant="primary" className="mt-2">
          Login
        </Button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Don't have an account?{' '}
        <Link to={ROUTE_PATHS.REGISTER} className="font-medium text-primary hover:underline">
          Register here
        </Link>
      </p>
      <p className="text-sm text-center text-gray-600 mt-2">
        <Link to={ROUTE_PATHS.FORGOT_PASSWORD} className="font-medium text-primary hover:underline">
          Forgot password?
        </Link>
      </p>
    </div>
  );
};
