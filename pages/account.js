import { Inter } from "next/font/google";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useParams } from "next/navigation";

const docRef = doc(db, "users", users.uid);
const docSnap = await getDoc(docRef);

const route = useParams();
useEffect(() => {
  console.log(route);
});

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  console.log("No such document!");
}

const inter = Inter({ subsets: ["latin"] });

export default function Account({ role }) {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors bg-neutral-100">
          <h2 className={`mb-3 text-2xl font-semibold`}>Bienvenue</h2>
          <p className={`m-0 max-w-[30ch] text-sm`}>
            {`Bienvenue, vous êtes ${
              role === "admin" ? "administrateur" : "utilisateur"
            }`}
          </p>
        </div>
      </div>
    </main>
  );
}
