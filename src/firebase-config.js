// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_API_KEY}`,
    authDomain: `${process.env.REACT_APP_AUTH_DOMAIN}`,
    projectId: 'rent-project-9332f',
    storageBucket: 'rent-project-9332f.appspot.com',
    messagingSenderId: '100552060843',
    appId: '1:100552060843:web:75bb7d77bfe5ffb9ac6cee',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore();
