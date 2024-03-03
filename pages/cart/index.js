import { useState, useEffect, useContext, React } from 'react'
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore'
import { db } from '../../firebase/firebase'
import Layout from '../../components/Layout'
import { AuthContext } from '../../context/AuthContext'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser) return
      try {
        const userCartRef = doc(db, 'carts', currentUser.uid)
        const userCartDoc = await getDoc(userCartRef)
        const userCartData = userCartDoc.data() || {}

        const items = []
        for (const [productId, productDetails] of Object.entries(
          userCartData
        )) {
          if (productDetails && productDetails !== null) {
            items.push({ id: productId, ...productDetails })
          }
        }

        setCartItems(items)
      } catch (error) {
        console.error('Error fetching cart items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCartItems()
  }, [currentUser])

  const removeFromCart = async (productId) => {
    if (!currentUser) return
    try {
      const userCartRef = doc(db, 'carts', currentUser.uid)

      await updateDoc(userCartRef, {
        [productId]: deleteField()
      })

      const updatedCartItems = cartItems.filter((item) => item.id !== productId)
      setCartItems(updatedCartItems)
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  return (
    <Layout>
      <div>
        <h1>Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - {item.price} €
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  )
}

export default Cart
