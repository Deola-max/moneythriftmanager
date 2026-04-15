
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage, User } from '../../types';

export const EditProfileForm: React.FC = () => {
  const { currentUser, updateProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState(''); // Email is not editable in this simulation
  const [message, setMessage] = useState<AlertMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const updatedUser = await updateProfile(currentUser.id, fullName);
      if (updatedUser) {
        setMessage({id:'profile-success', type: 'success', message: 'Profile updated successfully.'});
      } else {
        setMessage({id:'profile-fail', type: 'error', message: 'Failed to update profile.'});
      }
    } catch (err: any) {
      setMessage({id:'profile-error', type: 'error', message: err.message || 'An error occurred.'});
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return <p>Loading profile...</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Profile</h3>
      {message && <Alert alert={message} onDismiss={() => setMessage(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          disabled // Email not editable
          readOnly
        />
        <Button type="submit" isLoading={isLoading} variant="primary">
          Save Changes
        </Button>
      </form>
    </div>
  );
};
