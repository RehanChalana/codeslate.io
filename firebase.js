// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsSE1Dk1iJmnHJKF7hLVYnLE_AlkI24S0",
  authDomain: "codeslate-95e09.firebaseapp.com",
  projectId: "codeslate-95e09",
  storageBucket: "codeslate-95e09.firebasestorage.app",
  messagingSenderId: "1023775153220",
  appId: "1:1023775153220:web:25e3b187266cffe561b011"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();


export const signUpWithEmail = ( email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
}