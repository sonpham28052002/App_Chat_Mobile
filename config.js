import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey : "AIzaSyC7EHNEXx70w-Y95s2dZW6rR6diJDkL99M" , 
  authDomain : "zalo-chats-10f1e.firebaseapp.com" , 
  projectId : "zalo-chats-10f1e" , 
  storageBucket : "zalo-chats-10f1e.appspot.com" , 
  messagingSenderId : "1071228614114" , 
  appId : "1:1071228614114:web:d237cd487ccf81952f35bb"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} 