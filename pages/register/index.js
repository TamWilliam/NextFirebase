import { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebase/firebase';
import { setDoc, doc } from 'firebase/firestore';
import Layout from '../../components/Layout';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Par défaut, le rôle est défini sur "user"
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validation du mot de passe
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        'Le mot de passe doit contenir au moins 8 caractères avec au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial (@$!%*?&).'
      );
      return;
    }

    // Validation de l'adresse email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Adresse email invalide.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role // Utilisez le rôle sélectionné par l'utilisateur
      });

      router.push('/');
    } catch (error) {
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            setError('Cette adresse email est déjà utilisée.');
            break;
          case 'auth/invalid-email':
          case 'auth/weak-password':
            setError(
              'Adresse email ou mot de passe invalide. 6 caractères minimum'
            );
            break;
          default:
            setError("Une erreur s'est produite lors de l'inscription.");
            break;
        }
      } else {
        setError("Une erreur s'est produite lors de l'inscription.");
      }
    }
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setError('');
  };

  const handleChangeRole = (e) => {
    setRole(e.target.value);
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSignUp}
          className="max-w-md p-4 bg-white shadow-md rounded-md"
        >
          <label className="block mb-2 text-sm font-medium text-gray-600">
            Adresse mail :
            <input
              type="email"
              value={email}
              onChange={handleChangeEmail}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </label>

          <label className="block mb-2 text-sm font-medium text-gray-600">
            Mot de passe (au moins 8 caractères avec au moins une lettre
            minuscule, une lettre majuscule, un chiffre et un caractère spécial
            @$!%*?&):
            <input
              type="password"
              value={password}
              onChange={handleChangePassword}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </label>

          <label className="block mb-2 text-sm font-medium text-gray-600">
            Rôle :
            <select
              value={role}
              onChange={handleChangeRole}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="client">Utilisateur</option>
              <option value="vendeur">Vendeur</option>
            </select>
          </label>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

          <button
            type="submit"
            className="text-center text-4xl p-3 text-amber-100 rounded-md w-full bg-green-400 hover:bg-blue-500"
          >
            S'enregistrer
          </button>
        </form>
      </div>
    </Layout>
  );
}