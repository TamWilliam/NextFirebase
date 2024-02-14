import { useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import Link from 'next/link';

import "tailwindcss/tailwind.css";

const inter = Inter({ subsets: ["latin"] });

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);

      /* redirection sur index.js */
      router.push("/");
    } catch (error) {
      console.error(error.code, error.message);
      setError("Mail ou mot de passe incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSignIn} className="max-w-md p-4 bg-white shadow-md rounded-md">
        <label className="block mb-2 text-sm font-medium text-gray-600">
          Adresse mail :
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </label>

        <label className="block mb-2 text-sm font-medium text-gray-600">
          Mot de passe :
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </label>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Connexion
        </button>

        <p className="text-gray-600 text-sm mt-2">
          Pas de compte ?{" "}
          <Link legacyBehavior href="/signup">
            <a style={{ textDecoration: 'underline' }}>Créer un compte</a>
          </Link>
        </p>
      </form>
    </div>
  );
}
