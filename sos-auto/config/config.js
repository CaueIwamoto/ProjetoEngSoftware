// Import the functions you need from the SDKs you need
import firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOJt7VD14NHWQyAa79EWhIC65nI_XZnQw",
  authDomain: "sos-auto-3a08d.firebaseapp.com",
  databaseURL: "https://sos-auto-3a08d-default-rtdb.firebaseio.com",
  projectId: "sos-auto-3a08d",
  storageBucket: "sos-auto-3a08d.firebasestorage.app",
  messagingSenderId: "557231668423",
  appId: "1:557231668423:web:841ca57a06efd6782252e2"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;