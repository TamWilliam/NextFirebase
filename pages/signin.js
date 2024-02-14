import { Inter } from "next/font/google";
import { useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  useEffect(() => {
    createUserWithEmailAndPassword(
      auth,
      "pleroy030@gmail.com",
      "password"
    ).then((response) => {
      console.log(response);
    });

    return () => {};
  }, []);
}
