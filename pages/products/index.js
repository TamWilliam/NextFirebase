import { useState, useEffect, React } from 'react'
import { useRouter } from 'next/router'
import { query, where, collection, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { db, auth } from '../../firebase/firebase'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { onAuthStateChanged } from 'firebase/auth'

export default function VoirProduitsAdmin() {
  const [produits, setProduits] = useState([])
  const [userId, setUserId] = useState('')
  const [userRole, setUserRole] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
      } else {
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role);
          setUserId(user.uid); // S'assurer que userId est mis à jour avant de continuer
          if (userData.role === 'vendeur') {
            // Déplacer fetchProduits ici et s'assurer qu'il est appelé après la mise à jour de l'état
            fetchProduits(user.uid);
          } else {
            router.push('/');
          }
        } else {
          console.log('No such document!');
          router.push('/');
        }
      }
    });
  
    return () => unsubscribe();
  }, [router]);
  
  // Modifiez fetchProduits pour accepter userId comme paramètre
  const fetchProduits = async (userId) => {
    if (!userId) {
      console.log('ID utilisateur non défini');
      return;
    }
  
    const q = query(collection(db, 'products'), where("vendorId", "==", userId));
  
    const querySnapshot = await getDocs(q);
    const produitsData = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        let imageUrl = '';
        try {
          const imageRef = ref(getStorage(), data.imageUrl);
          imageUrl = await getDownloadURL(imageRef);
        } catch (error) {
          console.error('Error fetching image URL:', error);
          imageUrl = 'path/to/default/image.jpg'; // Utilisez le chemin vers votre image par défaut
        }
        return { id: doc.id, ...data, imageUrl };
      })
    );
    setProduits(produitsData);
  };

  const confirmDelete = async (productId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await deleteProduct(productId)
    }
  }

  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId))
      alert('Produit supprimé avec succès !')
      setProduits(produits.filter((produit) => produit.id !== productId))
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error)
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Liste des Produits
        </h1>
        <Link href={`/account/${userId}`}>Ajouter</Link>
        {userRole === 'vendeur' && (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Nom</th>
                  <th className="px-4 py-2">Prix</th>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2" colSpan={2}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {produits.map((produit) => (
                  <tr key={produit.id} className="border-b border-gray-300">
                    <td className="px-4 py-2">{produit.name}</td>
                    <td className="px-4 py-2">{produit.price} €</td>
                    <td className="px-4 py-2">
                      <img
                        src={produit.imageUrl}
                        alt={produit.name}
                        className="w-12 h-12 object-cover object-center"
                      />
                    </td>
                    <td>
                      <Link href={`/products/edit/${produit.id}`}>
                        Modifier
                      </Link>
                    </td>
                    <td>
                      <button onClick={() => confirmDelete(produit.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
