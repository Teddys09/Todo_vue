import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
// ... other firebase imports

export const firebaseApp = initializeApp({
  // your application settings

  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECTID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_FIREBASE_APPID,
});

// used for the firestore refs
export const db = getFirestore(firebaseApp);

// here we can export reusable database references
export const todosRef = collection(db, 'todos');
