
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore'; // Import Firestore


const firebaseConfig = {
    apiKey: "AIzaSyCmbMbotHwKomvy9xxcILH5Nn_MzMgYrbk",
    authDomain: "friends-a8c3d.firebaseapp.com",
    projectId: "friends-a8c3d",
    storageBucket: "friends-a8c3d.appspot.com",
    messagingSenderId: "18364098239",
    appId: "1:18364098239:web:e54dc02bf56831741d480a",
    measurementId: "G-NP5MQSD6B7"
  };;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app); 
export { db };
