import { Link } from 'react-router-dom'

const Favoris = ({ favoris, retirerFavori }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 pt-16 pb-10">

      <h1 className="text-2xl font-bold mb-6">❤️ Mes Favoris</h1>

      {favoris.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">Vous n'avez pas encore de logements favoris</p>
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
            Parcourir les logements
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoris.map(logement => (
            <div key={logement.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <img
                src={logement.image}
                alt={logement.titre}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">
                  {logement.type}
                </span>
                <h2 className="text-lg font-bold mt-2">{logement.titre}</h2>
                <p className="text-gray-500 text-sm">📍 {logement.ville}</p>
                <p className="text-blue-600 font-bold mt-2">{logement.prix.toLocaleString()} FCFA/mois</p>
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/logement/${logement.id}`}
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
                  >
                    Voir détails
                  </Link>
                  <button
                    onClick={() => retirerFavori(logement.id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-200"
                  >
                    🗑 Retirer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favoris