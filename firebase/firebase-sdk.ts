import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
 
const firebaseConfig = {
  apiKey: "AIzaSyDSpui6esXVIgH8IBK68fbGHSsGBCpBhPA",
  authDomain: "kolab-d9acc.firebaseapp.com",
  projectId: "kolab-d9acc",
  storageBucket: "kolab-d9acc.appspot.com",
  messagingSenderId: "1054987606511",
  appId: "1:1054987606511:web:a5f29644c39e81078ebe1a",
  measurementId: "G-RSEBTYQBPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const imageDatabase = getStorage(app);