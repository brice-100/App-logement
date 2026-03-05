import { useState,useEffect,useRef } from "react";
import { uploaderImage } from '../cloudinary/upload'
import {Link} from 'react-router-dom';
import { useAuth } from '../context/AuthContext'
import {
  ajouterLogement,
  ecouterLogementsProprietaire,
  supprimerLogement,
  modifierDisponibilite
} from '../firebase/logements'

  const Dashboard = () => {
  const { utilisateur } = useAuth()
  const [images, setImages] = useState([])
  const [progression, setProgression] = useState(0)
  const [logements, setLogements] = useState([])
  const [afficherFormulaire, setAfficherFormulaire] = useState(false)
  const [chargement, setChargement] = useState(true)
  const [uploading, setUploading] = useState(false)
  const inputImageRef = useRef(null)
  const [formData, setFormData] = useState({
    titre: '',
    ville: '',
    type: 'Chambre',
    prix: '',
    adresse: '',
    description: '',
    image:'',
  })

 // Écouter les logements du propriétaire en temps réel
  useEffect(() => {
    if (!utilisateur) return
    const unsubscribe = ecouterLogementsProprietaire(utilisateur.uid, (data) => {
      setLogements(data)
      setChargement(false)
    })
    return unsubscribe
  }, [utilisateur])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImages = async (e) => {
  const fichiers = Array.from(e.target.files)
  if (fichiers.length === 0) return
  if (images.length + fichiers.length > 5) {
    alert('Maximum 5 images par logement')
    return
  }

  setUploading(true)
  const nouvellesUrls = []

  for (const fichier of fichiers) {
    try {
      const url = await uploaderImage(fichier, (prog) => {
        setProgression(prog)
      })
      nouvellesUrls.push(url)
    } catch (erreur) {
      console.log(erreur)
      alert('Erreur lors de l\'upload de ' + fichier.name)
    }
  }

  setImages(prev => [...prev, ...nouvellesUrls])
  setUploading(false)
  setProgression(0)
}

const supprimerImage = (index) => {
  setImages(images.filter((_, i) => i !== index))
}

  const handleAjouter = async (e) => {
    e.preventDefault()
    console.log('Utilisateur:', utilisateur)
    if (!formData.titre || !formData.ville || !formData.prix) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
    if (images.length === 0) {
    alert('Veuillez ajouter au moins une image')
    return
  }
    const resultat = await ajouterLogement({
      ...formData,
      prix: parseInt(formData.prix),
       image: images[0],
       images: images,
    }, utilisateur)

    if (resultat.succes) {
      setAfficherFormulaire(false)
      setFormData({ titre: '', ville: '', type: 'Chambre', prix: '', adresse: '', description: '' })
      setImages([])
      alert('Logement ajouté avec succès !')
    } else {
      alert('Erreur lors de l\'ajout')
    }
  }

  const handleSupprimer = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce logement ?')) {
      await supprimerLogement(id)
    }
  }

  const handleDisponibilite = async (id, disponible) => {
    await modifierDisponibilite(id, !disponible)
  }

   return (
    <div className="max-w-5xl mx-auto px-4 pt-20 pb-10">

      {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue, {utilisateur?.prenom}</p>
        </div>
        <button
          onClick={() => setAfficherFormulaire(!afficherFormulaire)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
        >
          {afficherFormulaire ? '✕ Annuler' : '+ Ajouter un logement'}
        </button>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{logements.length}</p>
          <p className="text-gray-600 mt-1">Logements publiés</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-green-600">
            {logements.filter(l => l.disponible).length}
          </p>
          <p className="text-gray-600 mt-1">Logements disponibles</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {logements.filter(l => !l.disponible).length}
          </p>
          <p className="text-gray-600 mt-1">Logements indisponibles</p>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {afficherFormulaire && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Nouveau logement</h2>
          <form onSubmit={handleAjouter} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Titre *</label>
              <input type="text" name="titre" value={formData.titre} onChange={handleChange}
                placeholder="Ex: Studio moderne centre-ville"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Ville *</label>
              <input type="text" name="ville" value={formData.ville} onChange={handleChange}
                placeholder="Ex: Yaoundé"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Type *</label>
              <select name="type" value={formData.type} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option value="Chambre">Chambre</option>
                <option value="Studio">Studio</option>
                <option value="Maison">Maison</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Prix / mois (FCFA) *</label>
              <input type="number" name="prix" value={formData.prix} onChange={handleChange}
                placeholder="Ex: 50000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
  <label className="text-sm font-semibold text-gray-600 mb-1 block">
    Photos du logement * (max 5)
  </label>

  {/* Bouton choisir images */}
  <input
    type="file"
    accept="image/*"
    multiple
    ref={inputImageRef}
    onChange={handleImages}
    className="hidden"
  />
  <button
    type="button"
    onClick={() => inputImageRef.current.click()}
    disabled={uploading}
    className="w-full border-2 border-dashed border-blue-400 rounded-xl p-6 text-blue-600 font-semibold hover:bg-blue-50 transition flex flex-col items-center gap-2"
  >
    <span className="text-3xl">📷</span>
    <span>{uploading ? `Upload en cours... ${progression}%` : 'Cliquez pour choisir des photos'}</span>
    <span className="text-xs text-gray-400">JPG, PNG — Max 5 images</span>
  </button>

  {/* Barre de progression */}
  {uploading && (
    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all"
        style={{ width: `${progression}%` }}
      />
    </div>
  )}

  {/* Prévisualisation des images */}
  {images.length > 0 && (
    <div className="grid grid-cols-3 gap-2 mt-3">
      {images.map((url, index) => (
        <div key={index} className="relative">
          <img
            src={url}
            alt={`image ${index + 1}`}
            className="w-full h-24 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => supprimerImage(index)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
          >
            ✕
          </button>
          {index === 0 && (
            <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-1 rounded">
              Principal
            </span>
          )}
        </div>
      ))}
    </div>
  )}
</div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Adresse</label>
              <input type="text" name="adresse" value={formData.adresse} onChange={handleChange}
                placeholder="Ex: Rue Nachtigal, Yaoundé Centre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange}
                placeholder="Décrivez votre logement..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full">
                 Publier le logement
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des logements */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Mes logements</h2>
        {chargement ? (
          <p className="text-center text-gray-400">Chargement...</p>
        ) : logements.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Vous n'avez pas encore de logements publiés.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {logements.map(logement => (
              <div key={logement.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">{logement.type}</span>
                  <h3 className="font-bold mt-1">{logement.titre}</h3>
                  <p className="text-gray-500 text-sm">📍 {logement.ville} — {logement.prix?.toLocaleString()} FCFA/mois</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDisponibilite(logement.id, logement.disponible)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${logement.disponible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                  >
                    {logement.disponible ? ' Disponible' : ' Indisponible'}
                  </button>
                  <Link to={`/logement/${logement.id}`}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-200">
                     Voir
                  </Link>
                  <button
                    onClick={() => handleSupprimer(logement.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200">
                     Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard