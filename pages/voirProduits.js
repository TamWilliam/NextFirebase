import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "./lib/firebase";
import Link from "next/link";
import Layout from "../components/Layout";

export default function VoirProduits() {
  const [produits, setProduits] = useState([]);
  const [panier, setPanier] = useState([]);

  useEffect(() => {
    const fetchProduits = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const produitsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          let imageUrl = "";
          try {
            imageUrl = await getDownloadURL(ref(getStorage(), data.imageUrl));
          } catch (error) {
            console.error("Error fetching image URL:", error);
            imageUrl = "Images/Products/Pierre/background.jpg";
          }
          return { id: doc.id, ...data, imageUrl };
        })
      );
      setProduits(produitsData);
    };

    fetchProduits();
  }, []);

  const handleAddToCart = (produit) => {
    // Copiez le panier actuel
    const newCart = [...panier];
    // Vérifiez si le produit est déjà dans le panier
    const existingItemIndex = newCart.findIndex(
      (item) => item.id === produit.id
    );
    if (existingItemIndex !== -1) {
      // Si le produit est déjà dans le panier, augmentez simplement la quantité
      newCart[existingItemIndex].quantity += 1;
    } else {
      // Sinon, ajoutez le produit au panier
      newCart.push({ ...produit, quantity: 1 });
    }
    // Mettez à jour le panier avec le nouveau panier
    setPanier(newCart);
    // Affichez une notification de succès d'ajout au panier
    alert("Produit ajouté au panier !");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Liste des produits
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.map((produit) => (
            <div
              key={produit.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Link href={`/product/${produit.id}`}>
                <img
                  src={produit.imageUrl}
                  alt={produit.name}
                  className="w-full h-48 object-cover object-center"
                />
              </Link>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{produit.name}</h2>
                <p className="text-gray-600">{produit.description}</p>
                <p className="text-gray-800 font-bold mt-2">
                  {produit.price} €
                </p>
                <button
                  onClick={() => handleAddToCart(produit)}
                  className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-b-md hover:bg-blue-600"
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
