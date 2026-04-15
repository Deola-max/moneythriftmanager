
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../constants';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';


export const RegisterForm: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<AlertMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError({id: 'pwd-mismatch', type: 'error', message: 'Passwords do not match.'});
      return;
    }
    // Basic password strength check (example)
    if (password.length < 6) {
        setError({id: 'pwd-short', type: 'error', message: 'Password must be at least 6 characters long.'});
        return;
    }

    setIsLoading(true);
    try {
      const user = await register(fullName, email, password); // Password is plain text for simulation
      if (user) {
        navigate(ROUTE_PATHS.DASHBOARD);
      }
    } catch (err: any) {
      setError({id: 'reg-error', type: 'error', message: err.message || 'Registration failed. Please try again.'});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>
      {error && <Alert alert={error} onDismiss={() => setError(null)} />}
      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
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
        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading} fullWidth variant="primary" className="mt-2">
          Register
        </Button>
      </form>
      <p className="text-sm text-center text-gray-600 mt-4">
        Already have an account?{' '}
        <Link to={ROUTE_PATHS.LOGIN} className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  );
};
