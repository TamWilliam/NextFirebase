// pages/account.js
import { Inter } from "next/font/google";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"; // Ajout de useState

const inter = Inter({ subsets: ["latin"] });

export default function Account() {
  const router = useRouter();
  const { uid } = router.query;
  const [userData, setUserData] = useState(null); // Utilisation de useState

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (uid) {
          const docRef = doc(db, "users", uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fetchedUserData = docSnap.data();
            setUserData(fetchedUserData);
            console.log("Document data:", fetchedUserData);
          } else {
            console.log("Pas de data récupérées");
          }
        }
      } catch (error) {
        console.error("catch sur les data récupérées:", error);
      }
    };

    fetchUserData();
  }, [uid]);

  const userRole = userData?.role || "utilisateur";

  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}>
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors bg-neutral-100">
          <h2 className={`mb-3 text-2xl font-semibold`}>Bienvenue</h2>
          <p className={`m-0 max-w-[30ch] text-sm`}>
            {`Bienvenue, vous êtes ${
              userRole === "vendeur" ? "vendeur" : "client"
            }`}
          </p>
        </div>
      </div>
    </main>
  );
}
