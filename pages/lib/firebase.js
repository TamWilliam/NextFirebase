// pages/lib/firebase.js

import { useEffect, useState } from "react"
import { getApps, getApp, initializeApp } from "firebase/app"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Vérifier si une application Firebase est déjà initialisée
const firebaseApp = getApps().length
  ? getApp()
  : initializeApp({
      apiKey: "AIzaSyAnxVe_3H7Ypf0dJcQZO1kegQWv3KWTgQk",
      authDomain: "e-commerce-a2e5f.firebaseapp.com",
      projectId: "e-commerce-a2e5f",
      storageBucket: "e-commerce-a2e5f.appspot.com",
      messagingSenderId: "289054162281",
      appId: "1:289054162281:web:4d2e2d8666ba7e26e411f8",
      measurementId: "G-7F8LJFTQ42",
    })

// Récupérer l'instance de l'authentification
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)
const auth = getAuth(app)

// Créer un hook pour gérer l'authentification de l'utilisateur
const useAuth = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })

    // Nettoyage de l'effet lors du démontage du composant
    return () => unsubscribe()
  }, [])

  return { user }
}

export { firebaseApp, auth, db, useAuth }
