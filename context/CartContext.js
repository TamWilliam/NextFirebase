import React, { createContext, useState, useEffect, useContext } from 'react'
import { db } from '../firebase/firebase'
import { collection, query, where, getDocs, useAuth } from 'firebase/firestore'
export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [cartItemCount, setCartItemCount] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      const fetchCartItemCount = async () => {
        const cartRef = collection(db, 'carts')
        const q = query(cartRef, where('userId', '==', user.uid))
        const querySnapshot = await getDocs(q)
        let count = 0
        querySnapshot.forEach((doc) => {
          const cartItems = doc.data()
          Object.values(cartItems).forEach((item) => {
            count += item.quantity
          })
        })
        setCartItemCount(count)
      }

      fetchCartItemCount()
    }
  }, [user])

  return (
    <CartContext.Provider value={{ cartItemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
