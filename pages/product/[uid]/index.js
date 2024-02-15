import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, getStorage } from "firebase/storage";
import { db } from "../../lib/firebase";
import Layout from "../../../components/Layout";

export default function ProductPage() {
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const router = useRouter();
  const { uid } = router.query;

  const addToCart = (productId) => {
    console.log(`Produit ajouté au panier avec l'ID : ${productId}`);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!uid) return;
      const docRef = doc(db, "products", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
        try {
          const imageRef = ref(getStorage(), docSnap.data().imageUrl);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error("Error fetching image URL:", error);
          setImageUrl("/path/to/default/image");
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchProduct();
  }, [uid]);

  if (!product) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="container mx-auto mt-8 p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-lg mb-4">{product.description}</p>
        <p className="text-2xl font-bold mb-4">Price: {product.price} €</p>
        <img
          src={imageUrl}
          alt={product.name}
          className="mx-auto mb-8 rounded-md"
          style={{ width: "300px", height: "auto" }}
        />
        <button
          className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-lg px-5 py-2.5 text-center me-2 mb-2"
          onClick={() => addToCart(product.id)}
        >
          Ajouter au panier
        </button>
      </div>
    </Layout>
  );
}
