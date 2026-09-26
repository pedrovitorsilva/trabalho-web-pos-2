import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
//import Home from './routes/Home'
import Products from './routes/Products'
import Resgates from './routes/Resgates'
import Entries from './routes/Entries'
import Pdv from './routes/Pdv'
import Pessoas from './routes/Pessoas'
import './App.css'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Pdv />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/resgates" element={<Resgates />} />
        <Route path="/entradas" element={<Entries />} />
        <Route path="/pessoas" element={<Pessoas />} />
      </Routes>
    </>
  )
}
