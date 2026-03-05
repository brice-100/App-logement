import { useState } from "react";
import {Link} from 'react-router-dom';

const logementsDuProprietaire = [
  { id: 1, titre: "Studio moderne centre-ville", ville: "Yaoundé", type: "Studio", prix: 50000, disponible: true, reservations: 2 },
  { id: 3, titre: "Maison 3 pièces avec jardin", ville: "Yaoundé", type: "Maison", prix: 120000, disponible: false, reservations: 1 },
]
const Dashboard = () => {
    const [logements, setLogements] = useState(logementsDuProprietaire)
    const [afficherFormulaire , setAfficherFormulaire] = useState(false)
       const [formData, setFormData] = useState(
        {
            Description:'',
            titre:'',
            adresse:'',
            ville:'',
            prix:'',
            type:'Chambre'
        }
    )
 
    const handlechange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

  const handleAjouter = (e) => {
    e.preventDefault()
    if (!formData.titre || !formData.ville || !formData.prix) {
      alert('Veuillez remplir tous les champs obligatoires')
      return
    }
     const nouveauLogement = {
      id: logements.length + 1,
      ...formData,
      prix: parseInt(formData.prix),
      disponible: true,
      reservations: 0,
    }
    setLogements([...logements, nouveauLogement])
    setAfficherFormulaire(false)
    setFormData({ titre: '', ville: '', type: 'Chambre', prix: '', adresse: '', description: '' })
    alert('Logement ajouté avec succès !')
  }

  const handleSupprimer = (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce logement ?')) {
      setLogements(logements.filter(l => l.id !== id))
    }
  }

  const handleDisponibilite = (id) => {
    setLogements(logements.map(l =>
      l.id === id ? { ...l, disponible: !l.disponible } : l
    ))
  }
    return (
        <div className="max-w-5xl mx-auto px-4 pt-16 pb-10">
             {/* En-tête */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-gray-500">Bienvenue, {formData.nom}👋</p>
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
            {logements.reduce((total, l) => total + l.reservations, 0)}
          </p>
          <p className="text-gray-600 mt-1">Réservations reçues</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            {logements.filter(l => l.disponible).length}
          </p>
          <p className="text-gray-600 mt-1">Logements disponibles</p>
        </div>
      </div>

      {/* Formulaire d'ajout */}
      {afficherFormulaire && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Nouveau logement</h2>
          <form onSubmit={handleAjouter} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Titre *</label>
              <input type="text" name="titre" value={formData.titre} onChange={handlechange}
                placeholder="Ex: Studio moderne centre-ville"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Ville *</label>
              <input type="text" name="ville" value={formData.ville} onChange={handlechange}
                placeholder="Ex: Yaoundé"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Type *</label>
              <select name="type" value={formData.type} onChange={handlechange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500">
                <option value="Chambre">Chambre</option>
                <option value="Studio">Studio</option>
                <option value="Maison">Maison</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Prix / mois (FCFA) *</label>
              <input type="number" name="prix" value={formData.prix} onChange={handlechange}
                placeholder="Ex: 50000"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Adresse</label>
              <input type="text" name="adresse" value={formData.adresse} onChange={handlechange}
                placeholder="Ex: Rue Nachtigal, Yaoundé Centre"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-gray-600 mb-1 block">Description</label>
              <textarea name="description" value={formData.description} onChange={handlechange}
                placeholder="Décrivez votre logement..."
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500" />
            </div>

            <div className="sm:col-span-2">
              <button type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition w-full">
                ✅ Publier le logement
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Liste des logements */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Mes logements</h2>
        {logements.length === 0 ? (
          <p className="text-gray-500 text-center py-6">Vous n'avez pas encore de logements publiés.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {logements.map(logement => (
              <div key={logement.id} className="border border-gray-200 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">{logement.type}</span>
                  <h3 className="font-bold mt-1">{logement.titre}</h3>
                  <p className="text-gray-500 text-sm">📍 {logement.ville} — {logement.prix.toLocaleString()} FCFA/mois</p>
                  <p className="text-gray-400 text-sm">📅 {logement.reservations} réservation(s)</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleDisponibilite(logement.id)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${logement.disponible ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                  >
                    {logement.disponible ? '✅ Disponible' : '❌ Indisponible'}
                  </button>
                  <Link to={`/logement/${logement.id}`}
                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-gray-200">
                    👁 Voir
                  </Link>
                  <button
                    onClick={() => handleSupprimer(logement.id)}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200">
                    🗑 Supprimer
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

export default Dashboard;
