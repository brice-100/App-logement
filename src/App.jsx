import { useState } from 'react'
import {BrowserRouter, Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar'
import Acceuil from './pages/Acceuil'
import Connexion from './pages/Connexion'
import Dashboard from './pages/Dashboard'
import DetailLogement from './pages/DetailLogement'
import Favories from './pages/Favories'
import Messagerie from './pages/Messagerie'
import Inscription from './pages/Inscription'
import Deconnexion from './pages/Deconnexion'

const App = () =>{
 const [favoris, setFavoris] = useState([])
  const ajouterFavori = (logement) => {
    const dejaPresent = favoris.find(f => f.id === logement.id)
    if (dejaPresent) {
      alert('Ce logement est déjà dans vos favoris !')
      return
    }
    setFavoris([...favoris, logement])
    alert('Logement ajouté aux favoris !')
  }

  const retirerFavori = (id) => {
    setFavoris(favoris.filter(f => f.id !== id))
  }

  const estFavori = (id) => {
    return favoris.some(f => f.id === id)
  }
  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<Acceuil />}/>
      <Route path="/logement/:id"  element={<DetailLogement   ajouterFavori={ajouterFavori} estFavori={estFavori}/>} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/connexion" element={<Deconnexion />} />
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/messagerie" element={<Messagerie  />} />
      <Route path="/favoris" element={<Favories  favoris={favoris} retirerFavori={retirerFavori}/>} />
    </Routes>
    </BrowserRouter>
  )
}
export default App;