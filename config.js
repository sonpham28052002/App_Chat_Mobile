import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

export const firebaseConfig = {
  apiKey : "AIzaSyD31mHhdJv5GjNUmB9fudUNIG8TDpSggl0" , 
  authDomain : "test1-6ac49.firebaseapp.com" , 
  projectId : "test1-6ac49" , 
  storageBucket : "test1-6ac49.appspot.com" , 
  messagingSenderId : "464751324605" , 
  appId : "1:464751324605:web:04a06a1bb2c8299c4336d4" 
}
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
} 