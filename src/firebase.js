const firebase = require('firebase')

const firebaseConfig = {
    apiKey: "AIzaSyDU0brRiOSED_XJQKpJM-95Ourv_8tc-xA",
    authDomain: "whatsapp-satya.firebaseapp.com",
    databaseURL: "https://whatsapp-satya.firebaseio.com",
    projectId: "whatsapp-satya",
    storageBucket: "whatsapp-satya.appspot.com",
    messagingSenderId: "959186828869",
    appId: "1:959186828869:web:c9847c9aa998a62a0aad2c",
    measurementId: "G-CR4G6CTMEN"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, provider };
export default db;
