// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATXuO6c3dt7ll8MGXFQ7V9GjtXu_YfH0A",
  authDomain: "advocateappointments.firebaseapp.com",
  databaseURL: "https://advocateappointments-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "advocateappointments",
  storageBucket: "advocateappointments.appspot.com",
  messagingSenderId: "350170207172",
  appId: "1:350170207172:web:9620878cfd2a0228080a91",
  measurementId: "G-8MVPE7Z61P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window !== 'undefined') {
  import("firebase/analytics").then(({ getAnalytics }) => {
    getAnalytics(app);
  });
}

export const db = getDatabase(app);