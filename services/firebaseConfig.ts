import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBbgOzCo_mRCXa1zw3QPQ2QzHbkvWDJrvs",
  authDomain: "cat-expense-manager-c6da0.firebaseapp.com",
  projectId: "cat-expense-manager-c6da0",
  storageBucket: "cat-expense-manager-c6da0.firebasestorage.app",
  messagingSenderId: "253041264602",
  appId: "1:253041264602:web:81a09525dbc6ea799722e3",
};

export const app = initializeApp(firebaseConfig);
