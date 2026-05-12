import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contributor from './pages/Contributor'

export default function App() {
  return (
    <div style={{
      height: '100vh',
      display: 'grid',
      gridTemplateRows: 'auto 1fr auto',
      overflow: 'hidden'
    }}>
      <Navbar />
      <main style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contributor" element={<Contributor />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
