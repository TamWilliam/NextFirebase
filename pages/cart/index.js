import { useState, useEffect, useContext } from 'react';
import { doc, getDoc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Layout from '../../components/Layout';
import { AuthContext } from '../../context/AuthContext';
import Modal from 'react-modal'; // Importez le composant de modale ou de popup que vous utilisez

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false); // État pour afficher ou masquer le popup
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser) return;
      try {
        const userCartRef = doc(db, 'carts', currentUser.uid);
        const userCartDoc = await getDoc(userCartRef);
        const userCartData = userCartDoc.data() || {};

        const items = [];
        for (const [productId, productDetails] of Object.entries(userCartData)) {
          if (productDetails && productDetails !== null) {
            items.push({ id: productId, ...productDetails })
          }
        }

        setCartItems(items);
      } catch (error) {
        console.error('Error fetching cart items:', error)
      } finally {
        setLoading(false)
      }
    };

    fetchCartItems();
  }, [currentUser]);

  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    try {
      const userCartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(userCartRef, {
        [productId]: deleteField()
      });
      const updatedCartItems = cartItems.filter(item => item.id !== productId);
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error removing item from cart:', error)
    }
  }

  const updateQuantity = async (productId, newQuantity) => {
    if (!currentUser) return;
    try {
      const userCartRef = doc(db, 'carts', currentUser.uid);
      await updateDoc(userCartRef, {
        [productId + '.quantity']: newQuantity
      });
      const updatedCartItems = cartItems.map(item => {
        if (item.id === productId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setCartItems(updatedCartItems);
    } catch (error) {
      console.error('Error updating item quantity in cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const handleCheckout = () => {
    // Ici, vous pouvez mettre en œuvre la logique de commande ou afficher un popup de confirmation
    setShowPopup(true);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Cart</h1>
        {loading ? (
          <p>Loading...</p>
        ) : cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            <ul className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between py-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded" />
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>
                      <p className="text-gray-600">{item.price} €</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-16 h-10 border rounded" />
                    <button onClick={() => removeFromCart(item.id)} className="px-3 py-1 rounded bg-red-500 text-white">Remove</button>
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-xl font-semibold mt-8">Total Price: {calculateTotalPrice()} €</p>
            <button onClick={handleCheckout} className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Checkout</button>
            {/* Popup de confirmation */}
            <Modal isOpen={showPopup} onRequestClose={() => setShowPopup(false)}>
              <h2>Order Confirmation</h2>
              <p>Your order has been placed successfully!</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </Modal>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Cart
