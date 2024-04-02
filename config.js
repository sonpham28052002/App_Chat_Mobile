import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey: "AIzaSyCR6vqW-KyM6vQ5_h45lbGYLGd2BEfqXOo",
  authDomain: "test-84df6.firebaseapp.com",
  projectId: "test-84df6",
  storageBucket: "test-84df6.appspot.com",
  messagingSenderId: "192261909325",
  appId: "1:192261909325:web:d882e4cf4c97b1e1486504"
}

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} 