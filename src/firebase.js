// Importa las funciones necesarias de los SDK que necesitas
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Configuración de tu primera aplicación de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCJsu3eRtfAQTxQOLh41XNmbQRoA6_jL_Q",
  authDomain: "autenticator-a1572.firebaseapp.com",
  projectId: "autenticator-a1572",
  storageBucket: "autenticator-a1572.appspot.com",
  messagingSenderId: "559809236786",
  appId: "1:559809236786:web:c2a81530e1cdcccabf912b",
  measurementId: "G-21NFD2QDJY"
};

// Configuración de tu segunda aplicación de Firebase
const secondFirebaseConfig = {
  apiKey: "AIzaSyADERCOuWMW8N9HDtfjuEXyAJhDnTspqlA",
  authDomain: "autenticator-admin.firebaseapp.com",
  projectId: "autenticator-admin",
  storageBucket: "autenticator-admin.appspot.com",
  messagingSenderId: "590827558242",
  appId: "1:590827558242:web:af6da7fd03a1dd2c9b883b",
  measurementId: "G-EHZ24KGYD8"
};

// Inicializa tu primera aplicación de Firebase
const app = initializeApp(firebaseConfig);

// Inicializa tu segunda aplicación de Firebase
const secondApp = initializeApp(secondFirebaseConfig, "secondApp");

// Crea un usuario con email y contraseña en la primera base de datos
export const createUser = async (email, password) => {
  const auth = getAuth(app);
  return createUserWithEmailAndPassword(auth, email, password);
};

// Inicia sesión con email y contraseña en la primera base de datos
export const signInUser = async (email, password) => {
  const auth = getAuth(app);
  return signInWithEmailAndPassword(auth, email, password);
};

// Crea un documento en Firestore en la primera base de datos
export const createFirestoreDocument = async (userId, data) => {
  try {
    const firestore = getFirestore(app);
    const userRef = doc(firestore, "users", userId);
    await setDoc(userRef, data);
    console.log("Documento de Firestore en la primera base de datos creado exitosamente!");
  } catch (error) {
    console.error("Error al crear el documento de Firestore en la primera base de datos:", error);
    throw error;
  }
};

// Crea un documento en Firestore en la segunda base de datos
export const createSecondFirestoreDocument = async (userId, data) => {
  try {
    const secondFirestore = getFirestore(secondApp);
    const userRef = doc(secondFirestore, "users", userId);
    await setDoc(userRef, data);
    console.log("Documento de Firestore en la segunda base de datos creado exitosamente!");
  } catch (error) {
    console.error("Error al crear el documento de Firestore en la segunda base de datos:", error);
    throw error;
  }
};
