import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { getDownloadURL, ref, getStorage } from 'firebase/storage'
import { db, useAuth } from '../../../firebase/firebase'
import Layout from '../../../components/Layout'

export default function ProductPage() {
  const [product, setProduct] = useState(null)
  const [imageUrl, setImageUrl] = useState('')
  const { user } = useAuth()
  const router = useRouter()
  const { uid } = router.query

  useEffect(() => {
    const fetchProduct = async () => {
      if (!uid) return
      const docRef = doc(db, 'products', uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const productData = docSnap.data()
        setProduct({ id: docSnap.id, ...productData })
        let url = ''
        try {
          url = await getDownloadURL(ref(getStorage(), productData.imageUrl))
        } catch (error) {
          console.error('Error fetching image URL:', error)
          url = '/path/to/default/image' // Path to your default image
        }
        setImageUrl(url)
      } else {
        console.log('No such document!')
        router.push('/') // Redirect if product does not exist
      }
    }

    fetchProduct()
  }, [uid, router])

  const handleAddToCart = async (produit) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des articles au panier.');
      return;
    }
  
    const userCartRef = doc(db, 'carts', user.uid);
    const userCartDoc = await getDoc(userCartRef);
  
    if (userCartDoc.exists()) {
      // Si le panier existe déjà, mettez à jour le document avec le nouveau produit ou augmentez la quantité
      const userCartData = userCartDoc.data();
      const existingProduct = userCartData[produit.id];
      const newQuantity = existingProduct ? Number(existingProduct.quantity) + 1 : 1; // Assurez-vous que la quantité est traitée comme un nombre
      await updateDoc(userCartRef, {
        [`${produit.id}`]: { ...produit, quantity: newQuantity, imageUrl: produit.imageUrl || defaultImage },
      });
    } else {
      // Si le panier n'existe pas, créez le document avec le produit comme première entrée
      await setDoc(userCartRef, {
        [produit.id]: { ...produit, quantity: 1, imageUrl: produit.imageUrl || defaultImage },
      });
    }
  
    alert('Produit ajouté au panier !');
  };

  if (!product) return <div>Loading...</div>

  return (
    <Layout>
      <div>
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <p>Price: {product?.price} €</p>
        <img
          src={imageUrl}
          alt={product?.name}
          style={{ width: '300px', height: 'auto' }}
        />
        {user && (
          <button onClick={handleAddToCart} className="btn btn-primary">
            Ajouter au panier
          </button>
        )}
      </div>
    </Layout>
  )
}
