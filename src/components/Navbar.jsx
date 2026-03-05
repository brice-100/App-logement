import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const {theme, toggleTheme} = useTheme()
    const {utilisateur, deconnexion} = useAuth()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)

    const handleDeconnexion = async () => {
        await deconnexion()
        setOpen(false)
        navigate('/')
    }

    return (
        <nav className="p-4 flex justify-between items-center fixed w-full backdrop-blur h-16 bg-white dark:bg-gray-600 bg-white/80 shadow z-50">
            
            {/* Logo */}
            <Link to="/" className="text-xl font-bold">LogiFind</Link>

            {/* Liens bureau */}
            <div className="hidden md:flex space-x-6 gap-4">
                <Link to="/" className="hover:underline px-4 py-2 rounded-full font-semibold border bg-zinc-400 hover:bg-zinc-600">Accueil</Link>
                <Link to="/favoris" className="hover:underline px-4 py-2 rounded-full font-semibold border">Favoris</Link>
                <Link to="/messagerie" className="hover:underline px-4 py-2 rounded-full font-semibold border">Messagerie</Link>
                {utilisateur?.role === 'proprietaire' && (
                    <Link to="/dashboard" className="hover:underline px-4 py-2 rounded-full font-semibold border">Dashboard</Link>
                )}
            </div>

            {/* Bouton theme */}
            <div className="p-1 bg-white rounded-lg dark:bg-gray-900 text-black dark:text-white">
                <button onClick={toggleTheme} className="px-1 py-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                    Mode {theme === "light" ? "Dark" : "Light"}
                </button>
            </div>

            {/* Profil bureau */}
            <div className="hidden md:flex items-center gap-3">
                {utilisateur ? (
                    <>
                        <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">
                            👤 {utilisateur.prenom}
                        </span>
                        <button onClick={handleDeconnexion} className="bg-red-500 text-white font-semibold px-3 py-1 rounded-lg hover:bg-red-600 transition">
                            Déconnexion
                        </button>
                    </>
                ) : (
                    <Link to="/connexion" className="bg-white text-blue-600 font-semibold px-3 py-1 rounded-lg hover:bg-gray-100 transition">
                        Connexion
                    </Link>
                )}
            </div>

            {/* Bouton 3 traits mobile */}
            <button className='md:hidden text-2xl' onClick={() => setOpen(!open)}>
                ☰
            </button>

            {/* Menu mobile → TOUT est ici */}
            {open && (
                <div className="md:hidden absolute top-16 left-0  rounded-lg flex flex-col p-6 space-y-4 bg-white dark:bg-gray-600 shadow-lg z-50 transition-all duration-300">
                    
                    {/* Liens navigation */}
                    <Link to="/" onClick={() => setOpen(false)} className="hover:underline px-4 py-2 rounded-full font-semibold border bg-blue-400 ">Accueil</Link>
                    <Link to="/favoris" onClick={() => setOpen(false)} className="hover:underline px-4 py-2 rounded-full font-semibold border bg-blue-400">Favoris</Link>
                    <Link to="/messagerie" onClick={() => setOpen(false)} className="hover:underline px-4 py-2 rounded-full font-semibold border bg-blue-400">Messagerie</Link>
                    
                    {/* Dashboard si proprietaire */}
                    {utilisateur?.role === 'proprietaire' && (
                        <Link to="/dashboard" onClick={() => setOpen(false)} className="hover:underline px-4 py-2 rounded-full font-semibold border bg-blue-400">
                            Dashboard
                        </Link>
                    )}

                    {/* Connexion ou Profil */}
                    {utilisateur ? (
                        <>
                            <span className="text-sm bg-blue-500 px-4 py-2 rounded-full font-semibold text-center">
                                👤 {utilisateur.prenom}
                            </span>
                            <button onClick={handleDeconnexion} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600 transition">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <Link to="/connexion" onClick={() => setOpen(false)} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition">
                            Connexion
                        </Link>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar;