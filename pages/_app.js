import React from 'react'
import '../styles/globals.css'
import { AuthProvider } from '../context/AuthContext' // Ajustez le chemin selon votre structure de projet

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  )
}

export default MyApp
