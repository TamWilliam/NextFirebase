import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, getStorage } from 'firebase/storage';
import { db, useAuth } from '../../../firebase/firebase';
import Layout from '../../../components/Layout';

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const { user } = useAuth();
  const router = useRouter();
  const { uid } = router.query;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!uid) return;
      const docRef = doc(db, 'products', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const productData = docSnap.data();
        setProduct({ id: docSnap.id, ...productData });
        let url = '';
        try {
          url = await getDownloadURL(ref(getStorage(), productData.imageUrl));
        } catch (error) {
          console.error('Error fetching image URL:', error);
          url = '/path/to/default/image'; // Path to your default image
        }
        setImageUrl(url);
      } else {
        console.log('No such document!');
        router.push('/'); // Redirect if product does not exist
      }
    };

    fetchProduct();
  }, [uid, router]);

  const handleAddToCart = async () => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des articles au panier.');
      return;
    }

    const userCartRef = doc(db, 'carts', user.uid);
    const userCartDoc = await getDoc(userCartRef);
    const userCartData = userCartDoc.exists() ? userCartDoc.data() : {};

    if (userCartData[product.id]) {
      // Increase quantity by 1 if product already exists in the cart
      const newQuantity = userCartData[product.id].quantity + 1;
      await updateDoc(userCartRef, {
        [`${product.id}.quantity`]: newQuantity
      });
    } else {
      // Add product with quantity of 1 if it does not exist in the cart
      await updateDoc(userCartRef, {
        [product.id]: { ...product, quantity: 1 }
      });
    }

    alert('Produit ajouté au panier !');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <Layout>
      <div>
        <h1>{product?.name}</h1>
        <p>{product?.description}</p>
        <p>Price: {product?.price} €</p>
        <img src={imageUrl} alt={product?.name} style={{ width: '300px', height: 'auto' }} />
        {user && (
          <button onClick={handleAddToCart} className="btn btn-primary">
            Ajouter au panier
          </button>
        )}
      </div>
    </Layout>
  );
}
