
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../Common/Input';
import { Button } from '../Common/Button';
import { Alert } from '../Common/Alert';
import { AlertMessage } from '../../types';

export const ChangePasswordForm: React.FC = () => {
  const { currentUser, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState<AlertMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!currentUser) return;

    if (newPassword !== confirmNewPassword) {
      setMessage({id:'pwd-mismatch', type: 'error', message: 'New passwords do not match.'});
      return;
    }
    if (newPassword.length < 6) {
      setMessage({id:'pwd-short', type: 'error', message: 'New password must be at least 6 characters long.'});
      return;
    }

    setIsLoading(true);
    try {
      const success = await changePassword(currentUser.id, currentPassword, newPassword);
      if (success) {
        setMessage({id:'pwdchange-success', type: 'success', message: 'Password changed successfully.'});
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setMessage({id:'pwdchange-fail', type: 'error', message: 'Failed to change password. Check current password.'});
      }
    } catch (err: any) {
      setMessage({id:'pwdchange-error', type: 'error', message: err.message || 'An error occurred.'});
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null; // Or a loading state

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
      <p className="text-xs text-gray-500 mb-3">Remember: Passwords are plain text in this simulation. Do not use real passwords.</p>
      {message && <Alert alert={message} onDismiss={() => setMessage(null)} />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmNewPassword"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <Button type="submit" isLoading={isLoading} variant="primary">
          Change Password
        </Button>
      </form>
    </div>
  );
};
