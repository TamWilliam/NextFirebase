import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export default function VoirClients() {
  const [clients, setClients] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const clientsData = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() });
        });
        setClients(clientsData);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  return (
    <div>
      <h1>Liste des clients</h1>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.email} {client.role}
          </li>
        ))}
      </ul>
    </div>
  );
}
