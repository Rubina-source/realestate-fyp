import {
  initializeApp
} from "firebase/app";
console.log("DEBUG: Firebase Key is ->",
  import.meta.env.VITE_FIREBASE_API_KEY);

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "realestatefyp-45967.firebaseapp.com",
  projectId: "realestatefyp-45967",
  storageBucket: "realestatefyp-45967.firebasestorage.app",
  messagingSenderId: "1059933875804",
  appId: "1:1059933875804:web:7a14768b8e6a08ceb60099"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);