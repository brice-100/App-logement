import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy
} from 'firebase/firestore'
import { db } from './config'

// Ajouter un logement
export const ajouterLogement = async (logementData, utilisateur) => {
  try {
    const docRef = await addDoc(collection(db, 'logements'), {
      ...logementData,
      proprietaireId: utilisateur.uid,
      proprietaireNom: `${utilisateur.prenom} ${utilisateur.nom}`,
      disponible: true,
      createdAt: serverTimestamp()
    })
    return { succes: true, id: docRef.id }
  } catch (erreur) {
    console.error('Erreur ajout logement:', erreur)
    return { succes: false, message: 'Erreur lors de l ajout' }
  }
}

// Écouter tous les logements en temps réel
export const ecouterLogements = (callback) => {
  const q = query(
    collection(db, 'logements'),
    orderBy('createdAt', 'desc')
  )
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const logements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(logements)
  })
  return unsubscribe
}

export const getLogement = async (id) => {
  try {
    const docRef = doc(db, 'logements', id)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        console.log('Données brutes Firestore:', docSnap.data())
      const data = { id: docSnap.id, ...docSnap.data() }
      console.log('Logement récupéré:', data) // pour vérifier
      return data
    }
    return null
  } catch (erreur) {
    console.error('Erreur récupération logement:', erreur)
    return null
  }
}

// Écouter les logements d'un propriétaire
export const ecouterLogementsProprietaire = (proprietaireId, callback) => {
  const q = query(
    collection(db, 'logements'),
    where('proprietaireId', '==', proprietaireId),
    orderBy('createdAt', 'desc')
  )
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const logements = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(logements)
  })
  return unsubscribe
}

// Modifier la disponibilité d'un logement
export const modifierDisponibilite = async (id, disponible) => {
  try {
    await updateDoc(doc(db, 'logements', id), { disponible })
    return { succes: true }
  } catch (erreur) {
    console.log(erreur)
    return { succes: false }
  }
}

// Supprimer un logement
export const supprimerLogement = async (id) => {
  try {
    await deleteDoc(doc(db, 'logements', id))
    return { succes: true }
  } catch (erreur) {
    console.log(erreur)
    return { succes: false }
  }
}