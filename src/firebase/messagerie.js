import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getDocs
} from 'firebase/firestore'
import { db } from './config'

// Créer ou récupérer une conversation existante
export const getOuCreerConversation = async (locataireId, proprietaireId, logementId, logementTitre) => {
  try {
     if (!locataireId || !proprietaireId || !logementId || !logementTitre) {
      console.error('Paramètres manquants:', { locataireId, proprietaireId, logementId, logementTitre })
      return null
    }

    // Vérifier si une conversation existe déjà
    const q = query(
      collection(db, 'conversations'),
      where('locataireId', '==', locataireId),
      where('proprietaireId', '==', proprietaireId),
      where('logementId', '==', logementId)
    )
    const snapshot = await getDocs(q)

    // Si elle existe, retourner son id
    if (!snapshot.empty) {
      return snapshot.docs[0].id
    }

    // Sinon créer une nouvelle conversation
    const nouvelleConv = await addDoc(collection(db, 'conversations'), {
      locataireId,
      proprietaireId,
      logementId,
      logementTitre,
      createdAt: serverTimestamp()
    })

    return nouvelleConv.id
  } catch (erreur) {
    console.error('Erreur conversation:', erreur)
    return null
  }
}

// Envoyer un message
export const envoyerMessage = async (conversationId, expediteurId, contenu) => {
  try {
    await addDoc(
      collection(db, 'conversations', conversationId, 'messages'),
      {
        expediteurId,
        contenu,
        createdAt: serverTimestamp()
      }
    )
    return { succes: true }
  } catch (erreur) {
    console.error('Erreur envoi message:', erreur)
    return { succes: false }
  }
   
}

export const supprimerConversation = async (conversationId) => {
  try {
    // Supprimer tous les messages de la conversation
    const messagesRef = collection(db, 'conversations', conversationId, 'messages')
    const snapshot = await getDocs(messagesRef)
    snapshot.docs.forEach(async (doc) => {
      await deleteDoc(doc.ref)
    })
    // Supprimer la conversation
    await deleteDoc(doc(db, 'conversations', conversationId))
    return { succes: true }
  } catch (erreur) {
    console.error('Erreur suppression conversation:', erreur)
    return { succes: false }
  }
}

// Écouter les messages en temps réel
export const ecouterMessages = (conversationId, callback) => {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('createdAt', 'asc')
  )
  // onSnapshot écoute les changements en temps réel
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    callback(messages)
  })
  return unsubscribe
}

export const ecouterConversations = (userId, callback) => {
  const toutesLesConversations = {}
  let unsubscribe1 = null
  let unsubscribe2 = null

  const mettreAJour = () => {
    callback(Object.values(toutesLesConversations))
  }

  unsubscribe1 = onSnapshot(
    query(collection(db, 'conversations'), where('locataireId', '==', userId)),
    (snapshot) => {
      snapshot.docs.forEach(doc => {
        toutesLesConversations[doc.id] = { id: doc.id, ...doc.data() }
      })
      // Supprimer les conversations supprimées
      const ids = snapshot.docs.map(d => d.id)
      Object.keys(toutesLesConversations).forEach(key => {
        if (!ids.includes(key) && toutesLesConversations[key].locataireId === userId) {
          delete toutesLesConversations[key]
        }
      })
      mettreAJour()
    }
  )

  unsubscribe2 = onSnapshot(
    query(collection(db, 'conversations'), where('proprietaireId', '==', userId)),
    (snapshot) => {
      snapshot.docs.forEach(doc => {
        toutesLesConversations[doc.id] = { id: doc.id, ...doc.data() }
      })
      // Supprimer les conversations supprimées
      const ids = snapshot.docs.map(d => d.id)
      Object.keys(toutesLesConversations).forEach(key => {
        if (!ids.includes(key) && toutesLesConversations[key].proprietaireId === userId) {
          delete toutesLesConversations[key]
        }
      })
      mettreAJour()
    }
  )

  return () => {
    if (unsubscribe1) unsubscribe1()
    if (unsubscribe2) unsubscribe2()
  }
}