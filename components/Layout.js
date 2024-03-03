import React from 'react'
import { useAuth } from '../firebase/firebase'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = ({ children }) => {
  const { user } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      <div className="flex-grow">
        <div className="container mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
