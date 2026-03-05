import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getLogement } from '../firebase/logements'
import { useAuth } from '../context/AuthContext'
import { getOuCreerConversation } from '../firebase/messagerie'

const DetailLogement = ({ ajouterFavori, estFavori }) => {
  const { utilisateur } = useAuth()
  const [logement, setLogement] = useState(null)
  const [chargement, setChargement] = useState(true)
  const navigate = useNavigate()
  const { id } = useParams()

  // Charger le logement depuis Firestore
  useEffect(() => {
    const charger = async () => {
      const data = await getLogement(id)
      setLogement(data)
      setChargement(false)
    }
    charger()
  }, [id])

  // Contacter le propriétaire
  const handleContacter = async () => {
    console.log('Logement complet:', logement) 
    if (!utilisateur) {
      navigate('/connexion')
      return
    }
     if (!logement.proprietaireId) {
    alert('Impossible de contacter le propriétaire')
    return
  }
    const convId = await getOuCreerConversation(
      utilisateur.uid,
      logement.proprietaireId,
      logement.id,
      logement.titre
    )
    if (convId) {
      navigate('/messagerie')
    }
  }

  if (chargement) {
    return (
      <div className="text-center py-20 pt-24">
        <p className="text-gray-400">Chargement...</p>
      </div>
    )
  }

  if (!logement) {
    return (
      <div className="text-center py-20 pt-24">
        <h2 className="text-2xl font-bold text-gray-600">Logement introuvable</h2>
        <Link to="/" className="text-blue-600 underline mt-4 block">Retour à l'accueil</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-8">

      {/* Bouton retour */}
      <Link to="/" className="text-blue-600 hover:underline mb-4 block">← Retour aux logements</Link>

      {/* Images */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {logement.images?.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`photo ${index + 1}`}
            className="w-full h-56 object-cover rounded-xl"
          />
        ))}
      </div>

      {/* Infos principales */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">
              {logement.type}
            </span>
            <h1 className="text-2xl font-bold mt-2">{logement.titre}</h1>
            <p className="text-gray-500 mt-1">📍 {logement.adresse}, {logement.ville}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-blue-600">{logement.prix?.toLocaleString()} FCFA</p>
            <p className="text-gray-400 text-sm">par mois</p>
          </div>
        </div>

        {/* Disponibilité */}
        <div className="mt-4">
          {logement.disponible ? (
            <span className="bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full text-sm">
              ✅ Disponible
            </span>
          ) : (
            <span className="bg-red-100 text-red-600 font-semibold px-3 py-1 rounded-full text-sm">
              ❌ Non disponible
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Description</h2>
        <p className="text-gray-600 leading-relaxed">{logement.description}</p>
      </div>

      {/* Propriétaire */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Propriétaire</h2>
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">
            {logement.proprietaireNom?.charAt(0)}
          </div>
          <p className="font-semibold text-gray-700">{logement.proprietaireNom}</p>
        </div>
      </div>
        <button
          onClick={() => ajouterFavori(logement)}
          className={`flex-1 border-2 py-3 rounded-xl font-bold transition ${
            estFavori(logement.id)
              ? 'bg-red-500 text-white border-red-500'
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          {estFavori(logement.id) ? '❤️ Dans vos favoris' : '🤍 Ajouter aux favoris'}
        </button>
        <button
          onClick={handleContacter}
          className="flex-1 bg-green-500 text-white text-center py-3 rounded-xl font-bold hover:bg-green-600 transition"
        >
           Contacter le propriétaire
        </button>
      </div>
  )
}

export default DetailLogement