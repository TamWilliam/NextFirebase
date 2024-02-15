import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { db } from "./lib/firebase";
import Link from "next/link";
import Layout from "../components/Layout";

export default function VoirProduits() {
  const [produits, setProduits] = useState([]);

  const addToCart = (productId) => {
    console.log(`Produit ajouté au panier avec l'ID : ${productId}`);
  };

  useEffect(() => {
    const fetchProduits = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const produitsData = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();
          let imageUrl = "";
          console.log(data.imageUrl);
          try {
            imageUrl = await getDownloadURL(ref(getStorage(), data.imageUrl));
          } catch (error) {
            console.error("Error fetching image URL:", error);
            data.imageUrl = "Images/visu-indispo.png";
          }
          return { id: doc.id, ...data, imageUrl };
        })
      );
      setProduits(produitsData);
    };

    fetchProduits();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Liste des produits
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.map((produit) => (
            <div
              className="bg-white rounded-lg shadow-md overflow-hidden"
              key={produit.id}
            >
              <img
                src={produit.imageUrl}
                alt={produit.name}
                className="w-full h-48 object-cover object-center"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{produit.name}</h2>
                <p className="text-gray-600">{produit.description}</p>
                <p className="text-gray-800 font-bold my-2">
                  {produit.price} €
                </p>

                <Link legacyBehavior href={`/product/${produit.id}`}>
                  <a className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2">Voir</a>
                </Link>

                <button
                  className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2"
                  onClick={() => addToCart(produit.id)}
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
