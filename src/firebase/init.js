import firebase from 'firebase';
//import firestore from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAPrC7wUzNEDpwjAQFpQ0nDpCKLKpHLSpQ",
    authDomain: "hojames-2021.firebaseapp.com",
    projectId: "hojames-2021",
    storageBucket: "hojames-2021.appspot.com",
    messagingSenderId: "431129962660",
    appId: "1:431129962660:web:3811fd04be61c9327d9e31",
    measurementId: "G-VG73ELYHNB"
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
firebase.analytics();
firebaseApp.firestore();

export default firebaseApp.firestore();