import { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "./lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import Layout from "../components/Layout";
import "tailwindcss/tailwind.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  /* passage du mdp en type text pour l'expérience utilisateur */
  const [showPassword, setShowPassword] = useState(false);

  /* regex */
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  /* affichage d'un message à l'inscription */
  const [successMessage, setSuccessMessage] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    /* test du regex */
    if (!passwordRegex.test(password)) {
      alert(
        "Le mot de passe doit contenir au moins : 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre et 1 caractère spécial."
      );
      return;
    }

    try {
      // création de l'utilisateur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ajout de l'utilisateur à firestore avec le role (par défaut user)
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
      });

      /* affichage d'un msg pour inscription réussite */
      setSuccessMessage(
        "Inscription réussie ! Vous allez être redirigé vers la page de connexion."
      );

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        alert("Mail déjà existant. Veuillez en saisir un nouveau.");
      } else {
        console.error(error.code, error.message);
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <form
          onSubmit={handleSignUp}
          className="max-w-md p-4 bg-white shadow-md rounded-md"
        >
          {successMessage && (
            <div className="text-green-600 text-center mb-4 rounded-md">
              {successMessage}
            </div>
          )}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </label>

          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            <span className="text-sm text-gray-500">
              Afficher le mot de passe
            </span>
          </div>

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
