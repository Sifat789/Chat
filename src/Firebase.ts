import { initializeApp } from "firebase/app";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword  } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBHdmTAtuQ56PGAeSU4tG33NjIZ4TYs_Ho",
  authDomain: "auth-84f82.firebaseapp.com",
  databaseURL: "https://auth-84f82-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "auth-84f82",
  storageBucket: "auth-84f82.appspot.com",
  messagingSenderId: "741375467458",
  appId: "1:741375467458:web:ca165a61749aaaafb3805b"
};


const app = initializeApp(firebaseConfig);

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