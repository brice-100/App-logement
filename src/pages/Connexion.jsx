
import { useState} from 'react'
import { useNavigate ,Link} from 'react-router-dom';
import { FaLock, FaEye,FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'

const Connexion = () => {
    const [isConnexion, setIsConnexion] = useState(true);
     const [erreur, setErreur] = useState('');
     const { connexion, inscription } = useAuth()
     const Navigate = useNavigate();
    const [formData, setFormData] = useState(
        {
            nom:'',
            prenom:'',
            email:'',
            password:'',
            role:'locataire'
        }
    )
    const handlechange = (e) =>{
         
         setFormData({...formData, [e.target.name]: e.target.value})

    }
    const handleSubmit = async (e) =>{
        e.preventDefault()
        if (!formData.email || !formData.password){
            setErreur("veuillez remplir tous les champs ")
            return
        }
        setErreur('')
  if (isConnexion) {
    // Connexion
    const resultat = await connexion(formData.email, formData.password)
    if (resultat.succes) {
      Navigate('/')
    } else {
      setErreur(resultat.message)
    }
  } else {
    // Inscription
    if (!formData.nom || !formData.prenom) {
      setErreur('Veuillez remplir votre nom et prénom')
      return
    }
    const resultat = await inscription(formData)
    if (resultat.succes) {
      if (formData.role === 'proprietaire') {
        Navigate('/dashboard')
      } else {
        Navigate('/')
      }
    } else {
      setErreur(resultat.message)
    }
  }
}

    return (
        <div  className="min-h-screen  flex items-center justify-center px-4 pt-16  bg-white dark:bg-gray-900">
            <div className="rounded-2xl shadow-lg w-full max-w-md p-8  bg-white dark:bg-gray-800">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-600"> LogiFind</h1>
                    <p className="text-gray-500 mt-1">
                    {isConnexion ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
                    </p>
                </div>
                
                <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
                    <button onClick={() => setIsConnexion(true)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${isConnexion ? 'bg-white text-blue-600 shadow   hover:bg-blue-400' : 'text-gray-500  hover:bg-blue-400'}`}>
                    Connexion
                    </button>
                     <button onClick={() => setIsConnexion(false)}
                    className={`flex-1 py-2 rounded-lg font-semibold transition ${isConnexion ? 'bg-white text-blue-600 shadow  hover:bg-blue-400' : 'text-gray-500  hover:bg-blue-400'}`}>
                    Inscription
                    </button>
                </div>

                {erreur && (
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                ⚠️ {erreur}
                </div>
                )}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                   {!isConnexion && (
                    <>
                    <div className="flex gap-3">
                        <div className="flex-1">
                            <label className="text-sm font-semibold text-gray-500 mb-1 block">Nom</label>
                            <input
                            type="text"
                            name="nom"
                            placeholder="Votre nom"
                            value={formData.nom}
                            onChange={handlechange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                            />
                           </div>
                           <div className="flex-1">
                               <label className="text-sm font-semibold text-gray-500 mb-1 block">Prénom</label>
                               <input
                               type="text"
                               name="prenom"
                               placeholder="Votre prénom"
                               value={formData.prenom}
                               onChange={handlechange}
                               className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                              />
                              </div>
                        </div>
                        <div>
                           <label className="text-sm font-semibold text-gray-500 mb-1 block">Je suis</label>
                           <select
                           name="role"
                           value={formData.role}
                           onChange={handlechange}
                           className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none text-gray-800 focus:border-blue-500"
                           >
                           <option value="locataire">Locataire — Je cherche un logement</option>
                           <option value="proprietaire">Propriétaire — Je propose un logement</option>
                           </select>
                        </div>
                    </>
                )}

  
  <div>
    <label className="text-sm font-semibold text-gray-500 mb-1 block">Email</label>
    <input
      type="email"
      name="email"
      placeholder="exemple@gmail.com"
      value={formData.email}
      onChange={handlechange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
    />
  </div>

  
  <div>
    <label className="text-sm font-semibold text-gray-400 mb-1 block">Mot de passe</label>
    <input
      type="password"
      name="password"
      placeholder="••••••••"
      value={formData.password}
      onChange={handlechange}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
    />
  </div>

  <button
    type="submit"
    className="bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition mt-2"
  >
    {isConnexion ? 'Se connecter' : "S'inscrire"}
  </button>

</form>
                 <p className="text-center text-gray-500 text-sm mt-6">
                    {isConnexion ? "Pas encore de compte ? " : "Déjà un compte ? "}
                <button
                onClick={() => setIsConnexion(!isConnexion)}
                className="text-blue-600 font-semibold hover:underline"
                >
                {isConnexion ? "S'inscrire" : "Se connecter"}
                </button>
                 </p>
            </div>
        </div>    
 )
}

export default Connexion;
