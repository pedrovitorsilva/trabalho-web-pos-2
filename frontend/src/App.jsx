import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './routes/Home'
import Produtos from './routes/Produtos'

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/produtos' element={<Produtos/>} />
      </Routes>
    </>
  )
}
