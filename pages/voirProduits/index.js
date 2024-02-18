import { useState, useEffect, React } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import { db } from '../../firebase/firebase'
import Link from 'next/link'
import Layout from '../../components/Layout'

export default function VoirProduits({ produitsData }) {
  const [produits, setProduits] = useState(produitsData || [])
  const [panier, setPanier] = useState([])

  useEffect(() => {
    if (!produitsData) {
      const fetchProduits = async () => {
        const querySnapshot = await getDocs(collection(db, 'products'))
        const produitsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data()
            let imageUrl = ''
            console.log(data.imageUrl)
            try {
              imageUrl = await getDownloadURL(ref(getStorage(), data.imageUrl))
              console.log(imageUrl)
            } catch (error) {
              console.error('Error fetching image URL:', error)
              imageUrl = 'Images/noImage/noImage.jpg'
            }
            return { id: doc.id, ...data, imageUrl }
          })
        )
        setProduits(produitsData)
      }

      fetchProduits()
    }
  }, [produitsData])

  const handleAddToCart = (produit) => {
    const newCart = [...panier]
    const existingItemIndex = newCart.findIndex(
      (item) => item.id === produit.id
    )
    if (existingItemIndex !== -1) {
      newCart[existingItemIndex].quantity += 1
    } else {
      newCart.push({ ...produit, quantity: 1 })
    }
    setPanier(newCart)
    alert('Produit ajouté au panier !')
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 bg-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Liste des produits
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {produits.map((produit) => (
            <Link href={`/product/${produit.id}`} key={produit.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={produit.imageUrl}
                  alt={produit.name}
                  className="w-full h-48 object-cover object-center"
                />
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
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps() {
  const querySnapshot = await getDocs(collection(db, 'products'))
  const produitsData = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data()
  }))
  return { props: { produitsData } }
}
