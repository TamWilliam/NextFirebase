import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import { collection, getDocs, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase/firebase';
import { useAuth } from '../firebase/firebase'; // Supposons que vous avez un hook d'authentification

export default function VoirProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Utilisez le hook d'authentification pour accéder à l'utilisateur actuel

  useEffect(() => {
    const fetchProduits = async () => {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const produitsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          let imageUrl = '';
          try {
            imageUrl = await getDownloadURL(ref(getStorage(), data.imageUrl));
          } catch (error) {
            console.error('Error fetching image URL:', error);
            imageUrl = '/path/to/default/image'; // Chemin vers une image par défaut
          }
          return { id: doc.id, ...data, imageUrl };
        })
      );
      setProduits(produitsData);
      setLoading(false);
    };

    fetchProduits();
  }, []);

  const handleAddToCart = async (produit) => {
    if (!user) {
      alert('Veuillez vous connecter pour ajouter des articles au panier.');
      return;
    }

    const userCartRef = doc(db, 'carts', user.uid); // Utilisez l'UID de l'utilisateur connecté
    const userCartDoc = await getDoc(userCartRef);
    const userCartData = userCartDoc.exists() ? userCartDoc.data() : {};

    const updatedCart = {
      ...userCartData,
      [produit.id]: {
        ...produit,
        quantity: userCartData[produit.id] ? userCartData[produit.id].quantity + 1 : 1,
      },
    };

    await setDoc(userCartRef, updatedCart); // Met à jour ou crée le document du panier avec le nouveau panier

    alert('Produit ajouté au panier !');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">Liste des produits</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.map((produit) => (
            <div key={produit.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Link href={`/product/${produit.id}`}>
                  <img src={produit.imageUrl} alt={produit.name} className="w-full h-48 object-cover object-center" />
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{produit.name}</h2>
                <p className="text-gray-600">{produit.description}</p>
                <p className="text-gray-800 font-bold mt-2">{produit.price} €</p>
                <button
                  onClick={() => handleAddToCart(produit)}
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-600 mt-4"
                >
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
