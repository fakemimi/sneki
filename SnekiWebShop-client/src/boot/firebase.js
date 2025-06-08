import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCbraZMbxGwISXn9It0A6HqAep9FI-sZ9Y",
  authDomain: "snekiwebshop.firebaseapp.com",
  projectId: "snekiwebshop",
  storageBucket: "snekiwebshop.appspot.com", 
  messagingSenderId: "1085160144403",
  appId: "1:1085160144403:web:14a0cbe64fc3c8a0c0c9e6",
  measurementId: "G-G5C8Y0RLT4"
}

const firebaseApp = initializeApp(firebaseConfig)
const auth = getAuth(firebaseApp)
const db = getFirestore(firebaseApp)
const storage = getStorage(firebaseApp)

export default boot(({ app }) => {
  app.config.globalProperties.$auth = auth
  app.config.globalProperties.$db = db
  app.config.globalProperties.$storage = storage
})

export { auth, db, storage }
