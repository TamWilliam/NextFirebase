import { useState, useEffect, React } from 'react'
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage'

export default function DisplayImages() {
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    const fetchImages = async () => {
      const storage = getStorage()
      const imagesListRef = ref(storage, 'Images/')
      const imageRefs = await listAll(imagesListRef)

      const urls = await Promise.all(
        imageRefs.items.map((itemRef) => {
          return getDownloadURL(itemRef)
        })
      )

      setImageUrls(urls)
    }

    fetchImages()
  }, [])

  return (
    <div>
      <h1>Images stockées</h1>
      <div>
        {imageUrls.map((url, index) => (
          <img
            key={index}
            src={url}
            alt="Image from Firebase"
            style={{ width: '100px', height: '100px' }}
          />
        ))}
      </div>
    </div>
  )
}
