import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { ecouterLogements } from "../firebase/logements";

const Acceuil = () => {
    const[recherche, setRecherche] = useState('');
    const[typeFiltre, setTypeFiltre] = useState('tous')
    const [logements, setLogements] = useState([])
     const [chargement, setChargement] = useState(true)

     useEffect(() => {
    const unsubscribe = ecouterLogements((data) => {
      setLogements(data)
      setChargement(false)
    })
    return unsubscribe
  }, [])

    const LogementsFiltres = logements.filter(l => {
        const correspondville =  l.ville.toLowerCase().includes(recherche.toLowerCase()) || l.titre.toLowerCase().includes(recherche.toLowerCase())
        const correspondType = typeFiltre === 'Tous' || l.type === typeFiltre
    return correspondville && correspondType
    })
    
    return (
        
 <div   className="relative min-h-screen py-24 px-4 "
  style={{
    backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}>
     <div className=" py-16 px-4 text-center ">
        <h1 className="text-4xl font-bold mb-4 text-white">Trouvez un logement rapidement au Cameroun</h1>
        <p className="text-lg mb-8 text-white">Chambre, Maison, studios disponible près de vous</p>
         </div>
         <div className="flex justify-center">
        <input 
         type="text"
          placeholder="rechercher un logement par ville ou titre " 
          className="w-full max-w-lg p-3 rounded-l-lg text-gray-800 focus:border-sky-500 focus:outline focus:outline-sky-500 disabled:bg-gray-50  dark:disabled:bg-gray-800/20"
          value={recherche} 
          onChange={(e) => setRecherche(e.target.value)}
        />
        <button className="bg-gray-400 text-gray-800 font-bold px-6 rounded-r-lg hover:bg-yellow-500 ">Rechercher</button>
     </div>

      <div className="flex justify-center gap-4 my-6">
        {['Tous', 'Chambre', 'Studio', 'Maison'].map(type => (
          <button
            key={type}
            onClick={() => setTypeFiltre(type)}
            className={`px-4 py-2 rounded-full font-semibold border ${typeFiltre === type ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border-blue-600'} hover:bg-blue-600 hover:text-white transition`}
          >
            {type}
          </button>
        ))}
      </div>


     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8 pb-10">
        {chargement ? (
          <p className="text-center col-span-3 text-gray-400">Chargement des logements...</p>
        ):LogementsFiltres.length==0 ? (
            <p className="text-center col-span-3 text-black">Aucun Logement trouvé</p>
        ) : (
            LogementsFiltres.map(logement => (
                <div key={logement.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                    <img src={logement.image} alt={logement.titre} className="w-full h-48 object-cover"  />
                     <div className="p-4">
                      <span className="text-xs bg-blue-100 text-blue-600 font-semibold px-2 py-1 rounded-full">{logement.type}</span>
                      <h2 className="text-lg font-bold mt-2">{logement.titre}</h2>
                      <p className="text-gray-500 text-sm">📍 {logement.ville}</p>
                      <div className="flex justify-between items-center mt-4">
                      <span className="text-blue-600 font-bold">{logement.prix.toLocaleString()} FCFA/mois</span>
                      <Link to={`/logement/${logement.id}`} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                      Voir détails
                    </Link>
                </div>
              </div>
            </div>
            ))
        )}
     </div>
     </div>
    
    )
}

export default Acceuil;
