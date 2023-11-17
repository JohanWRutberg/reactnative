import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBNkitdwBnNhh0tCVFcbEn91Tk4a4IRUAo",
  authDomain: "crossplatform-93ef6.firebaseapp.com",
  projectId: "crossplatform-93ef6",
  storageBucket: "crossplatform-93ef6.appspot.com",
  messagingSenderId: "754068252730",
  appId: "1:754068252730:web:51846e4440870fdc2c2d03"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore, serverTimestamp };
export const db = getFirestore();
