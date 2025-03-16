import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDZqdZCOGiQTP4Z8lJ5xFCcU4g36PIw49Y",
    authDomain: "jira-assist-applib.firebaseapp.com",
    projectId: "jira-assist-applib",
    storageBucket: "jira-assist-applib.appspot.com",
    messagingSenderId: "1071553215353",
    appId: "1:1071553215353:web:1f442bd4c7a58a1efc4da8",
    measurementId: "G-PXBJFMEVYN"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

const db = getFirestore();
export default db;
