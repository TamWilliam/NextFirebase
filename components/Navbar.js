import React from "react"
import Link from "next/link"
import { auth } from "../pages/lib/firebase"

const Navbar = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut()
      window.location.reload() // Rechargez la page actuelle
    } catch (error) {
      console.error("Erreur lors de la déconnexion :", error)
    }
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/">
              <span className="text-white font-bold">Accueil</span>
            </Link>
          </li>
          <li>
            <Link href="/profile">
              <span className="text-white">Profil</span>
            </Link>
          </li>
          <li>
            {auth.currentUser ? (
              <button className="text-white" onClick={handleSignOut}>
                Déconnexion
              </button>
            ) : (
              <>
                <Link href="/login">
                  <span className="text-white">Connexion</span>
                </Link>
                <Link href="/register">
                  <span className="text-white ml-4">Inscription</span>
                </Link>
              </>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
