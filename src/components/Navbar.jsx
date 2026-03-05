import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const {theme, toggleTheme}=useTheme()
  const {utilisateur, deconnexion}=useAuth()
   const navigate = useNavigate()

  const handleDeconnexion = async () => {
    await deconnexion()
    navigate('/')
  }
  const [open, setOpen] = useState(false)
    return (
        <nav className=" p-4 flex justify-between items-center fixed w-full backdrop-blur h-16 bg-white dark:bg-gray-600 bg-white/80 shadow z-50">
      <Link to="/" className="text-xl font-bold"> LogiFind</Link>
      <div className="hidden md:flex  space-x-6 gap-4">
        <Link to="/" className="hover:underline px-4 py-2 rounded-full font-semibold border bg-zinc-400 hover:bg-zinc-600">Accueil</Link>
        <Link to="/favoris" className="hover:underline px-4 py-2 rounded-full font-semibold border ">Favoris</Link>
        <Link to="/messagerie" className="hover:underline px-4 py-2 rounded-full font-semibold border">Messagerie</Link>
      </div>
          <div className="p-1 bg-white rounded-lg dark:bg-gray-900 text-black dark:text-white">
      <button
        onClick={toggleTheme}
        className="px-1 py-1 bg-gray-200 dark:bg-gray-700 rounded-full"
      >
        Mode {theme === "light" ? "Dark" : "Light"}
      </button>
      </div>
           <button className='md:hidden text-2xl' onClick={() => setOpen(!open)}>
         ☰
      </button>
     {open && (
      <div className="md:hidden absolute top-16 left-0  flex flex-col p-6 space-y-6 bg-gray-400 rounded
      transform transition-transform duration-5000 translate-x-0 ">
         <Link to="/" className="hover:underline px-4 py-2 rounded-full font-semibold border bg-blue-400">Accueil</Link>
         <Link to="/favoris" className="hover:underline px-4 py-2 rounded-full font-semibold border  bg-blue-400">Favoris</Link>
        <Link to="/messagerie" className="hover:underline px-4 py-2 rounded-full font-semibold border  bg-blue-400">Messagerie</Link>
        <Link to="/connexion" className="hover:underline px-4 py-2 rounded-full font-semibold border  bg-blue-400">Connexion</Link>
      </div>
     )}

     {utilisateur?.role === 'proprietaire' &&  (
      <Link to="/dashboard" className="hover:underline hidden md:block">Dashboard</Link>
     )}
        {utilisateur ? (
          <div className="flex items-center gap-3">
            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
              👤 {utilisateur.prenom}
            </span>
            <button
              onClick={handleDeconnexion}
              className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Déconnexion
            </button>
          </div>
        ) : (
          /* Si non connecté → afficher connexion */
          <Link
            to="/connexion"
            className="bg-white text-blue-600 font-semibold px-3 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            Connexion
          </Link>
        )}
    </nav>
    )
}

export default Navbar;
