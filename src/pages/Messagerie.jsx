import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { ecouterConversations, ecouterMessages, envoyerMessage,supprimerConversation } from '../firebase/messagerie'

const Messagerie = () => {
  const { utilisateur } = useAuth()
  const [conversations, setConversations] = useState([])
  const [convActive, setConvActive] = useState(null)
  const [messages, setMessages] = useState([])
  const [nouveauMessage, setNouveauMessage] = useState('')
  const [chargement, setChargement] = useState(true)
  const messagesEndRef = useRef(null)

  // Faire défiler vers le bas automatiquement
  const scrollVersLesBas = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Écouter les conversations en temps réel
  useEffect(() => {
    if (!utilisateur || !utilisateur.uid) return
    const unsubscribe = ecouterConversations(utilisateur.uid, (convs) => {
      setConversations(convs)
      setChargement(false)
      // Sélectionner la première conversation par défaut
      if (convs.length > 0 && !convActive) {
        setConvActive(convs[0])
      }
    })

    return unsubscribe
  }, [utilisateur?.uid])

  // Écouter les messages de la conversation active en temps réel
  useEffect(() => {
    if (!convActive) return

    const unsubscribe = ecouterMessages(convActive.id, (msgs) => {
      setMessages(msgs)
      scrollVersLesBas()
    })

    return unsubscribe
  }, [convActive])

  const handleSupprimer = async (convId) => {
  if (window.confirm('Voulez-vous vraiment supprimer cette conversation ?')) {
    await supprimerConversation(convId)
    setConvActive(null)
    setMessages([])
  }
}

  // Scroll automatique quand nouveaux messages
  useEffect(() => {
    scrollVersLesBas()
  }, [messages])

  const handleEnvoyer = async () => {
    if (!nouveauMessage.trim() || !convActive) return

    await envoyerMessage(convActive.id, utilisateur.uid, nouveauMessage)
    setNouveauMessage('')
  }

  if (!utilisateur) {
    return (
      <div className="text-center py-20 pt-24">
        <p className="text-gray-500">Connectez-vous pour accéder à la messagerie</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10 bg-white dark:bg-gray-700">
      <h1 className="text-2xl font-bold mb-6"> Messagerie</h1>

      {chargement ? (
        <p className="text-center text-gray-400">Chargement...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">Aucune conversation pour l'instant</p>
        </div>
      ) : (
        <div className="flex gap-4 h-[500px]">

          {/* Liste conversations à gauche */}
          <div className="w-1/3 bg-white rounded-2xl shadow-md overflow-y-auto">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setConvActive(conv)}
                className={`p-4 cursor-pointer border-b hover:bg-blue-50 transition ${convActive?.id === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                    🏠
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{conv.logementTitre}</p>
                    <p className="text-xs text-gray-400">
                      {conv.locataireId === utilisateur.uid ? 'Propriétaire' : 'Locataire'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Zone messages à droite */}
          {convActive ? (
            <div className="flex-1 bg-white rounded-2xl shadow-md flex flex-col">

              {/* En-tête */}
              <div className="p-4 border-b flex items-center gap-3">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  🏠
                </div>
                <div>
                  <p className="font-semibold">{convActive.logementTitre}</p>
                  <p className="text-xs text-gray-400">Conversation en cours</p>
                  <button
        onClick={() => handleSupprimer(convActive.id)}
        className="mt-2 w-full bg-red-100 text-red-600 text-xs py-1 rounded-lg hover:bg-red-200 transition"
      >
         Supprimer la conversation
      </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm mt-10">
                    Aucun message. Commencez la conversation !
                  </p>
                ) : (
                  messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.expediteurId === utilisateur.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                        message.expediteurId === utilisateur.uid
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}>
                        <p>{message.contenu}</p>
                        <p className={`text-xs mt-1 ${message.expediteurId === utilisateur.uid ? 'text-blue-200' : 'text-gray-400'}`}>
                          {message.createdAt?.toDate().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Champ envoi */}
              <div className="p-4 border-t flex gap-2">
                <input
                  type="text"
                  placeholder="Écrire un message..."
                  value={nouveauMessage}
                  onChange={(e) => setNouveauMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleEnvoyer()}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleEnvoyer}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                  Envoyer
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 bg-white rounded-2xl shadow-md flex items-center justify-center">
              <p className="text-gray-400">Sélectionnez une conversation</p>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

export default Messagerie