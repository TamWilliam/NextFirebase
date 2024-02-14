import { useState } from "react";
import { useRouter } from "next/router";
import { Inter } from "next/font/google";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./firebase";

import "tailwindcss/tailwind.css";

const inter = Inter({ subsets: ["latin"] });

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);

      router.push("/login");
    } catch (error) {
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
          className="text-center text-4xl p-3 text-amber-100 rounded-md w-full bg-green-400 hover:bg-blue-500"
        >
          S'enregistrer
        </button>
      </form>
    </div>
  );
}
