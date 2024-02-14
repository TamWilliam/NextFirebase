import Head from 'next/head';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Logique de connexion ici
    console.log('Email:', email, 'Password:', password);
    // Vous pouvez remplacer ce console.log par votre logique d'authentification
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Head>
        <title>Connexion</title>
      </Head>
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">Connexion à votre compte</h3>
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">Adresse e-mail</label>
              <input type="email" placeholder="Email" 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                id="email" name="email" required />
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">Mot de passe</label>
              <input type="password" placeholder="Mot de passe" 
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 mt-2 border rounded-md"
                id="password" name="password" required />
            </div>
            <div className="flex items-center justify-between mt-4">
              <button className="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Connexion</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
