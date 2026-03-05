import { createContext, useContext, useState, useEffect } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState(null)
  const [chargement, setChargement] = useState(true)
  // Inscription
  const inscription = async (formData) => {
    try {
      // Créer l'utilisateur dans Firebase Auth
      const resultat = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Mettre à jour le profil avec le prénom
      await updateProfile(resultat.user, {
        displayName: `${formData.prenom} ${formData.nom}`
      })

      // Sauvegarder les infos dans Firestore
      await setDoc(doc(db, 'utilisateurs', resultat.user.uid), {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        role: formData.role,
        createdAt: new Date()
      })

      return { succes: true }
    } catch (erreur) {
      if (erreur.code === 'auth/email-already-in-use') {
        return { succes: false, message: 'Cet email est déjà utilisé' }
      }
      return { succes: false, message: 'Une erreur est survenue' }
    }
  }

  // Connexion
  const connexion = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { succes: true }
    } catch (erreur) {
      if (erreur.code === 'auth/user-not-found') {
        alert('Aucun compte avec cet email')
        return { succes: false, message: 'Aucun compte avec cet email' }
      }
      if (erreur.code === 'auth/wrong-password') {
        alert('Mot de passe incorrect')
        return { succes: false, message: 'Mot de passe incorrect' }
      }
      return { succes: false, message: 'Une erreur est survenue' }
    }
  }

  // Déconnexion
  const deconnexion = async () => {
    await signOut(auth)
    setUtilisateur(null)
  }

  // Surveiller l'état de connexion automatiquement
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Récupérer les infos supplémentaires depuis Firestore
        const docRef = doc(db, 'utilisateurs', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setUtilisateur({
            uid: user.uid,
            email: user.email,
            ...docSnap.data()
          })
        }
      } else {
        setUtilisateur(null)
      }
      setChargement(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{
      utilisateur,
      chargement,
      inscription,
      connexion,
      deconnexion
    }}>
      {!chargement && children}
    </AuthContext.Provider>
  )
}

function useAuth() {
  return useContext(AuthContext)
}

export { useAuth }