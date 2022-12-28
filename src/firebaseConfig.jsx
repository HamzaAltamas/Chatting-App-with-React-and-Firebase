// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0O5Fyb030XhWCdOUn1L-jqa8D6cWqqx4",
  authDomain: "chattingup-57dec.firebaseapp.com",
  projectId: "chattingup-57dec",
  storageBucket: "chattingup-57dec.appspot.com",
  messagingSenderId: "479667635227",
  appId: "1:479667635227:web:0c5e13f0f26ebfac1524be",
  measurementId: "G-GG65Z4MWR6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default firebaseConfig;
