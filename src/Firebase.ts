import { initializeApp } from "firebase/app";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCipiNwHSJgMps1ufe1ezE_wkU2h8MUBbw",
  authDomain: "sifatchat.firebaseapp.com",
  projectId: "sifatchat",
  storageBucket: "sifatchat.appspot.com",
  messagingSenderId: "276379923633",
  appId: "1:276379923633:web:7be6c98ebc218c189a9e90",
  measurementId: "G-EBKN22BXML"
};


initializeApp(firebaseConfig);

export const auth = getAuth()
export const db = getFirestore()

export const signUp =  (email:string, password:string) => {
  return createUserWithEmailAndPassword(auth, email, password)
}

export const logOut = () => {
    signOut(auth)
}

export const signIn = (email:string, password:string) => {
  return signInWithEmailAndPassword(auth,email,password)
} 