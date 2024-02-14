import { useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

import "tailwindcss/tailwind.css";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      /* authentification réussie */
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(response);
      router.push("/login");
    } catch (error) { /* affichage de l'erreur */
      console.error(error.code, error.message);
    }
  };

  return (
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

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          S'enregistrer
        </button>
      </form>
    </div>
  );
}
