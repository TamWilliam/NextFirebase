import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext'; 
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import Layout from '../../components/Layout';

export default function Profile() {
  const { currentUser } = useContext(AuthContext); 
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    // Validation du nouveau mot de passe
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères avec au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&).'
      );
      return;
    }

    // Réauthentification de l'utilisateur
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      alert('Password updated successfully!');
      setNewPassword('');
      setCurrentPassword('');
    } catch (error) {
      setError('Failed to update password. Make sure your current password is correct.');
      console.error('Error updating password:', error);
    }
  };

  const handleChange = (setter) => (e) => {
    setter(e.target.value);
    setError('');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mt-8 text-center">Profile</h1>
        <div className="max-w-md mx-auto bg-white rounded-md shadow-md p-6 mt-8">
          <form onSubmit={handlePasswordChange} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={handleChange(setCurrentPassword)}
                className="mt-1 p-2 w-full rounded-md border border-gray-300"
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleChange(setNewPassword)}
                className="mt-1 p-2 w-full rounded-md border border-gray-300"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
