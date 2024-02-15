import { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { db } from "./lib/firebase";

export default function DisplayProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {

            const storage = getStorage();
            const imagesListRef = ref(storage, 'Images/');
            const imageRefs = await listAll(imagesListRef);
            const imageUrls = await Promise.all(imageRefs.items.map((itemRef) => getDownloadURL(itemRef)));

            const db = getFirestore();
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection);
            const productsData = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const combinedProducts = productsData.map((product, index) => ({
                ...product,
                imageUrl: imageUrls[index]
            }));

            setProducts(combinedProducts);
        };

        fetchProducts();
    }, []);

    const addToCart = (productId) => {
        console.log(`Produit ajouté au panier : ${productId}`);
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-3xl font-bold mb-4">Produits</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                    <div key={product.id} className="border border-gray-300 p-4 rounded-md">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-40 object-cover mb-4 rounded-md" />
                        <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                        <p className="text-gray-600 mb-2">Prix : {product.price} €</p>
                        <button onClick={() => addToCart(product.id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">Ajouter au panier</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
