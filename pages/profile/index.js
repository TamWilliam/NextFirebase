import React, { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { AuthContext } from '../../context/AuthContext'
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import Layout from '../../components/Layout'
import Link from 'next/link'

export default function Profile() {
  const { currentUser } = useContext(AuthContext)
  const [newPassword, setNewPassword] = useState('')
  const [userRole, setUserRole] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (currentUser) {
      // Supposons que vous stockiez le rôle de l'utilisateur dans Firestore
      const docRef = doc(db, 'users', currentUser.uid)
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role) // Stockez le rôle de l'utilisateur dans l'état
        }
      })
    }
  }, [currentUser])

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    if (!newPassword) return

    // Reauthenticate the user before updating the password
    // You may need to get the current password from the user
    const currentPassword = prompt('Please enter your current password:') // You should use a more secure way to handle this.
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    )

    try {
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword)
      alert('Password updated successfully!')
      setNewPassword('')
    } catch (error) {
      console.error('Error updating password:', error)
      alert('Failed to update password.')
    }
  }

  const handleDeleteAccount = async () => {
    const confirmation = confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    )
    if (!confirmation) return

    try {
      await deleteUser(currentUser)
      alert('Account deleted successfully.')
      router.push('/') // Redirect to home page or login page
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account.')
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mt-8">Profile</h1>

      <div>
        <strong>Email:</strong> {currentUser?.email}
        {/* Add more user details if needed */}
      </div>

      <form onSubmit={handlePasswordChange}>
        <label htmlFor="newPassword">New Password:</label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Change Password</button>
      </form>

      <button onClick={handleDeleteAccount}>Delete Account</button>

      {userRole === 'vendeur' && ( // Affichez le lien uniquement si l'utilisateur est un vendeur
        <ul className="list-disc">
          <li>
            <Link href="/products">Mes produits</Link>
          </li>
        </ul>
      )}
    </Layout>
  )
}
