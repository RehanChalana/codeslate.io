// Import Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsSE1Dk1iJmnHJKF7hLVYnLE_AlkI24S0",
  authDomain: "codeslate-95e09.firebaseapp.com",
  projectId: "codeslate-95e09",
  storageBucket: "codeslate-95e09.appspot.com", // Fixed storage bucket URL
  messagingSenderId: "1023775153220",
  appId: "1:1023775153220:web:25e3b187266cffe561b011"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Firestore instance
export const googleProvider = new GoogleAuthProvider();

// Function to sign up a user with email and password
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// Function to save a new meeting to Firestore
export const saveMeeting = async (userId, title, dateTime, roomId) => {
  await addDoc(collection(db, "meetings"), {
    userId,
    title,
    dateTime,
    roomId,
  });
};

// Fetch meetings for a specific user
export const fetchMeetings = async (userId) => {
  const snapshot = await getDocs(collection(db, "meetings"));
  return snapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((meeting) => meeting.userId === userId);
};

// DELETE meeting function
export const deleteMeeting = async (meetingId) => {
  await deleteDoc(doc(db, "meetings", meetingId));
};