import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './routes/Home'
import Products from './routes/Products'
import Pdv from './routes/Pdv'
import './App.css'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/pdv" element={<Pdv />} />
      </Routes>
    </>
  )
}
