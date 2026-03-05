// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCEeGWcWQz27bzLmlNpaYuOE26afG-Vce8",
  authDomain: "app-immobiliere-f78d9.firebaseapp.com",
  projectId: "app-immobiliere-f78d9",
  storageBucket: "app-immobiliere-f78d9.firebasestorage.app",
  messagingSenderId: "1019314070832",
  appId: "1:1019314070832:web:a02c1bfbf5264da66e54f5",
  measurementId: "G-8GDN5DDGFS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Exporter Auth et Firestore pour les utiliser partout
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)